'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../useAuth';
import axios from 'axios';

export default function AssignedTask() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'assigned-to-me', 'assigned-by-me'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'in-progress', 'completed'
  const [view, setView] = useState('list'); // 'list', 'kanban', 'calendar'
  const [searchQuery, setSearchQuery] = useState('');
  const [dateType, setDateType] = useState('default'); // e.g., 'due-date', 'created-date'

  // Fetch tasks assigned TO and BY the user
  const fetchTasks = async () => {
    if (!user) return;
    const userId = user.userId || user.id;

    try {
      setLoading(true);

      const [responseTo, responseBy] = await Promise.all([
        axios.get(`http://localhost:5000/api/tasks/user/${userId}`, { withCredentials: true }),
        axios.get(`http://localhost:5000/api/tasks/assigned-by/${userId}`, { withCredentials: true })
      ]);

      const combinedTasks = [
        ...responseTo.data.tasks,
        ...responseBy.data.tasks
      ].filter((task, index, self) =>
        index === self.findIndex((t) => t._id === task._id)
      );

      setTasks(combinedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/assigned');
    } else if (isAuthenticated && user) {
      fetchTasks();
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter(task => {
    const taskData = task.taskId || task;
    const matchesAssignment = filter === 'all' ||
      (filter === 'assigned-to-me' && task.assigneeId === (user?.userId || user?.id)) ||
      (filter === 'assigned-by-me' && task.assignedBy === (user?.userId || user?.id));

    const matchesStatus = statusFilter === 'all' ||
      (taskData.status?.toLowerCase() === statusFilter.toLowerCase());

    const matchesSearch = searchQuery === '' ||
      (taskData.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       taskData.description?.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesAssignment && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-xs text-green-800 border-green-200';
      case 'in progress': return 'bg-blue-100 text-xs text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-xs text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-xs text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-xs text-orange-800 border-orange-200';
      case 'low': return 'bg-gray-100 text-xs text-gray-800 border-gray-200';
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 pt-20 sm:pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with View Selector */}
        <div className="mb-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${view === 'list'
                ? 'bg-[#00BFFF] text-white'
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Task
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

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-0">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
              />
            </div>

            {/* Filter Dropdown */}
            <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent">
              <option>Filter</option>
              {/* Add filter options */}
            </select>

            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
            >
              <option value="all">Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Default/Layout */}
            <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent">
              <option>Default</option>
              {/* Add options */}
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

            {/* Add Task Button */}
            <button className="px-4 py-2 bg-[#00BFFF] text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors whitespace-nowrap">
              + Add Task
            </button>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xs font-bold text-gray-900">My Tasks</h1>
              <p className="text-xs text-gray-600 mt-2">
                Manage tasks assigned to you and by you
              </p>
            </div>
            <button
              onClick={fetchTasks}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Task Type Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Task Type
              </label>
              <div className="flex gap-2 flex-wrap">
                {['all', 'assigned-to-me', 'assigned-by-me'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${filter === filterType
                      ? 'bg-[#00BFFF] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {filterType === 'all' && 'All Tasks'}
                    {filterType === 'assigned-to-me' && 'Assigned to Me'}
                    {filterType === 'assigned-by-me' && 'Assigned by Me'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 border-3 border-[#00BFFF] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-gray-600">Loading tasks...</p>
            </div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">You haven't added any tasks.</h3>
            <p className="text-xs text-gray-600 mb-6">Welcome. Let's get started.</p>
            <button className="px-6 py-2 bg-[#00BFFF] text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors">
              Add Task
            </button>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ${view === 'list' ? 'block' : 'hidden'}`}>
            {filteredTasks.map((task) => {
              const taskData = task.taskId || task;
              const isAssignedToMe = task.assigneeId === (user?.userId || user?.id);

              return (
                <div
                  key={task._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group"
                >
                  {/* Task Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#00BFFF] to-blue-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-xs truncate">
                            {taskData.title || 'Untitled Task'}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {isAssignedToMe ? 'Assigned to me' : 'Assigned by me'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs line-clamp-2">
                      {taskData.description || 'No description provided'}
                    </p>
                  </div>

                  {/* Task Details */}
                  <div className="p-6 space-y-4">
                    {/* Status and Priority */}
                    <div className="flex gap-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(taskData.status).replace('text-xs', '')}`}>
                        {taskData.status || 'Not Set'}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(taskData.priority).replace('text-xs', '')}`}>
                        <span className="mr-1">{getPriorityIcon(taskData.priority)}</span>
                        {taskData.priority || 'No Priority'}
                      </span>
                    </div>

                    {/* Due Date */}
                    {taskData.dueDate && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Due: {new Date(taskData.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}

                    {/* Project Name */}
                    {task.projectName && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span>Project: {task.projectName}</span>
                      </div>
                    )}
                    {/* Assignment Info */}
                    <div className="pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Assigned by:</span>
                        <span className="font-medium text-gray-900">{task.assignedByName || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Assigned to:</span>
                        <span className="font-medium text-gray-900">{task.assigneeName || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <button className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tasks Summary */}
        {!loading && tasks.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-600">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </p>
          </div>
        )}
      </div>
    </div>
  );
}