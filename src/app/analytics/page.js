'use client';

import { useAuth } from '../useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { 
  Plus, 
  Filter, 
  Search, 
  Calendar, 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText,
  MoreVertical,
  X,
  ChevronDown,
  Edit,
  Trash2
} from 'lucide-react';
import Script from 'next/script';

export default function Analytics() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({ 
    priority: 'all', 
    project: 'all',
    timeRange: 'all'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedTask, setSelectedTask] = useState({
    id: null,
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    projectId: null,
    status: 'pending',
    assignee: ''
  });

  // Mock project names for mapping projectId to names
  const projectMap = {
    1: 'Website Redesign',
    3: 'Marketing Campaign',
    5: 'Product Launch',
    7: 'Client Portal'
  };

  // Priority and status options for consistent styling
  const priorityOptions = {
    low: { label: 'Low', color: 'bg-blue-100 text-blue-800', icon: '⬇️' },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800', icon: '⏸️' },
    high: { label: 'High', color: 'bg-red-100 text-red-800', icon: '⬆️' }
  };

  const statusOptions = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    'in progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800' }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/analytics');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const mockTasks = [
        { 
          id: '1', 
          title: 'Complete project proposal', 
          description: 'Draft and finalize the project proposal document for client review',
          projectId: 1, 
          priority: 'high', 
          status: 'pending', 
          dueDate: '2025-09-10', 
          assignee: user.name || 'You',
          createdAt: '2025-09-01'
        },
        { 
          id: '2', 
          title: 'Review team tasks', 
          description: 'Go through the tasks assigned to team members and provide feedback',
          projectId: 1, 
          priority: 'medium', 
          status: 'completed', 
          dueDate: '2025-09-05', 
          assignee: user.name || 'You',
          createdAt: '2025-08-28'
        },
        { 
          id: '3', 
          title: 'Client meeting preparation', 
          description: 'Prepare slides and materials for the upcoming client meeting',
          projectId: 3, 
          priority: 'high', 
          status: 'in progress', 
          dueDate: '2025-09-12', 
          assignee: 'John D.',
          createdAt: '2025-09-02'
        },
        { 
          id: '4', 
          title: 'Update documentation', 
          description: 'Update the user documentation with the latest features and changes',
          projectId: 3, 
          priority: 'low', 
          status: 'pending', 
          dueDate: '2025-09-15', 
          assignee: user.name || 'You',
          createdAt: '2025-09-03'
        },
        { 
          id: '5', 
          title: 'Fix dashboard UI issues', 
          description: 'Resolve UI bugs reported in the dashboard interface',
          projectId: 5, 
          priority: 'medium', 
          status: 'in progress', 
          dueDate: '2025-09-07', 
          assignee: 'Sarah M.',
          createdAt: '2025-09-04'
        },
      ];

      setTasks(mockTasks);
      updateStats(mockTasks);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Chart) {
      // Bar Chart for Task Distribution
      const barCtx = document.getElementById('taskDistributionChart')?.getContext('2d');
      if (barCtx) {
        new window.Chart(barCtx, {
          type: 'bar',
          data: {
            labels: ['Pending', 'In Progress', 'Completed'],
            datasets: [{
              label: 'Tasks',
              data: [stats.pendingTasks, stats.inProgressTasks, stats.completedTasks],
              backgroundColor: ['#facc15', '#3b82f6', '#22c55e'],
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: false } }
          }
        });
      }

      // Line Chart for Task Completion Trend
      const lineCtx = document.getElementById('taskTrendChart')?.getContext('2d');
      if (lineCtx) {
        new window.Chart(lineCtx, {
          type: 'line',
          data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
              label: 'Tasks Completed',
              data: [2, 5, 3, 1], // Mock data for weekly completions
              borderColor: '#22c55e',
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true },
              x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
          }
        });
      }
    }
  }, [stats]);

  const updateStats = (tasksList) => {
    const today = new Date();
    const overdueTasks = tasksList.filter(task => 
      new Date(task.dueDate) < today && task.status !== 'completed'
    ).length;

    setStats({
      totalTasks: tasksList.length,
      completedTasks: tasksList.filter(task => task.status === 'completed').length,
      pendingTasks: tasksList.filter(task => task.status === 'pending').length,
      inProgressTasks: tasksList.filter(task => task.status === 'in progress').length,
      overdueTasks: overdueTasks
    });
  };

  const handleAddTask = () => {
    setModalMode('add');
    setSelectedTask({ 
      id: null, 
      title: '', 
      description: '',
      priority: 'medium', 
      dueDate: '', 
      projectId: null, 
      status: 'pending',
      assignee: user.name || 'You'
    });
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setModalMode('edit');
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!selectedTask.title || !selectedTask.dueDate || !selectedTask.assignee) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (modalMode === 'add') {
      const newTaskData = {
        id: (Math.max(...tasks.map(t => parseInt(t.id)), 0) + 1).toString(),
        ...selectedTask,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTasks([...tasks, newTaskData]);
      toast.success('Task added successfully!');
    } else {
      setTasks(tasks.map(task => task.id === selectedTask.id ? selectedTask : task));
      toast.success('Task updated successfully!');
    }
    
    updateStats(tasks);
    setIsModalOpen(false);
    setSelectedTask({ 
      id: null, 
      title: '', 
      description: '',
      priority: 'medium', 
      dueDate: '', 
      projectId: null, 
      status: 'pending',
      assignee: ''
    });
  };

  const handleTaskAction = (taskId, action) => {
    if (action === 'complete') {
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, status: 'completed' } : task
      );
      setTasks(updatedTasks);
      updateStats(updatedTasks);
      toast.success('Task marked as completed!');
    } else if (action === 'delete') {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      updateStats(updatedTasks);
      toast.success('Task deleted!');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filter.priority === 'all' || task.priority === filter.priority;
    const matchesProject = filter.project === 'all' || task.projectId === parseInt(filter.project);
    const matchesTimeRange = filter.timeRange === 'all' || 
                            (filter.timeRange === '7days' && new Date(task.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                            (filter.timeRange === '30days' && new Date(task.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    return matchesSearch && matchesPriority && matchesProject && matchesTimeRange;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js" strategy="afterInteractive" />
      <div className="min-h-screen bg-gray-50">
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            }, }}/>

         
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
            {[
              { icon: FileText, label: 'Total Tasks', value: stats.totalTasks, color: 'indigo' },
              { icon: CheckCircle, label: 'Completed', value: stats.completedTasks, color: 'green' },
              { icon: Clock, label: 'Pending', value: stats.pendingTasks, color: 'yellow' },
              { icon: AlertCircle, label: 'In Progress', value: stats.inProgressTasks, color: 'blue' },
              { icon: AlertCircle, label: 'Overdue', value: stats.overdueTasks, color: 'red' }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 transition-transform hover:scale-[1.02] border border-gray-100">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</h2>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Analytics Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Task Analytics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
                <div className="bg-indigo-50 p-6 rounded-lg shadow-sm border border-indigo-100">
                  <h4 className="font-medium text-indigo-900 mb-2">Completion Rate</h4>
                  <div className="text-2xl sm:text-3xl font-bold text-indigo-700">
                    {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                  </div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100">
                  <h4 className="font-medium text-green-900 mb-2">Productivity Score</h4>
                  <div className="text-2xl sm:text-3xl font-bold text-green-700">87%</div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">Task Distribution</h4>
                  <div className="h-64">
                    <canvas id="taskDistributionChart"></canvas>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">Task Completion Trend</h4>
                  <div className="h-64">
                    <canvas id="taskTrendChart"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tasks Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-lg font-medium text-gray-900">Recent Tasks</h2>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search tasks..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
                      aria-label="Search tasks"
                    />
                  </div>
                  <div className="relative group">
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </button>
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 space-y-3 hidden group-hover:block">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                          value={filter.priority}
                          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="all">All Priorities</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                        <select
                          value={filter.project}
                          onChange={(e) => setFilter({ ...filter, project: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="all">All Projects</option>
                          {Object.entries(projectMap).map(([id, name]) => (
                            <option key={id} value={id}>{name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                        <select
                          value={filter.timeRange}
                          onChange={(e) => setFilter({ ...filter, timeRange: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="all">All Time</option>
                          <option value="7days">Last 7 Days</option>
                          <option value="30days">Last 30 Days</option>
                        </select>
                      </div>
                      <button
                        onClick={() => setFilter({ priority: 'all', project: 'all', timeRange: 'all' })}
                        className="w-full mt-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={handleAddTask}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    aria-label="Add new task"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </button>
                </div>
              </div>

              {/* Active Filters Display */}
              {(filter.priority !== 'all' || filter.project !== 'all' || filter.timeRange !== 'all' || searchQuery) && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {filter.priority !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Priority: {filter.priority}
                      <button 
                        onClick={() => setFilter({...filter, priority: 'all'})}
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filter.project !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Project: {projectMap[filter.project]}
                      <button 
                        onClick={() => setFilter({...filter, project: 'all'})}
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filter.timeRange !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Time: {filter.timeRange === '7days' ? 'Last 7 Days' : 'Last 30 Days'}
                      <button 
                        gods="close-time-filter" 
                        onClick={() => setFilter({...filter, timeRange: 'all'})}
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Search: {searchQuery}
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Tasks List */}
              {filteredTasks.length > 0 ? (
                <div className="space-y-8">
                  {['pending', 'in progress', 'completed'].map(status => (
                    <div key={status}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-700 capitalize flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-2 ${
                            status === 'pending' ? 'bg-yellow-500' :
                            status === 'in progress' ? 'bg-blue-500' : 'bg-green-500'
                          }`}></span>
                          {status}
                        </h3>
                        <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                          {filteredTasks.filter(t => t.status === status).length}
                        </span>
                      </div>
                      <div className="space-y-4">
                        {filteredTasks
                          .filter(task => task.status === status)
                          .map((task) => (
                            <div
                              key={task.id}
                              className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all ${
                                new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'border-l-4 border-l-red-500' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-900">{task.title}</h4>
                                <div className="relative">
                                  <button 
                                    onClick={() => handleEditTask(task)}
                                    className="text-gray-400 hover:text-gray-600"
                                    aria-label={`Edit task ${task.title}`}
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              {task.description && (
                                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{task.description}</p>
                              )}
                              <div className="mt-3 flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                Due: {formatDate(task.dueDate)}
                                {new Date(task.dueDate) < new Date() && task.status !== 'completed' && (
                                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                                    Overdue
                                  </span>
                                )}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <span className="mr-1">Project:</span> {projectMap[task.projectId] || 'Unknown Project'}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <span className="mr-1">Assignee:</span> {task.assignee}
                              </div>
                              <div className="mt-4 flex justify-between items-center">
                                <span className={`text-xs font-medium px-2 py-1 rounded ${priorityOptions[task.priority].color}`}>
                                  {priorityOptions[task.priority].icon} {task.priority} priority
                                </span>
                                <div className="flex space-x-2">
                                  {task.status !== 'completed' && (
                                    <button 
                                      onClick={() => handleTaskAction(task.id, 'complete')}
                                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                                      aria-label={`Complete task ${task.title}`}
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Mark complete
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => handleTaskAction(task.id, 'delete')}
                                    className="text-xs text-red-600 hover:text-red-900 font-medium flex items-center"
                                    aria-label={`Delete task ${task.title}`}
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        {filteredTasks.filter(task => task.status === status).length === 0 && (
                          <div className="text-center py-8 text-gray-400">
                            <p>No tasks in {status}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
                  <button
                    onClick={() => setFilter({ priority: 'all', project: 'all', timeRange: 'all' })}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Task Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white">
                  <h2 className="text-lg font-medium text-gray-900">{modalMode === 'add' ? 'Add New Task' : 'Edit Task'}</h2>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleTaskSubmit} className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="task-title">
                        Task Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="task-title"
                        type="text"
                        value={selectedTask.title}
                        onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter task title"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="task-description">
                        Description
                      </label>
                      <textarea
                        id="task-description"
                        value={selectedTask.description}
                        onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter task description"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="priority">
                        Priority <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="priority"
                        value={selectedTask.priority}
                        onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        aria-required="true"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="due-date">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="due-date"
                        type="date"
                        value={selectedTask.dueDate}
                        onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="project">
                        Project
                      </label>
                      <select
                        id="project"
                        value={selectedTask.projectId || ''}
                        onChange={(e) => setSelectedTask({ ...selectedTask, projectId: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Project</option>
                        {Object.entries(projectMap).map(([id, name]) => (
                          <option key={id} value={id}>{name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="assignee">
                        Assignee <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="assignee"
                        type="text"
                        value={selectedTask.assignee}
                        onChange={(e) => setSelectedTask({ ...selectedTask, assignee: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter assignee name"
                        required
                        aria-required="true"
                      />
                    </div>
                    {modalMode === 'edit' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
                          Status
                        </label>
                        <select
                          id="status"
                          value={selectedTask.status}
                          onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="in progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      aria-label="Cancel"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      aria-label={modalMode === 'add' ? 'Add task' : 'Update task'}
                    >
                      {modalMode === 'add' ? 'Add Task' : 'Update Task'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export const dynamic = 'force-dynamic';