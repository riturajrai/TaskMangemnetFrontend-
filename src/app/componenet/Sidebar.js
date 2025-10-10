'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LayoutDashboard, CheckSquare, User, BarChart3, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../useAuth';

const protectedNavItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/tasks/my-tasks', label: 'MyTasks', icon: CheckSquare },
  { href: '/projects', label: 'Projects', icon: LayoutDashboard },
  { href: '/team', label: 'Team', icon: User },
  { href: '/notes', label: 'Notes', icon: BarChart3 },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const [isLg, setIsLg] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    setIsLg(media.matches);
    const listener = () => setIsLg(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, []);

  if (isLoading || !isAuthenticated) return null;

  const sidebarWidth = isOpen ? 'w-52' : 'w-16';
  const showLabels = isOpen || isLg;

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div
        className={`hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-md z-40 transition-all duration-300 ${sidebarWidth}`}
      >
        <nav className="flex-1 space-y-2 px-2 mt-4">
          {protectedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center text-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-sky-50 hover:text-sky-600'
                }`}
              >
                <Icon className="h-6 w-6 mb-1" />
                {showLabels && (
                  <span className="text-[12px] font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP SEARCH BUTTON */}
        {/* <div className="mt-4 hidden lg:block px-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full px-4 py-2 text-[12px] text-gray-700 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div> */}
      </div>

      {/* MOBILE/TABLET SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-sm font-bold text-gray-800">Menu</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto flex flex-col">
          {protectedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-sky-50 hover:text-sky-600'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SEARCH MODAL ONLY DESKTOP */}
      {isSearchOpen && isLg && (
        <div
          className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xs font-semibold text-gray-800 mb-4">
              Search Tasks, Projects & Notes
            </h2>
            <input
              type="text"
              placeholder="Search tasks, projects, or notes..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
