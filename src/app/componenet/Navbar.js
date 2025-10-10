'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, ChevronDown, User, Bell, LogOut, Settings, Search, X, CheckSquare, LayoutDashboard, BarChart3 } from 'lucide-react';
import { useAuth } from '../useAuth';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const mockTasks = [
  { id: 1, title: 'Complete project proposal', project: 'Website Redesign' },
  { id: 2, title: 'Review code changes', project: 'API Development' },
  { id: 3, title: 'Update documentation', project: 'Mobile App' },
];

const mockProjects = [
  { id: 1, name: 'Website Redesign' },
  { id: 2, name: 'API Development' },
  { id: 3, name: 'Mobile App' },
];

const mockNotes = [
  { id: 1, title: 'Meeting notes', content: 'Discussed project timeline' },
  { id: 2, title: 'Design feedback', content: 'UI improvements needed' },
  { id: 3, title: 'Sprint planning', content: 'Plan for next sprint' },
];

const Navbar = () => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isFeaturesOpen) setIsFeaturesOpen(false);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleFeatures = () => {
    setIsFeaturesOpen(!isFeaturesOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    setIsSearchOpen(true);
  };

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      await axios.post(`${API_URL}/auth/logout`);
      localStorage.removeItem('user');
      logout();
      toast.success('Logged out successfully!', {
        icon: <LogOut className="h-4 w-4 text-sky-500" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
      setIsProfileOpen(false);
      setIsFeaturesOpen(false);
      setIsNotificationsOpen(false);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Logout failed. Please try again.';
      toast.error(errorMsg, {
        icon: <Bell className="h-4 w-4 text-red-500" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
    }
  };

  // Public navigation items (visible before login)
  const publicNavItems = [
    { href: '/', label: 'Home' },
    {
      label: 'Features',
      subItems: [
        { href: '/features/task-management', label: 'Task Management', icon: <Settings className="h-4 w-4 mr-2" /> },
        { href: '/features/kanban-boards', label: 'Kanban Boards', icon: <Settings className="h-4 w-4 mr-2" /> },
        { href: '/features/time-tracking', label: 'Time Tracking', icon: <Settings className="h-4 w-4 mr-2" /> },
        { href: '/features/team-collaboration', label: 'Team Collaboration', icon: <User className="h-4 w-4 mr-2" /> },
      ],
    },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
  ];

  // Profile dropdown items
  const profileItems = [
    { href: '/profile/name', label: 'Profile', icon: <User className="h-4 w-4 mr-2" /> },
    { href: '/settings', label: 'Settings', icon: <Settings className="h-4 w-4 mr-2" /> },
    { label: 'Logout', onClick: handleLogout, icon: <LogOut className="h-4 w-4 mr-2" /> },
  ];

  // Notification dropdown items
  const notificationItems = [
    { href: '/notifications', label: 'View All Notifications' },
    { label: 'Mark as Read', onClick: () => console.log('Mark notifications as read') },
  ];

  // Filter search results
  const filteredTasks = mockTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredProjects = mockProjects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredNotes = mockNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <nav className="bg-white border-b border-slate-200 shadow-sm fixed top-0 left-0 w-full z-50">
        <Toaster position="bottom-right" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="hidden lg:block :text-2xl font-bold bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent flex items-center"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                TaskFlow
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-baseline space-x-6">
                {!isAuthenticated &&
                  publicNavItems.map((item) =>
                    item.subItems ? (
                      <div key={item.label} className="relative">
                        <button
                          onClick={toggleFeatures}
                          className="text-slate-700 hover:text-sky-500 px-3 py-2 text-sm font-medium flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded-md"
                          aria-expanded={isFeaturesOpen}
                          aria-haspopup="true"
                          data-testid="features-button"
                        >
                          {item.label}
                          <ChevronDown
                            className={`ml-1 h-4 w-4 ${isFeaturesOpen ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {isFeaturesOpen && (
                          <div className="absolute z-10 mt-2 w-64 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-500 transition-colors duration-150"
                                  role="menuitem"
                                  onClick={() => setIsFeaturesOpen(false)}
                                >
                                  {subItem.icon}
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-slate-700 hover:text-sky-500 px-3 py-2 text-sm font-medium transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                    )
                  )}
              </div>
              {isLoading ? (
                <div className="text-slate-600 text-sm">Loading...</div>
              ) : isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <button
                      onClick={toggleNotifications}
                      className="relative text-slate-700 hover:text-sky-500 p-2 rounded-full hover:bg-sky-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      aria-expanded={isNotificationsOpen}
                      aria-haspopup="true"
                      title="Notifications"
                      data-testid="notifications-button"
                    >
                      <Bell className="h-5 w-5" />
                      {user?.unreadNotifications > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                      )}
                    </button>
                    {isNotificationsOpen && (
                      <div className="absolute z-10 right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                          {notificationItems.map((item) =>
                            item.onClick ? (
                              <button
                                key={item.label}
                                onClick={item.onClick}
                                className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-500 transition-colors duration-150"
                                role="menuitem"
                              >
                                {item.label}
                              </button>
                            ) : (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-500 transition-colors duration-150"
                                role="menuitem"
                                onClick={() => setIsNotificationsOpen(false)}
                              >
                                {item.label}
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      onClick={toggleProfile}
                      className="text-slate-700 hover:text-sky-500 p-2 rounded-full hover:bg-sky-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 flex items-center"
                      aria-expanded={isProfileOpen}
                      aria-haspopup="true"
                      title="Profile"
                      data-testid="profile-button"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-sky-600 flex items-center justify-center text-white text-sm font-medium mr-2">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="text-sm font-medium hidden lg:block">{user?.name || 'User'}</span>
                    </button>
                    {isProfileOpen && (
                      <div className="absolute z-10 right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                          <div className="px-4 py-2 border-b border-slate-100">
                            <p className="text-sm font-medium text-slate-800">{user?.name || 'User'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                          </div>
                          {profileItems.map((item) =>
                            item.onClick ? (
                              <button
                                key={item.label}
                                onClick={item.onClick}
                                className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-500 transition-colors duration-150"
                                role="menuitem"
                              >
                                {item.icon}
                                {item.label}
                              </button>
                            ) : (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-500 transition-colors duration-150"
                                role="menuitem"
                                onClick={() => setIsProfileOpen(false)}
                              >
                                {item.icon}
                                {item.label}
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-lg border border-sky-200 text-sky-500 font-medium hover:bg-sky-50 hover:border-sky-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
            <div className="lg:hidden flex items-center space-x-2">
              {isAuthenticated && !isLoading && (
                <>
                  <button
                    onClick={handleSearchClick}
                    className="text-slate-700 hover:text-sky-500 p-2 rounded-full hover:bg-sky-50 transition-colors duration-200"
                    aria-label="Search"
                    title="Search"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  <button
                    onClick={toggleNotifications}
                    className="relative text-slate-700 hover:text-sky-500 p-2 rounded-full hover:bg-sky-50 transition-colors duration-200"
                    aria-label="Notifications"
                    title="Notifications"
                    data-testid="mobile-notifications-button"
                  >
                    <Bell className="h-5 w-5" />
                    {user?.unreadNotifications > 0 && (
                      <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                </>
              )}
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="text-slate-700 hover:text-sky-500 p-2 rounded-full hover:bg-sky-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 flex items-center"
                  aria-expanded={isProfileOpen}
                  aria-label={isAuthenticated ? "Profile Menu" : "Navigation Menu"}
                  data-testid={isAuthenticated ? "mobile-profile-button" : "mobile-menu-button"}
                  title={isAuthenticated ? "Profile" : "Menu"}
                >
                  {isAuthenticated ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-sky-600 flex items-center justify-center text-white text-sm font-medium">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
                {isProfileOpen &&
                  (isAuthenticated ? (
                    <div className="absolute z-10 right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        {!isLoading && (
                          <div className="px-4 py-2 border-b border-slate-100">
                            <p className="text-sm font-medium text-slate-800">{user?.name || 'User'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                          </div>
                        )}
                        {profileItems.map((item) =>
                          item.onClick ? (
                            <button
                              key={item.label}
                              onClick={() => {
                                item.onClick();
                                setIsProfileOpen(false);
                              }}
                              className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-500 transition-colors duration-150"
                              role="menuitem"
                            >
                              {item.icon}
                              {item.label}
                            </button>
                          ) : (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-500 transition-colors duration-150"
                              role="menuitem"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              {item.icon}
                              {item.label}
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="fixed inset-0 bg-black/10 bg-opacity-50 z-40 "
                        onClick={toggleProfile}
                      />
                      <div className="fixed top-0 bottom-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-slate-200">
                        <div className="flex flex-col h-full">
                          <div className="flex justify-end p-4 border-b border-slate-200">
                            <button
                              onClick={toggleProfile}
                              className="p-1.5 text-slate-500 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                          <nav className="flex-1 overflow-y-auto py-1" role="menu" aria-orientation="vertical">
                            {publicNavItems.map((item) =>
                              item.subItems ? (
                                <div key={item.label}>
                                  <button
                                    onClick={toggleFeatures}
                                    className="w-full text-left text-slate-700 hover:text-sky-500 block px-4 py-2 text-sm font-medium flex items-center justify-between transition-colors duration-150"
                                    aria-expanded={isFeaturesOpen}
                                    aria-haspopup="true"
                                  >
                                    {item.label}
                                    <ChevronDown
                                      className={`h-4 w-4 transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180' : ''}`}
                                    />
                                  </button>
                                  {isFeaturesOpen && (
                                    <div className="pl-4 mt-1 space-y-1">
                                      {item.subItems.map((subItem) => (
                                        <Link
                                          key={subItem.href}
                                          href={subItem.href}
                                          className="flex items-center text-slate-600 hover:text-sky-500 block px-4 py-2 text-sm transition-colors duration-150"
                                          role="menuitem"
                                          onClick={() => {
                                            setIsProfileOpen(false);
                                            setIsFeaturesOpen(false);
                                          }}
                                        >
                                          {subItem.icon}
                                          {subItem.label}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className="text-slate-700 hover:text-sky-500 block px-4 py-2 text-sm font-medium transition-colors duration-150"
                                  role="menuitem"
                                  onClick={() => setIsProfileOpen(false)}
                                >
                                  {item.label}
                                </Link>
                              )
                            )}
                            {!isLoading && (
                              <div className="pt-2 border-t border-slate-200">
                                <Link
                                  href="/login"
                                  className="block px-4 py-2 text-sm text-slate-700 hover:text-sky-500 transition-colors duration-150"
                                  role="menuitem"
                                  onClick={() => setIsProfileOpen(false)}
                                >
                                  Login
                                </Link>
                                <Link
                                  href="/register"
                                  className="block px-4 py-2 text-sm text-slate-700 hover:text-sky-500 transition-colors duration-150"
                                  role="menuitem"
                                  onClick={() => setIsProfileOpen(false)}
                                >
                                  Sign Up
                                </Link>
                              </div>
                            )}
                          </nav>
                        </div>
                      </div>
                    </>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Dialog */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-[9999] flex items-center justify-center p-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-2 right-2 text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-sm font-semibold text-slate-800 mb-4">
              Search Tasks, Projects & Notes
            </h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, projects, or notes..."
              className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
            <div className="mt-4 max-h-64 overflow-y-auto">
              {searchQuery ? (
                <>
                  <h3 className="text-xs font-medium text-slate-700 mb-2">Tasks</h3>
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <Link
                        key={task.id}
                        href={`/tasks/${task.id}`}
                        className="block p-3 border-b border-slate-200 text-sm text-slate-700 hover:bg-sky-50 rounded-md transition-colors flex items-center gap-2"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <CheckSquare className="h-4 w-4 text-sky-500 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-xs text-slate-500">{task.project}</div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 p-3">No tasks found.</p>
                  )}

                  <h3 className="text-xs font-medium text-slate-700 mt-4 mb-2">Projects</h3>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        className="block p-3 border-b border-slate-200 text-sm text-slate-700 hover:bg-sky-50 rounded-md transition-colors flex items-center gap-2"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4 text-sky-500 flex-shrink-0" />
                        <span>{project.name}</span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 p-3">No projects found.</p>
                  )}

                  <h3 className="text-xs font-medium text-slate-700 mt-4 mb-2">Notes</h3>
                  {filteredNotes.length > 0 ? (
                    filteredNotes.map((note) => (
                      <Link
                        key={note.id}
                        href={`/notes/${note.id}`}
                        className="block p-3 border-b border-slate-200 text-sm text-slate-700 hover:bg-sky-50 rounded-md transition-colors flex items-center gap-2"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <BarChart3 className="h-4 w-4 text-sky-500 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{note.title}</div>
                          <div className="text-xs text-slate-500">{note.content}</div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 p-3">No notes found.</p>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-500 p-3 text-center">Enter a search query to get started.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;