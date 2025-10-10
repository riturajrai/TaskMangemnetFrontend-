'use client';

import { useAuth } from '../../useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ChevronDown, 
  Edit,
  X 
} from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

// Mock project names for mapping projectId to names
const projectMap = {
  1: 'Website Redesign',
  2: 'Mobile App Development',
  3: 'Marketing Campaign',
  4: 'Database Migration'
};

export default function Calendar() {
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
  const [filter, setFilter] = useState({ priority: 'all', project: 'all' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState({
    id: null,
    title: '',
    priority: 'medium',
    dueDate: '',
    projectId: null,
    status: 'pending',
    assignee: ''
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/calendar');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Mock tasks data (aligned with Projects, Assigned, and Kanban pages)
      const mockTasks = [
        { id: '1', title: 'Complete project proposal', projectId: 1, priority: 'high', status: 'pending', dueDate: '2025-09-10', assignee: user.name || 'You' },
        { id: '2', title: 'Review team tasks', projectId: 1, priority: 'medium', status: 'completed', dueDate: '2025-09-05', assignee: user.name || 'You' },
        { id: '3', title: 'Client meeting preparation', projectId: 2, priority: 'high', status: 'in progress', dueDate: '2025-09-12', assignee: 'John Doe' },
        { id: '4', title: 'Update documentation', projectId: 3, priority: 'low', status: 'pending', dueDate: '2025-09-15', assignee: user.name || 'You' },
        { id: '5', title: 'Fix dashboard UI issues', projectId: 4, priority: 'medium', status: 'in progress', dueDate: '2025-09-07', assignee: 'Sarah Miller' },
      ];

      setTasks(mockTasks);
      setStats({
        totalTasks: mockTasks.length,
        completedTasks: mockTasks.filter(task => task.status === 'completed').length,
        pendingTasks: mockTasks.filter(task => task.status === 'pending').length,
        inProgressTasks: mockTasks.filter(task => task.status === 'in progress').length,
        overdueTasks: mockTasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'completed').length
      });
    }
  }, [isAuthenticated, user]);

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!selectedTask.title || !selectedTask.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setTasks(tasks.map(task => task.id === selectedTask.id ? selectedTask : task));
    setStats(prev => ({
      ...prev,
      completedTasks: tasks.find(t => t.id === selectedTask.id).status !== 'completed' && selectedTask.status === 'completed' 
        ? prev.completedTasks + 1 
        : selectedTask.status !== 'completed' && tasks.find(t => t.id === selectedTask.id).status === 'completed' 
        ? prev.completedTasks - 1 
        : prev.completedTasks,
      pendingTasks: tasks.find(t => t.id === selectedTask.id).status !== 'pending' && selectedTask.status === 'pending' 
        ? prev.pendingTasks + 1 
        : selectedTask.status !== 'pending' && tasks.find(t => t.id === selectedTask.id).status === 'pending' 
        ? prev.pendingTasks - 1 
        : prev.pendingTasks,
      inProgressTasks: tasks.find(t => t.id === selectedTask.id).status !== 'in progress' && selectedTask.status === 'in progress' 
        ? prev.inProgressTasks + 1 
        : selectedTask.status !== 'in progress' && tasks.find(t => t.id === selectedTask.id).status === 'in progress' 
        ? prev.inProgressTasks - 1 
        : prev.inProgressTasks,
      overdueTasks: selectedTask.status !== 'completed' && new Date(selectedTask.dueDate) < new Date() 
        ? prev.overdueTasks + 1 
        : tasks.find(t => t.id === selectedTask.id).status !== 'completed' && new Date(tasks.find(t => t.id === selectedTask.id).dueDate) < new Date() && selectedTask.status === 'completed'
        ? prev.overdueTasks - 1
        : prev.overdueTasks
    }));
    toast.success('Task updated successfully!');
    setIsModalOpen(false);
    setSelectedTask({ id: null, title: '', priority: 'medium', dueDate: '', projectId: null, status: 'pending', assignee: '' });
  };

  const handleTaskAction = (taskId, action) => {
    if (action === 'complete') {
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: 'completed' } : task
      ));
      setStats(prev => ({
        ...prev,
        completedTasks: prev.completedTasks + 1,
        [tasks.find(t => t.id === taskId).status === 'pending' ? 'pendingTasks' : 'inProgressTasks']: 
          prev[tasks.find(t => t.id === taskId).status === 'pending' ? 'pendingTasks' : 'inProgressTasks'] - 1,
        overdueTasks: new Date(tasks.find(t => t.id === taskId).dueDate) < new Date() 
          ? prev.overdueTasks - 1 
          : prev.overdueTasks
      }));
      toast.success('Task marked as completed!');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filter.priority === 'all' || task.priority === filter.priority;
    const matchesProject = filter.project === 'all' || task.projectId === parseInt(filter.project);
    return matchesSearch && matchesPriority && matchesProject;
  });

  const calendarEvents = filteredTasks.map(task => ({
    id: task.id,
    title: task.title,
    date: task.dueDate,
    extendedProps: task
  }));

  const handleEventClick = (info) => {
    handleEditTask(info.event.extendedProps);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Toaster position="bottom-right" />
      
     
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            { icon: FileText, label: 'Total Tasks', value: stats.totalTasks, color: 'indigo' },
            { icon: CheckCircle, label: 'Completed', value: stats.completedTasks, color: 'green' },
            { icon: Clock, label: 'Pending', value: stats.pendingTasks, color: 'yellow' },
            { icon: AlertCircle, label: 'Overdue', value: stats.overdueTasks, color: 'red' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4 sm:p-6 transition-transform hover:scale-105">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</h2>
                  <p className="text-slate-600 text-sm">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-lg font-medium text-slate-900">Task Calendar</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
                    aria-label="Search tasks"
                  />
                </div>
                <div className="relative group">
                  <button className="flex items-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg hidden group-focus-within:block z-10">
                    <div className="p-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                      <select
                        value={filter.priority}
                        onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                        className="w-full px-2 py-1 border border-slate-300 rounded-md"
                      >
                        <option value="all">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <label className="block text-sm font-medium text-slate-700 mt-2 mb-1">Project</label>
                      <select
                        value={filter.project}
                        onChange={(e) => setFilter({ ...filter, project: e.target.value })}
                        className="w-full px-2 py-1 border border-slate-300 rounded-md"
                      >
                        <option value="all">All Projects</option>
                        {Object.entries(projectMap).map(([id, name]) => (
                          <option key={id} value={id}>{name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="calendar-container">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                eventClick={handleEventClick}
                height="auto"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek'
                }}
                eventContent={({ event }) => (
                  <div className={`p-1 rounded ${
                    event.extendedProps.priority === 'high' ? 'bg-red-100 text-red-800' :
                    event.extendedProps.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    <b>{event.title}</b>
                    <p className="text-xs">{event.extendedProps.assignee}</p>
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        {/* Task Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-200">
                <h2 className="text-lg font-medium text-slate-900">Edit Task</h2>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="task-title">Task Title</label>
                    <input
                      id="task-title"
                      type="text"
                      value={selectedTask.title}
                      onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter task title"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      value={selectedTask.priority}
                      onChange={(e) => setSelectedTask({ ...selectedTask, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      aria-required="true"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="due-date">Due Date</label>
                    <input
                      id="due-date"
                      type="date"
                      value={selectedTask.dueDate}
                      onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="project">Project</label>
                    <select
                      id="project"
                      value={selectedTask.projectId || ''}
                      onChange={(e) => setSelectedTask({ ...selectedTask, projectId: parseInt(e.target.value) || null })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Project</option>
                      {Object.entries(projectMap).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="assignee">Assignee</label>
                    <input
                      id="assignee"
                      type="text"
                      value={selectedTask.assignee}
                      onChange={(e) => setSelectedTask({ ...selectedTask, assignee: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter assignee name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="status">Status</label>
                    <select
                      id="status"
                      value={selectedTask.status}
                      onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTaskSubmit}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    aria-label="Update task"
                  >
                    Update Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .calendar-container :global(.fc) {
          max-width: 100%;
        }
        .calendar-container :global(.fc-toolbar) {
          background-color: #f8fafc;
          border-radius: 8px 8px 0 0;
          padding: 8px;
        }
        .calendar-container :global(.fc-button) {
          background-color: #4f46e5;
          border: none;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
        }
        .calendar-container :global(.fc-button:hover) {
          background-color: #4338ca;
        }
        .calendar-container :global(.fc-button.fc-button-active) {
          background-color: #3730a3;
        }
        .calendar-container :global(.fc-daygrid-day) {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
        }
        .calendar-container :global(.fc-daygrid-day:hover) {
          background-color: #f1f5f9;
        }
      `}</style>
    </div>
  );
}

export const dynamic = 'force-dynamic';