'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const publicRoutes = ['/login', '/register', '/reset-password'];

  const verifyAuth = useCallback(async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${API_URL}/auth/protected`, {
        withCredentials: true,
      });

      // If response is valid
      if (response?.data?.user) {
        setIsAuthenticated(true);
        setUser({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
        });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      // Safe logging: error.response may not exist
      const message =
        error?.response?.data?.error ||
        error?.message ||
        JSON.stringify(error) ||
        'Unknown error';
      console.warn('Authentication check failed:', message);

      setIsAuthenticated(false);
      setUser(null);

      // Only show toast if not on a public route
      if (typeof window !== 'undefined' && !publicRoutes.includes(window.location.pathname)) {
        toast.error('Please log in to continue', {
          style: {
            background: '#ffffff',
            color: '#1e293b',
            padding: '12px',
            borderRadius: '8px',
          },
        });
        // Optional: redirect to login
        // router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });

      setIsAuthenticated(false);
      setUser(null);
      document.cookie = 'token=; Max-Age=0; path=/;';

      toast.success('Logged out successfully!', {
        style: {
          background: '#ffffff',
          color: '#1e293b',
          padding: '12px',
          borderRadius: '8px',
        },
      });

      router.push('/login');
    } catch (error) {
      const message =
        error?.response?.data?.error || error?.message || JSON.stringify(error) || 'Unknown error';
      console.error('Logout failed:', message);
      toast.error(message, {
        style: {
          background: '#ffffff',
          color: '#1e293b',
          padding: '12px',
          borderRadius: '8px',
        },
      });
    }
  };

  return { isAuthenticated, isLoading, user, logout, publicRoutes };
}
