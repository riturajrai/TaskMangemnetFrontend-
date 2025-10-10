'use client';

import { Inter } from 'next/font/google';
import Navbar from './componenet/Navbar';
import Footer from './componenet/Footer';
import Sidebar from './componenet/Sidebar';
import './globals.css';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from './useAuth';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const hideLayoutRoutes = ['/login', '/register', '/reset-password'];
  const hideFooterRoutes = ['/profile/name', '/profile/email', '/profile/other', '/projects'];

  const shouldHideLayout = hideLayoutRoutes.includes(pathname);
  const shouldHideFooter = hideFooterRoutes.includes(pathname);

  const showSidebar = !shouldHideLayout && isAuthenticated;

  if (isLoading) return null;

  // Compute margin for main content based on sidebar state
  const mainMarginClass = showSidebar
    ? isSidebarOpen
      ? 'lg:ml-52'
      : 'lg:ml-16'
    : 'ml-0';

  return (
    <html lang="en">
      <body className={`${inter.className} text-xs antialiased bg-gray-50 overflow-x-hidden`}>
        {!shouldHideLayout && <Navbar />}

        {/* Mobile Sidebar Toggle */}
        {showSidebar && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 bg-sky-500 text-white p-2 rounded-md shadow-lg hover:bg-sky-600 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}

        {/* Sidebar Overlay for Mobile */}
        {showSidebar && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Wrapper */}
        <div className={`relative min-h-screen ${showSidebar ? 'flex' : ''} overflow-x-hidden`}>
          {/* Sidebar */}
          {showSidebar && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}

          {/* Main Content */}
          <main className={`flex-1 transition-all duration-300 pt-16 px-4 md:px-6 overflow-x-hidden ${mainMarginClass}`}>
            {children}
          </main>
        </div>

        {!shouldHideLayout && !shouldHideFooter && <Footer />}
      </body>
    </html>
  );
}
