'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../../useAuth';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Search, Clock, Calendar, X, CheckCircle, AlertCircle, Plus, Edit, Trash2, ChevronLeft, ChevronRight, User, FileText, PauseCircle, Paperclip, Send, Filter, Menu, Grid, List, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import debounce from 'lodash/debounce';

// Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'multipart/form-data' },
  withCredentials: true,
});

// Form validation schemas
const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title must be less than 255 characters'),
  description: z.string().optional(),
  projectId: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('low'),
  status: z.enum(['pending', 'in progress', 'completed']).default('pending'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format').optional(),
  assigneeId: z.string().min(1, 'Assignee is required'),
  documents: z.array(z.any()).optional(),
  subTasks: z.array(z.string()).optional(),
  isMandatory: z.boolean().default(false),
  comments: z.array(z.object({
    text: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
    createdBy: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    _id: z.string().optional(),
  })).optional(),
});

const filterSchema = z.object({
  search: z.string().optional().transform(val => val?.trim() || ''),
  priority: z.enum(['all', 'low', 'medium', 'high']).default('all'),
  project: z.string().optional().default('all').transform(val => val === 'all' ? '' : val),
  assigned: z.enum(['all', 'mine']).default('all'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
});

const commentSchema = z.object({
  text: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
});

export default function Tasks() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    priority: 'all',
    project: 'all',
    assigned: 'all',
    page: 1,
    limit: 12,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterErrors, setFilterErrors] = useState({});
  const [view, setView] = useState('list');
  const [dateType, setDateType] = useState('default');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [subTasks, setSubTasks] = useState([]);
  const [newSubTask, setNewSubTask] = useState('');
  const [comments, setComments] = useState([]);
  const commentsRef = useRef(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      projectId: 'none',
      priority: 'low',
      status: 'pending',
      dueDate: '',
      assigneeId: user ? user._id : '',
      documents: [],
      subTasks: [],
      isMandatory: false,
      comments: [],
    },
  });

  const { register: registerComment, handleSubmit: handleCommentSubmit, watch: watchComment, formState: { errors: commentErrors, isSubmitting: commentIsSubmitting }, reset: resetComment } = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: { text: '' },
  });

  const dueDate = watch('dueDate');
  const status = watch('status');
  const priority = watch('priority');
  const documents = watch('documents');
  const isMandatory = watch('isMandatory');
  const formComments = watch('comments');

  const priorityOptions = {
    low: { label: 'Low', color: 'bg-green-100 text-green-800 border border-green-200', icon: <ArrowDown size={12} /> },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border border-yellow-200', icon: <PauseCircle size={12} /> },
    high: { label: 'High', color: 'bg-red-100 text-red-800 border border-red-200', icon: <ArrowUp size={12} /> },
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-xs text-green-800 border-green-200';
      case 'in progress': return 'bg-blue-100 text-xs text-blue-800 border-blue-200';
      case 'pending': return 'bg-orange-100 text-xs text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-xs text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '💤';
      default: return '📌';
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const fetchUsers = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const response = await api.get('/teams/my-invitations');
      const fetchedUsers = response.data.invitations.map(invitation => ({
        _id: invitation.id,
        name: invitation.name || invitation.email,
      }));
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Fetch users error:', {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        response: error.response?.data,
      });
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
      toast.error(error.response?.data?.message || 'Failed to fetch team members');
    } finally {
      setIsSubmitting(false);
    }
  }, [router]);

  const fetchTasksAndStats = useCallback(async (overrideFilters = filters) => {
    try {
      setIsSubmitting(true);
      const validatedFilters = filterSchema.parse(overrideFilters);
      const params = new URLSearchParams();
      if (validatedFilters.search) params.append('search', validatedFilters.search);
      if (validatedFilters.priority !== 'all') params.append('priority', validatedFilters.priority);
      if (validatedFilters.project) params.append('project', validatedFilters.project);
      if (validatedFilters.assigned === 'mine' && user) params.append('assigned', user._id);
      params.append('page', validatedFilters.page.toString());
      params.append('limit', validatedFilters.limit.toString());

      const response = await api.get(`/tasks/tasks?${params.toString()}`);
      const fetchedTasks = response.data.tasks || [];
      setTasks(fetchedTasks);
      setStats({
        totalTasks: response.data.total || fetchedTasks.length,
        completedTasks: fetchedTasks.filter(t => t.status === 'completed').length,
        pendingTasks: fetchedTasks.filter(t => t.status === 'pending').length,
        inProgressTasks: fetchedTasks.filter(t => t.status === 'in progress').length,
        overdueTasks: fetchedTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
      });
    } catch (error) {
      console.error('Fetch tasks error:', {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        errors: error.response?.data?.errors || [],
        response: error.response?.data,
      });
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } else if (error.response?.status === 400 && error.response?.data?.errors) {
        toast.error(`Validation failed: ${error.response.data.errors.join(', ')}`);
        const defaultFilters = filterSchema.parse({
          search: '',
          priority: 'all',
          project: 'all',
          assigned: 'all',
          page: 1,
          limit: 12,
        });
        setFilters(defaultFilters);
        setFilterErrors({ global: 'Invalid filters applied, reset to defaults' });
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch tasks');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [filters, user, router]);

  const fetchProjects = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const response = await api.get('/projects/get-projects', { withCredentials: true });
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Fetch projects error:', {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        response: error.response?.data,
      });
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
      toast.error(error.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setIsSubmitting(false);
    }
  }, [router]);

  const fetchComments = useCallback(async (taskId) => {
    try {
      const response = await api.get(`/tasks/task/${taskId}`);
      setComments((response.data.comments || []).reverse());
      setValue('comments', response.data.comments || []);
    } catch (error) {
      console.error('Fetch comments error:', {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        response: error.response?.data,
      });
      toast.error(error.response?.data?.message || 'Failed to fetch comments');
    }
  }, [setValue]);

  const handleCommentSubmitHandler = async (data) => {
    if (!data.text?.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const prevFormComments = watch('comments') || [];
    const optimisticForForm = {
      _id: tempId,
      text: data.text,
      createdBy: user._id,
      createdAt: new Date().toISOString(),
    };
    const tempForDisplay = { ...optimisticForForm, isTemp: true };

    // Optimistic UI update
    setValue('comments', [...prevFormComments, optimisticForForm]);
    setComments((prev) => [tempForDisplay, ...prev]);
    resetComment();

    try {
      if (modalMode === 'add') {
        toast.success('Comment added to new task');
      } else if (editingTaskId) {
        const { data: savedComment } = await api.post(
          `/tasks/task/${editingTaskId}/comments`,
          { text: data.text }
        );

        const realComment = savedComment;

        // Replace in display
        setComments((prev) =>
          prev.map((c) => (c._id === tempId ? { ...realComment, isTemp: false } : c))
        );

        // Replace in form
        setValue(
          'comments',
          watch('comments').map((c) => (c._id === tempId ? realComment : c))
        );

        toast.success('Comment added successfully');
      }
    } catch (error) {
      console.error('Submit comment error:', error);
      toast.error('Failed to add comment');
      // Rollback display
      setComments((prev) => prev.filter((c) => c._id !== tempId));
      // Rollback form
      setValue('comments', prevFormComments);
    }
  };

  // Auto-scroll effect for new comments
  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
    }
  }, [comments]);

  const debouncedFetchTasksAndStats = useCallback(
    debounce((newFilters) => {
      fetchTasksAndStats(newFilters);
    }, 500),
    [fetchTasksAndStats]
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.replace('/login?redirect=/assigned');
    } else if (isAuthenticated && user) {
      fetchUsers();
      fetchProjects();
      fetchTasksAndStats();
    }
  }, [isAuthenticated, isLoading, user, fetchUsers, fetchProjects, fetchTasksAndStats, router]);

  const handleAddTask = () => {
    setModalMode('add');
    setEditingTaskId(null);
    setComments([]);
    reset({
      title: '',
      description: '',
      projectId: 'none',
      priority: 'low',
      status: 'pending',
      dueDate: '',
      assigneeId: user ? user._id : '',
      documents: [],
      subTasks: [],
      isMandatory: false,
      comments: [],
    });
    setSubTasks([]);
    setIsModalOpen(true);
  };

  const handleEditTask = async (taskId) => {
    try {
      setIsSubmitting(true);
      const response = await api.get(`/tasks/task/${taskId}`);
      const task = response.data;
      setModalMode('edit');
      setEditingTaskId(task._id);
      setValue('title', task.title);
      setValue('description', task.description || '');
      setValue('projectId', task.projectId ? task.projectId.toString() : 'none');
      setValue('priority', task.priority);
      setValue('status', task.status);
      setValue('dueDate', task.dueDate ? task.dueDate.split('T')[0] : '');
      setValue('assigneeId', task.assigneeId ? task.assigneeId.toString() : '');
      setValue('documents', task.documents || []);
      setValue('subTasks', task.subTasks || []);
      setValue('isMandatory', task.isMandatory || false);
      setValue('comments', task.comments || []);
      setSubTasks(task.subTasks || []);
      setComments((task.comments || []).reverse());
      setIsModalOpen(true);
    } catch (error) {
      console.error('Fetch task error:', {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        response: error.response?.data,
      });
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
      toast.error(error.response?.data?.message || 'Failed to fetch task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'documents') {
          value.forEach(file => formData.append('documents', file));
        } else if (key === 'subTasks' || key === 'comments') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'projectId' && value === 'none') {
          // Skip projectId if 'none'
        } else {
          formData.append(key, value);
        }
      });

      if (modalMode === 'add') {
        await api.post('/tasks/create-task', formData);
        toast.success('Task created successfully');
      } else {
        await api.put(`/tasks/update-task/${editingTaskId}`, formData);
        toast.success('Task updated successfully');
      }
      fetchTasksAndStats();
      setIsModalOpen(false);
      reset();
      setSubTasks([]);
      setComments([]);
    } catch (error) {
      console.error('Submit task error:', {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        response: error.response?.data,
      });
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
      toast.error(error.response?.data?.message || 'Failed to submit task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskAction = async (taskId, action) => {
    try {
      setIsSubmitting(true);
      if (action === 'complete') {
        await api.patch(`/tasks/update-task/status/${taskId}`, { status: 'completed' });
        toast.success('Task completed');
      } else if (action === 'delete') {
        await api.delete(`/tasks/delete-task/${taskId}`);
        toast.success('Task deleted');
      }
      fetchTasksAndStats();
    } catch (error) {
      console.error('Task action error:', {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        response: error.response?.data,
      });
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
      toast.error(error.response?.data?.message || 'Failed to perform action');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (!selectedTasks.length) {
      toast.error('No tasks selected');
      return;
    }
    try {
      setIsSubmitting(true);
      if (action === 'complete') {
        await api.post('/tasks/bulk-update-status', { taskIds: selectedTasks, status: 'completed' });
        toast.success('Selected tasks completed');
      } else if (action === 'delete') {
        await api.post('/tasks/bulk-delete', { taskIds: selectedTasks });
        toast.success('Selected tasks deleted');
      }
      setSelectedTasks([]);
      fetchTasksAndStats();
    } catch (error) {
      console.error('Bulk action error:', {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        response: error.response?.data,
      });
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
      toast.error(error.response?.data?.message || 'Failed to perform bulk action');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    try {
      const validatedFilters = filterSchema.parse(newFilters);
      setFilters(validatedFilters);
      setFilterErrors({});
      debouncedFetchTasksAndStats(validatedFilters);
    } catch (error) {
      setFilterErrors(error.flatten().fieldErrors);
      toast.error('Invalid filter values');
    }
  };

  const clearFilters = () => {
    const defaultFilters = filterSchema.parse({
      search: '',
      priority: 'all',
      project: 'all',
      assigned: 'all',
      page: 1,
      limit: 12,
    });
    setFilters(defaultFilters);
    setSelectedTasks([]);
    setFilterErrors({});
    setShowFilters(false);
    fetchTasksAndStats(defaultFilters);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setValue('documents', [...documents, ...files]);
  };

  const handleAddSubTask = () => {
    if (newSubTask.trim()) {
      setSubTasks([...subTasks, newSubTask]);
      setValue('subTasks', [...subTasks, newSubTask]);
      setNewSubTask('');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="h-12 w-12 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs text-gray-600">Loading your tasks...</p>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
    return null;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-2 sm:p-4 md:p-6 pt-16 sm:pt-20 md:pt-24 text-xs font-medium leading-relaxed">
        <Toaster position="top-right" toastOptions={{ className: 'text-xs' }} />
        <div className="max-w-7xl mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-3 sm:p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900">Tasks</h1>
                <p className="text-xs text-gray-600 mt-1">
                  {stats.totalTasks} tasks
                </p>
              </div>
              <div className="flex gap-1 sm:gap-2">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 sm:p-3 bg-white/70 border border-gray-300/50 rounded-xl hover:shadow-md transition-all"
                >
                  <Filter size={14} />
                </Button>
                <Button
                  onClick={handleAddTask}
                  className="p-2 sm:p-3 bg-gradient-to-r from-[#00BFFF] to-blue-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <Plus size={14} />
                </Button>
                <Button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 sm:p-3 bg-white/70 border border-gray-300/50 rounded-xl hover:shadow-md transition-all"
                >
                  <Menu size={14} />
                </Button>
              </div>
            </div>
          </div>

          {/* View Selectors */}
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setView('list')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shadow-sm ${view === 'list'
                  ? 'bg-gradient-to-r from-[#00BFFF] to-blue-500 text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/70 hover:shadow-md bg-white/50'
                  }`}
              >
                <List size={12} className="inline mr-1" /> List
              </button>
              <button
                onClick={() => setView('kanban')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shadow-sm ${view === 'kanban'
                  ? 'bg-gradient-to-r from-[#00BFFF] to-blue-500 text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/70 hover:shadow-md bg-white/50'
                  }`}
              >
                <Grid size={12} className="inline mr-1" /> Kanban
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shadow-sm ${view === 'calendar'
                  ? 'bg-gradient-to-r from-[#00BFFF] to-blue-500 text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/70 hover:shadow-md bg-white/50'
                  }`}
              >
                <Calendar size={12} className="inline mr-1" /> Calendar
              </button>
            </div>
          </div>

          {/* Desktop Filters Row */}
          <div className="hidden lg:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={14} />
                  <Input
                    type="text"
                    placeholder="Search tasks..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 py-3 border border-gray-300/50 rounded-xl bg-white/50 text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent transition-all shadow-sm hover:shadow-md"
                  />
                </div>
              </div>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="px-4 py-3 border border-gray-300/50 rounded-xl bg-white/50 text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent transition-all shadow-sm hover:shadow-md"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                value={filters.project}
                onChange={(e) => handleFilterChange('project', e.target.value)}
                className="px-4 py-3 border border-gray-300/50 rounded-xl bg-white/50 text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent transition-all shadow-sm hover:shadow-md"
              >
                <option value="all">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <select
                value={filters.assigned}
                onChange={(e) => handleFilterChange('assigned', e.target.value)}
                className="px-4 py-3 border border-gray-300/50 rounded-xl bg-white/50 text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent transition-all shadow-sm hover:shadow-md"
              >
                <option value="all">All Tasks</option>
                <option value="mine">My Tasks</option>
              </select>
              <select
                value={dateType}
                onChange={(e) => setDateType(e.target.value)}
                className="px-4 py-3 border border-gray-300/50 rounded-xl bg-white/50 text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent transition-all shadow-sm hover:shadow-md"
              >
                <option value="default">Date Type</option>
                <option value="due-date">Due Date</option>
                <option value="created-date">Created Date</option>
              </select>
              <Button
                onClick={handleAddTask}
                className="px-6 py-3 bg-gradient-to-r from-[#00BFFF] to-blue-500 text-white rounded-xl text-xs font-semibold hover:from-blue-500 hover:to-[#00BFFF] transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                disabled={isSubmitting}
              >
                + Add Task
              </Button>
            </div>
            {filterErrors.global && (
              <p className="text-xs text-red-600 mt-2">{filterErrors.global}</p>
            )}
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 mb-6 space-y-3 sm:space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={14} />
                  <Input
                    type="text"
                    placeholder="Search tasks..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 py-3 border border-gray-300/50 rounded-xl bg-white/50 text-xs shadow-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={filters.priority}
                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                    className="px-3 py-3 border border-gray-300/50 rounded-xl bg-white/50 text-xs shadow-sm"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <select
                    value={filters.assigned}
                    onChange={(e) => handleFilterChange('assigned', e.target.value)}
                    className="px-3 py-3 border border-gray-300/50 rounded-xl bg-white/50 text-xs shadow-sm"
                  >
                    <option value="all">All Tasks</option>
                    <option value="mine">My Tasks</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-3 border border-gray-300/50 bg-gray-100/50 text-gray-700 rounded-xl text-xs font-semibold hover:shadow-md transition-all"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#00BFFF] to-blue-500 text-white rounded-xl text-xs font-semibold hover:shadow-lg transition-all"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Page Header */}
          <div className="hidden lg:block mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold text-gray-900">Assigned Tasks</h1>
                <p className="text-xs text-gray-600 mt-1">
                  Manage your tasks efficiently with advanced filtering and views
                </p>
              </div>
              <button
                onClick={() => fetchTasksAndStats()}
                className="flex items-center gap-2 px-4 py-3 bg-white/70 border border-gray-300/50 rounded-xl hover:bg-white hover:shadow-md transition-all shadow-sm text-xs font-semibold text-gray-700"
                disabled={isSubmitting}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          {Object.values(stats).some(val => val > 0) && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-xs sm:text-sm font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#00BFFF]" /> Task Overview
              </h2>
              <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-5">
                {[
                  { icon: FileText, label: 'Total Tasks', value: stats.totalTasks, color: 'text-[#00BFFF]' },
                  { icon: CheckCircle, label: 'Completed', value: stats.completedTasks, color: 'text-green-600' },
                  { icon: Clock, label: 'Pending', value: stats.pendingTasks, color: 'text-yellow-600' },
                  { icon: PauseCircle, label: 'In Progress', value: stats.inProgressTasks, color: 'text-blue-600' },
                  { icon: AlertCircle, label: 'Overdue', value: stats.overdueTasks, color: 'text-red-600' },
                ].map((stat, i) => (
                  <div key={i} className="p-3 sm:p-4 bg-gradient-to-r from-white/50 to-gray-50/50 border border-gray-200/50 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-600">{stat.label}</p>
                        <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
                        {stat.label === 'Overdue' && stat.value > 0 && (
                          <p className="text-xs text-red-600 mt-1 flex items-center">
                            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> {stat.value} Overdue
                          </p>
                        )}
                      </div>
                      <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Priority Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3">
                Filter by Priority
              </label>
              <div className="flex gap-2 flex-wrap">
                {['all', 'low', 'medium', 'high'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => handleFilterChange('priority', filterType)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${filters.priority === filterType
                      ? 'bg-gradient-to-r from-[#00BFFF] to-blue-500 text-white shadow-lg'
                      : 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/50 hover:shadow-md'
                      }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Project and Assigned Filters */}
          <div className="hidden lg:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Project
                </label>
                <select
                  value={filters.project}
                  onChange={(e) => handleFilterChange('project', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300/50 rounded-xl bg-white/50 text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent transition-all shadow-sm hover:shadow-md"
                >
                  <option value="all">All Projects</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Assigned To
                </label>
                <select
                  value={filters.assigned}
                  onChange={(e) => handleFilterChange('assigned', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300/50 rounded-xl bg-white/50 text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent transition-all shadow-sm hover:shadow-md"
                >
                  <option value="all">All Tasks</option>
                  <option value="mine">My Tasks Only</option>
                </select>
              </div>
            </div>
            <Button
              onClick={clearFilters}
              className="mt-4 px-6 py-3 border border-gray-300/50 bg-gray-100/50 text-gray-700 rounded-xl hover:bg-gray-200/50 transition-all shadow-sm text-xs sm:text-sm font-semibold hover:shadow-md"
            >
              <X className="w-4 h-4 mr-2" /> Clear All Filters
            </Button>
          </div>

          {/* Content */}
          {view === 'list' ? (
            <>
              {isSubmitting ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="h-8 w-8 border-3 border-[#00BFFF] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-xs text-gray-600">Loading tasks...</p>
                  </div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 sm:p-8 md:p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
                  <p className="text-xs text-gray-600 max-w-sm mx-auto mb-6">
                    No tasks match your current filters. Try adjusting your selection or add a new task.
                  </p>
                  <Button
                    onClick={handleAddTask}
                    className="px-6 py-3 bg-gradient-to-r from-[#00BFFF] to-blue-500 text-white rounded-xl text-xs sm:text-sm font-semibold hover:shadow-xl transition-all shadow-lg"
                    disabled={isSubmitting}
                  >
                    + Add New Task
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {tasks.map((task) => {
                      const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
                      const assigneeName = users.find(u => u._id === task.assigneeId)?.name || 'Unassigned';
                      const projectName = projects.find(p => p.id === task.projectId)?.name || 'No Project';
                      return (
                        <div
                          key={task._id}
                          className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border ${isOverdue ? 'border-red-200/50' : 'border-gray-200/50'} hover:shadow-2xl transition-all duration-300 overflow-hidden group`}
                        >
                          <div className="p-4 sm:p-6 border-b border-gray-100/50">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#00BFFF] to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                                    {task.title}
                                  </h3>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {assigneeName}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() => handleEditTask(task._id)}
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-[#00BFFF] hover:text-[#00BFFF]/80 hover:bg-blue-50/50 rounded-full transition-all shadow-sm"
                                      disabled={isSubmitting}
                                    >
                                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Edit Task</p>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() => handleTaskAction(task._id, 'delete')}
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50/50 rounded-full transition-all shadow-sm"
                                      disabled={isSubmitting}
                                    >
                                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Delete Task</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {task.description || 'No description provided'}
                            </p>
                          </div>
                          <div className="p-4 sm:p-6 space-y-4">
                            <div className="flex gap-2 flex-wrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status).replace('text-xs', '')}`}>
                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${priorityOptions[task.priority].color}`}>
                                <span className="mr-1">{getPriorityIcon(task.priority)}</span>
                                {priorityOptions[task.priority].label}
                              </span>
                            </div>
                            {task.dueDate && (
                              <div className={`flex items-center gap-2 text-xs sm:text-sm ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                                <Calendar className="w-4 h-4" />
                                <span>Due: {formatDate(task.dueDate)}</span>
                              </div>
                            )}
                            <div className="pt-4 border-t border-gray-100/50 space-y-3">
                              <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="text-gray-500 flex items-center">
                                  <User className="w-4 h-4 mr-2" />
                                  Assigned to:
                                </span>
                                <span className="font-semibold text-gray-900 truncate ml-2 max-w-[100px]">{assigneeName}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="text-gray-500 flex items-center">
                                  <FileText className="w-4 h-4 mr-2" />
                                  Project:
                                </span>
                                <span className="font-semibold text-gray-900 truncate ml-2 max-w-[100px]">{projectName}</span>
                              </div>
                            </div>
                          </div>
                          <div className="px-4 sm:px-6 py-4 bg-gray-50/50 border-t border-gray-100/50">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
                              {task.status !== 'completed' && (
                                <Button
                                  onClick={() => handleTaskAction(task._id, 'complete')}
                                  size="sm"
                                  className="px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-xs hover:shadow-lg transition-all shadow-md"
                                  disabled={isSubmitting}
                                >
                                  Mark Completed
                                </Button>
                              )}
                              <button
                                onClick={() => handleEditTask(task._id)}
                                className="py-2 px-3 bg-white/70 border border-gray-300/50 rounded-xl text-xs font-semibold text-gray-700 hover:bg-white hover:shadow-md transition-all"
                              >
                                View Details
                              </button>
                            </div>
                            <div className="text-xs sm:text-sm font-semibold text-gray-600">Progress: {task.progress || 0}%</div>
                            <div className="w-full bg-gray-200/50 rounded-full h-2 mt-1 overflow-hidden">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${task.progress === 100 ? 'bg-gradient-to-r from-green-500 to-green-600' : task.progress >= 90 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-gradient-to-r from-[#00BFFF] to-blue-500'
                                  }`}
                                style={{ width: `${task.progress || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 sm:mt-8 text-center">
                    <p className="text-xs text-gray-600">
                      Showing {tasks.length} of {stats.totalTasks} tasks
                    </p>
                  </div>
                  {stats.totalTasks > filters.limit && (
                    <div className="mt-6 sm:mt-8">
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 shadow-lg">
                        <Button
                          disabled={filters.page === 1 || isSubmitting}
                          onClick={() => handleFilterChange('page', filters.page - 1)}
                          className="px-4 py-3 bg-gradient-to-r from-[#00BFFF] to-blue-500 text-white rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto hover:shadow-xl"
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                        </Button>
                        <p className="text-xs text-gray-600">
                          Page {filters.page} of {Math.ceil(stats.totalTasks / filters.limit)}
                        </p>
                        <Button
                          disabled={filters.page >= Math.ceil(stats.totalTasks / filters.limit) || isSubmitting}
                          onClick={() => handleFilterChange('page', filters.page + 1)}
                          className="px-4 py-3 bg-gradient-to-r from-[#00BFFF] to-blue-500 text-white rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto hover:shadow-xl"
                        >
                          Next <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 sm:p-12 text-center">
              <p className="text-xs text-gray-600">This view is coming soon. Stay tuned!</p>
            </div>
          )}

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="p-0 w-[95vw] lg:max-w-[1280px] h-[90vh] max-h-[90vh] overflow-hidden bg-gradient-to-br from-white via-white/95 to-gray-50/95 rounded-2xl border border-gray-200/60 shadow-2xl font-sans text-[11px]">
              <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col min-h-0">
                <DialogHeader className="px-4 py-3 lg:px-6 lg:py-4 bg-white/80 border-b border-gray-200/60">
                  <DialogTitle className="text-[13px] font-bold text-gray-900">
                    {modalMode === 'add' ? 'Create New Task' : 'Edit Task'}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col lg:flex-row h-full min-h-0">
                  <div className="flex-1 p-4 sm:p-5 lg:p-6 overflow-y-auto bg-gradient-to-b from-gray-50/95 to-white/95 border-r border-gray-200/60">
                    <div className="space-y-1.5 mb-4">
                      <label htmlFor="title" className="text-[11px] font-semibold text-gray-700">Task Title <span className="text-red-500">*</span></label>
                      <Input
                        id="title"
                        placeholder="Enter task title..."
                        {...register('title')}
                        className="w-full px-3 py-2 border border-gray-300/60 rounded-lg text-[11px] focus:outline-none focus:ring-2 focus:ring-[#00BFFF] bg-white/80 shadow-sm hover:shadow-md transition-all"
                        aria-invalid={errors.title ? 'true' : 'false'}
                        aria-describedby={errors.title ? 'title-error' : undefined}
                      />
                      {errors.title && (
                        <p className="text-[11px] text-red-600 pl-1" id="title-error">{errors.title.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5 mb-4">
                      <label htmlFor="dueDate" className="text-[11px] font-semibold text-gray-700 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> Due Date
                      </label>
                      <div className="relative">
                        <DatePicker
                          id="dueDate"
                          selected={dueDate ? new Date(dueDate) : null}
                          onChange={(date) => setValue('dueDate', date ? date.toISOString().split('T')[0] : '')}
                          placeholderText="Select due date (YYYY-MM-DD)"
                          dateFormat="yyyy-MM-dd"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300/60 rounded-lg text-[11px] focus:outline-none focus:ring-2 focus:ring-[#00BFFF] bg-white/80 shadow-sm hover:shadow-md transition-all"
                          aria-invalid={errors.dueDate ? 'true' : 'false'}
                          aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
                        />
                        <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={12} />
                      </div>
                      {errors.dueDate && (
                        <p className="text-[11px] text-red-600 pl-1" id="dueDate-error">{errors.dueDate.message}</p>
                      )}
                    </div>
                    <div className="flex gap-2 mb-4 pl-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold border ${getStatusColor(status)}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold ${priorityOptions[priority].color}`}>
                        <span className="mr-1">{getPriorityIcon(priority)}</span>
                        {priorityOptions[priority].label}
                      </span>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      <label htmlFor="status" className="text-[11px] font-semibold text-gray-700">Status</label>
                      <Select
                        onValueChange={(value) => setValue('status', value)}
                        defaultValue="pending"
                      >
                        <SelectTrigger className="w-full px-3 py-2 border border-gray-300/60 rounded-lg text-[11px] focus:outline-none focus:ring-2 focus:ring-[#00BFFF] bg-white/80 shadow-sm hover:shadow-md transition-all">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending" className="text-[11px]">Pending</SelectItem>
                          <SelectItem value="in progress" className="text-[11px]">In Progress</SelectItem>
                          <SelectItem value="completed" className="text-[11px]">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      <label htmlFor="priority" className="text-[11px] font-semibold text-gray-700">Priority</label>
                      <Select
                        onValueChange={(value) => setValue('priority', value)}
                        defaultValue="low"
                      >
                        <SelectTrigger className="w-full px-3 py-2 border border-gray-300/60 rounded-lg text-[11px] focus:outline-none focus:ring-2 focus:ring-[#00BFFF] bg-white/80 shadow-sm hover:shadow-md transition-all">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low" className="text-[11px]">Low</SelectItem>
                          <SelectItem value="medium" className="text-[11px]">Medium</SelectItem>
                          <SelectItem value="high" className="text-[11px]">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      <label htmlFor="description" className="text-[11px] font-semibold text-gray-700">Task Description</label>
                      <Textarea
                        id="description"
                        placeholder="Enter detailed task description (optional)..."
                        {...register('description')}
                        className="w-full px-3 py-2 border border-gray-300/60 rounded-lg text-[11px] focus:outline-none focus:ring-2 focus:ring-[#00BFFF] bg-white/80 shadow-sm hover:shadow-md transition-all"
                        rows={4}
                      />
                    </div>
                    <div className="space-y-1.5 mb-4">
                      <label htmlFor="projectId" className="text-[11px] font-semibold text-gray-700 flex items-center">
                        <FileText className="w-3 h-3 mr-1" /> Project
                      </label>
                      <Select
                        onValueChange={(value) => setValue('projectId', value)}
                        defaultValue="none"
                      >
                        <SelectTrigger className="w-full px-3 py-2 border border-gray-300/60 rounded-lg text-[11px] focus:outline-none focus:ring-2 focus:ring-[#00BFFF] bg-white/80 shadow-sm hover:shadow-md transition-all">
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" className="text-[11px]">No Project</SelectItem>
                          {projects.map((p) => (
                            <SelectItem key={p.id} value={p.id} className="text-[11px]">{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      <label htmlFor="assigneeId" className="text-[11px] font-semibold text-gray-700 flex items-center">
                        <User className="w-3 h-3 mr-1" /> Assignee/Team <span className="text-red-500">*</span>
                      </label>
                      <Select
                        onValueChange={(value) => setValue('assigneeId', value)}
                        defaultValue={user ? user._id : ''}
                      >
                        <SelectTrigger className="w-full px-3 py-2 border border-gray-300/60 rounded-lg text-[11px] focus:outline-none focus:ring-2 focus:ring-[#00BFFF] bg-white/80 shadow-sm hover:shadow-md transition-all">
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((u) => (
                            <SelectItem key={u._id} value={u._id} className="text-[11px]">{u.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.assigneeId && (
                        <p className="text-[11px] text-red-600 pl-1" id="assigneeId-error">{errors.assigneeId.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5 mb-4">
                      <label className="text-[11px] font-semibold text-gray-700 flex items-center">
                        <Paperclip className="w-3 h-3 mr-1" /> Upload Document
                      </label>
                      <div className="relative">
                        <Input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="w-full px-3 py-2 border border-gray-300/60 rounded-lg text-[11px] focus:outline-none focus:ring-2 focus:ring-[#00BFFF] bg-white/80 shadow-sm hover:shadow-md transition-all"
                        />
                        <Paperclip className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={12} />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(watch('documents') || []).map((doc, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-gray-100/80 text-gray-800 text-[11px] rounded-full shadow-sm"
                          >
                            {doc.name}
                            <button
                              type="button"
                              onClick={() => setValue('documents', (watch('documents') || []).filter((_, i) => i !== index))}
                              className="ml-1.5 text-gray-600 hover:text-gray-800"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      <label className="text-[11px] font-semibold text-gray-700 flex items-center">
                        <Plus className="w-3 h-3 mr-1" /> Add Sub Task
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter sub task..."
                          value={newSubTask}
                          onChange={(e) => setNewSubTask(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300/60 rounded-lg text-[11px] focus:outline-none focus:ring-2 focus:ring-[#00BFFF] bg-white/80 shadow-sm hover:shadow-md transition-all"
                        />
                        <Button
                          type="button"
                          onClick={handleAddSubTask}
                          className="px-3 py-2 bg-gradient-to-r from-[#00BFFF] to-blue-500 text-white rounded-lg text-[11px] font-semibold hover:shadow-lg transition-all shadow-md"
                          disabled={!newSubTask.trim()}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(watch('subTasks') || []).map((task, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-blue-100/80 text-blue-800 text-[11px] rounded-full shadow-sm"
                          >
                            {task}
                            <button
                              type="button"
                              onClick={() => {
                                const updatedSubTasks = (watch('subTasks') || []).filter((_, i) => i !== index);
                                setSubTasks(updatedSubTasks);
                                setValue('subTasks', updatedSubTasks);
                              }}
                              className="ml-1.5 text-blue-600 hover:text-blue-800"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      <label className="text-[11px] font-semibold text-gray-700 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Mark as Mandatory
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          {...register('isMandatory')}
                          className="h-3.5 w-3.5 text-[#00BFFF] border-gray-300 rounded focus:ring-[#00BFFF]"
                        />
                        <span className="ml-1.5 text-[11px] text-gray-600">This task is mandatory</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col bg-white/80 min-h-0">
                    <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-200/60 bg-gradient-to-r from-blue-50/95 to-cyan-50/95 flex-shrink-0">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-[11px] font-semibold text-gray-700">Task Progress</div>
                        <div className="flex gap-1.5">
                          <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-600 hover:bg-gray-100/80 rounded-full shadow-sm">
                            <Paperclip size={10} />
                          </Button>
                          <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-600 hover:bg-gray-100/80 rounded-full shadow-sm">
                            <FileText size={10} />
                          </Button>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200/60 rounded-full h-1 mb-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#00BFFF] to-blue-500 h-1 rounded-full transition-all duration-300 shadow-sm"
                          style={{ width: '45%' }}
                        ></div>
                      </div>
                      <div className="text-[11px] text-gray-500 text-right">45%</div>
                    </div>
                    <Tabs defaultValue="comment" className="flex-1 min-h-0">
                      <TabsList className="grid w-full grid-cols-3 bg-gray-50/95 border-b border-gray-200/60 p-1 rounded-none flex-shrink-0">
                        <TabsTrigger value="comment" className="text-[11px] data-[state=active]:bg-white/90 data-[state=active]:text-[#00BFFF] data-[state=active]:shadow-sm rounded-lg transition-all py-1.5">Comments</TabsTrigger>
                        <TabsTrigger value="attachment" className="text-[11px] data-[state=active]:bg-white/90 data-[state=active]:text-[#00BFFF] data-[state=active]:shadow-sm rounded-lg transition-all py-1.5">Attachments</TabsTrigger>
                        <TabsTrigger value="history" className="text-[11px] data-[state=active]:bg-white/90 data-[state=active]:text-[#00BFFF] data-[state=active]:shadow-sm rounded-lg transition-all py-1.5">History</TabsTrigger>
                      </TabsList>
                      <TabsContent value="comment" className="flex-1 min-h-0">
                        <div ref={commentsRef} className="overflow-y-auto -mt-[200px] p-4 sm:p-5 lg:p-6 space-y-3 h-full">
                          {comments.length > 0 ? (
                            comments.map((comment, index) => (
                              <div key={comment._id || index} className="flex items-start gap-2 border-b border-gray-200/50 pb-3 last:border-b-0">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-[#00BFFF] to-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                                  {users.find(u => u._id === comment.createdBy)?.name?.[0] || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center">
                                    <p className="text-[11px] font-semibold text-gray-800 truncate">
                                      {users.find(u => u._id === comment.createdBy)?.name || 'Unknown User'}
                                    </p>
                                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                      {comment.isTemp ? (
                                        <>
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                          Sending...
                                        </>
                                      ) : (
                                        formatDateTime(comment.createdAt)
                                      )}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-gray-600 mt-1 break-words">{comment.text}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-[11px] text-gray-600 text-center py-4">No comments yet.</p>
                          )}
                        </div>
                        <form onSubmit={handleCommentSubmit(handleCommentSubmitHandler)}>
                          <div className="flex items-start gap-2 p-4 sm:p-5 lg:p-6 border-t border-gray-200/60">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-[#00BFFF] to-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-semibold mt-1 flex-shrink-0">
                              {user?.name?.[0] || 'U'}
                            </div>
                            <div className="flex-1">
                              <Textarea
                                placeholder="Add a comment..."
                                {...registerComment('text')}
                                className="w-full px-3 py-2 border border-gray-300/60 rounded-lg text-[11px] focus:outline-none focus:ring-2 focus:ring-[#00BFFF] bg-white/80 shadow-sm hover:shadow-md transition-all"
                                rows={3}
                              />
                              {commentErrors.text && (
                                <p className="text-[11px] text-red-600 pl-1 mt-1">{commentErrors.text.message}</p>
                              )}
                              <Button
                                type="submit"
                                disabled={commentIsSubmitting || !watchComment('text')?.trim()}
                                className="mt-2"
                              >
                                {commentIsSubmitting ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                  </>
                                ) : (
                                  'Add Comment'
                                )}
                              </Button>
                            </div>
                          </div>
                        </form>
                      </TabsContent>
                      <TabsContent value="attachment" className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 space-y-3 min-h-0">
                        <p className="text-[11px] text-gray-600">No attachments available.</p>
                      </TabsContent>
                      <TabsContent value="history" className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 space-y-3 min-h-0">
                        <p className="text-[11px] text-gray-600">No history available.</p>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
                <DialogFooter className="p-4 sm:p-5 lg:p-6 bg-white/80 border-t border-gray-200/60 flex justify-end gap-2">
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300/60 bg-gray-100/80 text-gray-700 rounded-lg text-[11px] font-semibold hover:shadow-md transition-all shadow-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gradient-to-r from-[#00BFFF] to-blue-500 text-white rounded-lg text-[11px] font-semibold hover:shadow-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="h-4 w-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      modalMode === 'add' ? 'Create Task' : 'Update Task'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  );
}