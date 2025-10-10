'use client';

import { useAuth } from '../useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, Calendar, X, CheckCircle, AlertCircle, Plus, Edit, Trash2, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Form validation schema
const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters').max(255, 'Project name must be less than 255 characters'),
  description: z.string().optional(),
  status: z.enum(['active', 'completed']).default('active'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format'),
});

const filterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['all', 'active', 'completed']).default('all'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format').optional().or(z.literal('')),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format').optional().or(z.literal('')),
}).refine((data) => !data.startDate || !data.endDate || new Date(data.startDate) <= new Date(data.endDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// Custom hook for API calls
const useApi = () => {
  const apiCall = useCallback(async (config) => {
    try {
      const response = await axios({
        ...config,
        withCredentials: true,
        timeout: 10000,
      });
      return { data: response.data, error: null };
    } catch (error) {
      console.error('API Error:', error);
      return { 
        data: null, 
        error: error.response?.data?.error || error.message || 'An unexpected error occurred' 
      };
    }
  }, []);

  return { apiCall };
};

// Custom hook for projects data
const useProjects = (filters, isAuthenticated) => {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useApi();

  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filters,
        startDate: filters.startDate || '',
        endDate: filters.endDate || '',
      }).toString();
      
      const [projectsResponse, statsResponse] = await Promise.all([
        apiCall({ url: `${API_URL}/projects/get-projects?${params}` }),
        apiCall({ url: `${API_URL}/projects/statistics` }),
      ]);

      if (projectsResponse.error) throw new Error(projectsResponse.error);
      if (statsResponse.error) throw new Error(statsResponse.error);

      setProjects(projectsResponse.data.projects);
      setTotal(projectsResponse.data.total);
      setStatistics(statsResponse.data.statistics);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error(error.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [filters, isAuthenticated, apiCall]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, total, statistics, loading, refetch: fetchProjects };
};

export default function Projects() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    startDate: '',
    endDate: '',
    sortBy: 'created_at',
    order: 'DESC',
    page: 1,
    limit: 10,
  });
  const [filterErrors, setFilterErrors] = useState({});
  const [view, setView] = useState('list');
  const [dateType, setDateType] = useState('default');

  const { projects, total, statistics, loading: projectsLoading, refetch } = useProjects(filters, isAuthenticated);
  const { apiCall } = useApi();

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: '', description: '', status: 'active', dueDate: '' },
  });

  const dueDate = watch('dueDate');

  // Status color helper
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Memoized statistics display
  const statsDisplay = useMemo(() => (
    statistics.map((stat, i) => (
      <div
        key={stat.status || i}
        className="p-4 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-600 capitalize">{stat.status}</p>
            <p className="text-xs font-bold text-blue-600">{stat.count} Projects</p>
            {stat.overdue > 0 && (
              <p className="text-xs text-red-600 mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" /> {stat.overdue} Overdue
              </p>
            )}
          </div>
          <CheckCircle className="w-4 h-4 text-blue-600" />
        </div>
      </div>
    ))
  ), [statistics]);

  // Create/Update Project
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const url = editingProject
        ? `${API_URL}/projects/update-project/${editingProject.id}`
        : `${API_URL}/projects/create-project`;
      const method = editingProject ? 'put' : 'post';
      
      const { error } = await apiCall({
        method,
        url,
        data,
      });
      
      if (error) throw new Error(error);
      
      toast.success(editingProject ? 'Project updated successfully!' : 'Project created successfully!');
      reset();
      setIsModalOpen(false);
      setEditingProject(null);
      refetch();
    } catch (error) {
      console.error(`Error ${editingProject ? 'updating' : 'creating'} project:`, error);
      toast.error(error.message || `Failed to ${editingProject ? 'update' : 'create'} project`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Project
  const deleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      setIsSubmitting(true);
      const { error } = await apiCall({
        method: 'delete',
        url: `${API_URL}/projects/delete-project/${id}`,
      });
      
      if (error) throw new Error(error);
      
      toast.success('Project deleted successfully!');
      refetch();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(error.message || 'Failed to delete project');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit
  const handleEdit = (project) => {
    setEditingProject(project);
    setValue('name', project.name);
    setValue('description', project.description || '');
    setValue('status', project.status);
    setValue('dueDate', project.due_date.split('T')[0]);
    setIsModalOpen(true);
  };

  // Handle Filter/Sort Change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    const result = filterSchema.safeParse(newFilters);
    setFilterErrors(result.success ? {} : result.error.flatten().fieldErrors);
  };

  // Clear Filters
  const clearFilters = () => {
    const defaultFilters = {
      search: '',
      status: 'all',
      startDate: '',
      endDate: '',
      sortBy: 'created_at',
      order: 'DESC',
      page: 1,
      limit: 10,
    };
    setFilters(defaultFilters);
    setFilterErrors({});
  };

  // Close modal handler
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    reset();
  };

  // Loading state
  if (authLoading || projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs text-gray-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 pt-20 sm:pt-24">
        <Toaster position="top-right" toastOptions={{ className: 'text-xs' }} />
        <div className="max-w-7xl mx-auto">
          {/* View Selectors */}
          <div className="mb-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${view === 'list'
                  ? 'bg-[#00BFFF] text-white'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setView('kanban')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${view === 'kanban'
                  ? 'bg-[#00BFFF] text-white'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${view === 'calendar'
                  ? 'bg-[#00BFFF] text-white'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setView('customize')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${view === 'customize'
                  ? 'bg-[#00BFFF] text-white'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Customize
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Search */}
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={16} />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 py-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Dropdown */}
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
              >
                <option>Filter</option>
                {/* Add filter options as needed */}
              </select>

              {/* Status Dropdown */}
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>

              {/* Default/Layout Dropdown */}
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
              >
                <option value="created_at">Default</option>
                <option value="name">Name</option>
                <option value="due_date">Due Date</option>
              </select>

              {/* Date Type Dropdown */}
              <select
                value={dateType}
                onChange={(e) => setDateType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
              >
                <option value="default">Date Type</option>
                <option value="due-date">Due Date</option>
                <option value="created-date">Created Date</option>
              </select>

              {/* Add Project Button */}
              <Button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-[#00BFFF] text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors whitespace-nowrap"
                disabled={isSubmitting}
              >
                + Add Project
              </Button>
            </div>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xs font-bold text-gray-900">My Projects</h1>
                <p className="text-xs text-gray-600 mt-2">
                  Manage your projects efficiently
                </p>
              </div>
              <button
                onClick={refetch}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700"
                disabled={isSubmitting}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Statistics */}
          {statistics.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xs font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-[#00BFFF]" size={16} /> Project Overview
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {statsDisplay}
              </div>
            </div>
          )}

          {/* Project Status Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Project Status
              </label>
              <div className="flex gap-2 flex-wrap">
                {['all', 'active', 'completed'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => handleFilterChange('status', filterType)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${filters.status === filterType
                      ? 'bg-[#00BFFF] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {filterType === 'all' && 'All Projects'}
                    {filterType === 'active' && 'Active'}
                    {filterType === 'completed' && 'Completed'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <label className="block text-xs font-medium text-gray-700 mb-4">Date Range</label>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="relative">
                  <DatePicker
                    selected={filters.startDate ? new Date(filters.startDate) : null}
                    onChange={(date) => handleFilterChange('startDate', date ? date.toISOString().split('T')[0] : '')}
                    placeholderText="Start Date"
                    dateFormat="yyyy-MM-dd"
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-white"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={16} />
                </div>
                {filterErrors.startDate && (
                  <p className="text-xs text-red-600 mt-1">{filterErrors.startDate}</p>
                )}
              </div>
              <div>
                <div className="relative">
                  <DatePicker
                    selected={filters.endDate ? new Date(filters.endDate) : null}
                    onChange={(date) => handleFilterChange('endDate', date ? date.toISOString().split('T')[0] : '')}
                    placeholderText="End Date"
                    dateFormat="yyyy-MM-dd"
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-white"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={16} />
                </div>
                {filterErrors.endDate && (
                  <p className="text-xs text-red-600 mt-1">{filterErrors.endDate}</p>
                )}
              </div>
            </div>
            <Button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 border border-gray-300 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs"
            >
              <X className="w-4 h-4 mr-1" size={16} /> Clear Filters
            </Button>
          </div>

          {/* Content */}
          {view === 'list' ? (
            <>
              {projectsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="h-8 w-8 border-3 border-[#00BFFF] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-xs text-gray-600">Loading projects...</p>
                  </div>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xs font-medium text-gray-900 mb-2">No projects found</h3>
                  <p className="text-xs text-gray-600 max-w-sm mx-auto mb-6">
                    {total === 0
                      ? "You haven't added any projects. Welcome Let's get started."
                      : "No projects match your current filters. Try adjusting your selection."
                    }
                  </p>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2 bg-[#00BFFF] text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    Add Project
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map((project) => {
                      const isOverdue = new Date(project.due_date) < new Date() && project.status !== 'completed';
                      return (
                        <div
                          key={project.id}
                          className={`bg-white rounded-xl shadow-sm border ${isOverdue ? 'border-red-200' : 'border-gray-200'} hover:shadow-md transition-all duration-300 overflow-hidden group`}
                        >
                          {/* Project Header */}
                          <div className="p-6 border-b border-gray-100">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#00BFFF] to-blue-600 rounded-lg flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-gray-900 text-xs truncate">
                                    {project.name}
                                  </h3>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Project
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() => handleEdit(project)}
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-[#00BFFF] hover:text-[#00BFFF]/80"
                                      disabled={isSubmitting}
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Edit</p>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() => deleteProject(project.id)}
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                      disabled={isSubmitting}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Delete</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>

                            <p className="text-gray-600 text-xs line-clamp-2">
                              {project.description || 'No description provided'}
                            </p>
                          </div>

                          {/* Project Details */}
                          <div className="p-6 space-y-4">
                            {/* Status */}
                            <div className="flex gap-3">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium border ${getStatusColor(project.status)} text-xs`}>
                                {project.status}
                              </span>
                            </div>

                            {/* Due Date */}
                            {project.due_date && (
                              <div className={`flex items-center gap-2 text-xs ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                                <Calendar className="w-4 h-4" />
                                <span>Due: {new Date(project.due_date).toLocaleDateString()}</span>
                              </div>
                            )}

                            {/* Last Updated */}
                            {project.updated_at && (
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>Updated: {new Date(project.updated_at).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>

                          {/* Action Footer with Progress */}
                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                              <button className="py-1 px-3 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                View Details
                              </button>
                            </div>
                            <div className="text-xs font-medium text-gray-600">Progress: {project.progress}%</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  project.progress === 100 ? 'bg-green-600' : project.progress >= 90 ? 'bg-yellow-600' : 'bg-[#00BFFF]'
                                }`}
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Projects Summary */}
                  <div className="mt-8 text-center">
                    <p className="text-xs text-gray-600">
                      Showing {projects.length} of {total} projects
                    </p>
                  </div>

                  {/* Pagination */}
                  {total > filters.limit && (
                    <div className="mt-8">
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-gray-200 rounded-md p-4 shadow-sm">
                        <Button
                          disabled={filters.page === 1 || isSubmitting}
                          onClick={() => handleFilterChange('page', filters.page - 1)}
                          className="px-4 py-2 bg-[#00BFFF] text-white rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-colors text-xs disabled:bg-[#00BFFF]/50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" size={16} /> Previous
                        </Button>
                        <p className="text-xs text-gray-600">
                          Page {filters.page} of {Math.ceil(total / filters.limit)}
                        </p>
                        <Button
                          disabled={filters.page >= Math.ceil(total / filters.limit) || isSubmitting}
                          onClick={() => handleFilterChange('page', filters.page + 1)}
                          className="px-4 py-2 bg-[#00BFFF] text-white rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-colors text-xs disabled:bg-[#00BFFF]/50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                          Next <ChevronRight className="w-4 h-4 ml-1" size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-xs text-gray-600">View coming soon</p>
            </div>
          )}

          {/* Project Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="bg-white border border-gray-200 rounded-md shadow-lg p-6 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xs font-semibold text-gray-800">
                  {editingProject ? 'Edit Project' : 'Create Project'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-medium text-gray-600 flex items-center">
                    Project Name <span className="text-red-600 ml-1">*</span>
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter project name"
                    {...register('name')}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#00BFFF] bg-white"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600" id="name-error">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="dueDate" className="text-xs font-medium text-gray-600 flex items-center">
                    Due Date <span className="text-red-600 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      id="dueDate"
                      selected={dueDate ? new Date(dueDate) : null}
                      onChange={(date) => setValue('dueDate', date ? date.toISOString().split('T')[0] : '')}
                      placeholderText="Select due date (YYYY-MM-DD)"
                      dateFormat="yyyy-MM-dd"
                      className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#00BFFF] bg-white"
                      aria-invalid={errors.dueDate ? 'true' : 'false'}
                      aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={16} />
                  </div>
                  {errors.dueDate && (
                    <p className="text-xs text-red-600" id="dueDate-error">{errors.dueDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-xs font-medium text-gray-600">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Enter project description (optional)"
                    {...register('description')}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#00BFFF] bg-white"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="status" className="text-xs font-medium text-gray-600">
                    Status
                  </label>
                  <Select
                    onValueChange={(value) => setValue('status', value)}
                    defaultValue={editingProject ? editingProject.status : 'active'}
                  >
                    <SelectTrigger
                      id="status"
                      className="w-full px-4 py-2 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#00BFFF] bg-white"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active" className="text-xs">Active</SelectItem>
                      <SelectItem value="completed" className="text-xs">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter className="flex justify-end gap-3">
                  <Button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-colors text-xs font-medium w-full sm:w-auto disabled:bg-gray-200/50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-4 py-2 bg-[#00BFFF] text-white rounded-md hover:bg-[#00BFFF]/80 focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition-colors text-xs font-medium w-full sm:w-auto disabled:bg-[#00BFFF]/50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {editingProject ? 'Update Project' : 'Create Project'}
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

export const dynamic = 'force-dynamic';