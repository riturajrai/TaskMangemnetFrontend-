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

  // Routes where layout (navbar/sidebar) should be hidden
  const hideLayoutRoutes = ['/login', '/register', '/reset-password'];
  const shouldHideLayout = hideLayoutRoutes.includes(pathname);

  // Routes where footer should be hidden
  const hideFooterRoutes = ['/profile/name', '/profile/email', '/profile/other', '/projects'];
  const shouldHideFooter = hideFooterRoutes.includes(pathname);

  // Sidebar width for desktop
  const sidebarWidth = isSidebarOpen ? 'w-52' : 'w-16';
  const mainMargin = isSidebarOpen ? 'lg:ml-52' : 'lg:ml-16';

  // Show sidebar only if authenticated
  const showSidebar = !shouldHideLayout && isAuthenticated;

  if (isLoading) return null; // or a loader

  return (
    <html lang="en">
      <body className={`${inter.className} text-xs antialiased bg-gray-50`}>
        {/* Navbar */}
        {!shouldHideLayout && <Navbar />}

        {/* Mobile/Tablet Sidebar Toggle Button */}
        {showSidebar && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 bg-sky-500 text-white p-2 rounded-md shadow-lg hover:bg-sky-600 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}

        <div className="flex min-h-screen relative">
          {/* Sidebar */}
          {showSidebar && (
            <Sidebar
              isOpen={isSidebarOpen}
              setIsOpen={setIsSidebarOpen}
            />
          )}

          {/* Main Content */}
          <main
            className={`flex-1 transition-all duration-300 pt-16 px-4 md:px-6 ${
              showSidebar ? mainMargin : 'ml-0'
            }`}
          >
            {children}
          </main>
        </div>

        {/* Footer */}
        {!shouldHideLayout && !shouldHideFooter && <Footer />}
      </body>
    </html>
  );
}
