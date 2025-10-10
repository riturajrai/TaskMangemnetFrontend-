'use client';

import { useAuth } from '../../useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ChevronDown, 
  Edit 
  ,
  X
} from 'lucide-react';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Mock project names for mapping projectId to names
const projectMap = {
  1: 'Website Redesign',
  2: 'Mobile App Development',
  3: 'Marketing Campaign',
  4: 'Database Migration'
};

export default function Kanban() {
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

  // Initialize dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/kanban');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Mock tasks data (aligned with Projects and Assigned pages)
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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overContainer = over.data.current?.sortable.containerId;

    if (!overContainer) return;

    const task = tasks.find(t => t.id === activeId);
    if (!task) return;

    if (task.status === overContainer) return;

    const updatedTasks = tasks.map(t => 
      t.id === activeId ? { ...t, status: overContainer } : t
    );
    setTasks(updatedTasks);
    setStats(prev => ({
      ...prev,
      [task.status === 'pending' ? 'pendingTasks' : 'inProgressTasks']: prev[task.status === 'pending' ? 'pendingTasks' : 'inProgressTasks'] - 1,
      [overContainer === 'pending' ? 'pendingTasks' : 'inProgressTasks']: prev[overContainer === 'pending' ? 'pendingTasks' : 'inProgressTasks'] + 1,
      completedTasks: overContainer === 'completed' ? prev.completedTasks + 1 : 
                      task.status === 'completed' ? prev.completedTasks - 1 : prev.completedTasks,
      overdueTasks: overContainer !== 'completed' && new Date(task.dueDate) < new Date() 
        ? prev.overdueTasks + 1 
        : task.status !== 'completed' && new Date(task.dueDate) < new Date() 
        ? prev.overdueTasks - 1 
        : prev.overdueTasks
    }));
    toast.success(`Task moved to ${overContainer}`);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filter.priority === 'all' || task.priority === filter.priority;
    const matchesProject = filter.project === 'all' || task.projectId === parseInt(filter.project);
    return matchesSearch && matchesPriority && matchesProject;
  });

  // Sortable item component
  const SortableTask = ({ task, index }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id: task.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow ${isDragging ? 'bg-indigo-50' : ''}`}
      >
        <div className="flex justify-between">
          <h4 className="font-medium text-slate-900">{task.title}</h4>
          <button 
            onClick={() => handleEditTask(task)}
            className="text-slate-400 hover:text-slate-600"
            aria-label={`Edit task ${task.title}`}
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center text-sm text-slate-500">
          <Calendar className="h-4 w-4 mr-1" />
          Due: {task.dueDate}
        </div>
        <div className="mt-2 flex items-center text-sm text-slate-500">
          Project: {projectMap[task.projectId] || 'Unknown'}
        </div>
        <div className="mt-2 flex items-center text-sm text-slate-500">
          Assignee: {task.assignee}
        </div>
        <div className="mt-4 flex justify-between">
          <span className={`text-xs font-medium px-2 py-1 rounded ${
            task.priority === 'high' ? 'bg-red-100 text-red-800' :
            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {task.priority} priority
          </span>
          {task.status !== 'completed' && (
            <button 
              onClick={() => handleTaskAction(task.id, 'complete')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              aria-label={`Complete task ${task.title}`}
            >
              Mark complete
            </button>
          )}
        </div>
      </div>
    );
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

        {/* Kanban Board */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-lg font-medium text-slate-900">All Tasks</h2>
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

            {/* Kanban Board */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {['pending', 'in progress', 'completed'].map(status => (
                  <div key={status} className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-slate-700 capitalize">{status}</h3>
                      <span className="bg-slate-200 text-slate-700 text-xs font-medium px-2 py-1 rounded-full">
                        {filteredTasks.filter(t => t.status === status).length}
                      </span>
                    </div>
                    <SortableContext 
                      id={status} 
                      items={filteredTasks.filter(task => task.status === status).map(task => task.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-4 min-h-[200px]">
                        {filteredTasks
                          .filter(task => task.status === status)
                          .map((task, index) => (
                            <SortableTask key={task.id} task={task} index={index} />
                          ))}
                        {filteredTasks.filter(task => task.status === status).length === 0 && (
                          <div className="text-center py-8 text-slate-400">
                            <p>No tasks in {status}</p>
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </div>
                ))}
              </div>
            </DndContext>
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
    </div>
  );
}

export const dynamic = 'force-dynamic';