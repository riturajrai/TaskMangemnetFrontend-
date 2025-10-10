'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../useAuth';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { User, Moon, Globe, Lock, Shield, Mail, AlertTriangle, CheckCircle, X, Settings as SettingsIcon, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';

export default function Settings() {
  const { isAuthenticated, isLoading, user, updateUser, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: '',
    darkMode: false,
    language: 'en',
    notifications: true,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false,
    feedback: ''
  });
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/settings');
    } else if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        profilePicture: user.profilePicture || '',
        darkMode: user.darkMode || false,
        language: user.language || 'en',
        notifications: user.notifications || true,
        twoFactor: user.twoFactor || false,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        feedback: ''
      });
    }
  }, [isAuthenticated, isLoading, user, router]);

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.name.trim()) newErrors.name = 'Name is required';
    if (!data.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) newErrors.email = 'Invalid email format';
    if (data.newPassword && data.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (data.newPassword !== data.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUser({
        name: formData.name,
        email: formData.email,
        profilePicture: formData.profilePicture,
        darkMode: formData.darkMode,
        language: formData.language,
        notifications: formData.notifications,
        twoFactor: formData.twoFactor
      }, formData.currentPassword, formData.newPassword);
      toast.success('Settings updated successfully!');
      // Clear password fields after successful update
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.error('Failed to update settings: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/deactivate`);
      await logout();
      toast.success('Account deactivated successfully!');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to deactivate account: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
      setIsDeactivateModalOpen(false);
    }
  };

  const handleFeedback = async () => {
    if (!formData.feedback.trim()) {
      setErrors(prev => ({ ...prev, feedback: 'Feedback is required' }));
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/feedback`, { feedback: formData.feedback });
      toast.success('Feedback submitted successfully!');
      setFormData(prev => ({ ...prev, feedback: '' }));
    } catch (error) {
      toast.error('Failed to submit feedback: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="grid grid-cols-1 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'feedback', label: 'Feedback', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          duration: 3000, 
          style: { background: '#363636', color: '#fff' },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: 'white',
            },
          },
        }} 
      />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">Dashboard</Link>
            <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Settings</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Settings</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your account settings and preferences</p>
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden mb-6">
          <label htmlFor="tabs" className="sr-only">Select a tab</label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>{tab.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Tabs */}
          <div className="hidden lg:block w-full lg:w-1/4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
            
            {/* Danger Zone - Always visible on desktop */}
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                Danger Zone
              </h3>
              <button
                onClick={() => setIsDeactivateModalOpen(true)}
                className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Deactivate Account
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="w-full lg:w-3/4">
            {/* Account Settings */}
            {(activeTab === 'account') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6"
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4">
                  <User className="h-5 w-5 mr-2 text-indigo-600" />
                  Account Settings
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                      aria-describedby="name-error"
                    />
                    {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                      aria-describedby="email-error"
                    />
                    {errors.email && <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Picture URL</label>
                    <input
                      id="profilePicture"
                      name="profilePicture"
                      value={formData.profilePicture}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.profilePicture && (
                      <div className="mt-2 flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-2">
                          <img src={formData.profilePicture} alt="Profile preview" className="h-full w-full object-cover" />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Preview</span>
                      </div>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    whileTap={{ scale: 0.98 }}
                    aria-label="Save account settings"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Preferences */}
            {(activeTab === 'preferences') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6"
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4">
                  <SettingsIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  Preferences
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <label htmlFor="darkMode" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Moon className="h-5 w-5 mr-2 text-indigo-600" />
                      Dark Mode
                    </label>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors">
                      <input
                        id="darkMode"
                        name="darkMode"
                        type="checkbox"
                        checked={formData.darkMode}
                        onChange={handleChange}
                        className="absolute opacity-0 w-0 h-0"
                      />
                      <span className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${formData.darkMode ? 'translate-x-6' : ''}`}></span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <label htmlFor="notifications" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Mail className="h-5 w-5 mr-2 text-indigo-600" />
                      Task Notifications
                    </label>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors">
                      <input
                        id="notifications"
                        name="notifications"
                        type="checkbox"
                        checked={formData.notifications}
                        onChange={handleChange}
                        className="absolute opacity-0 w-0 h-0"
                      />
                      <span className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${formData.notifications ? 'translate-x-6' : ''}`}></span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => handleSubmit({ preventDefault: () => {} })}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    whileTap={{ scale: 0.98 }}
                    aria-label="Save preferences"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Preferences'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Security */}
            {(activeTab === 'security') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6"
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4">
                  <Lock className="h-5 w-5 mr-2 text-indigo-600" />
                  Security
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors pr-10"
                        aria-describedby="new-password-error"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                      </button>
                    </div>
                    {errors.newPassword && <p id="new-password-error" className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors pr-10"
                        aria-describedby="confirm-password-error"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p id="confirm-password-error" className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <label htmlFor="twoFactor" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Shield className="h-5 w-5 mr-2 text-indigo-600" />
                      Two-Factor Authentication
                    </label>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors">
                      <input
                        id="twoFactor"
                        name="twoFactor"
                        type="checkbox"
                        checked={formData.twoFactor}
                        onChange={handleChange}
                        className="absolute opacity-0 w-0 h-0"
                      />
                      <span className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${formData.twoFactor ? 'translate-x-6' : ''}`}></span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => handleSubmit({ preventDefault: () => {} })}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    whileTap={{ scale: 0.98 }}
                    aria-label="Update security settings"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Security'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Feedback */}
            {(activeTab === 'feedback') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6"
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4">
                  <AlertTriangle className="h-5 w-5 mr-2 text-indigo-600" />
                  Feedback
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Feedback or Bug Report</label>
                    <textarea
                      id="feedback"
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                      rows="4"
                      placeholder="Share your thoughts or report a bug..."
                      aria-describedby="feedback-error"
                    />
                    {errors.feedback && <p id="feedback-error" className="mt-1 text-sm text-red-600">{errors.feedback}</p>}
                    <motion.button
                      onClick={handleFeedback}
                      disabled={isSubmitting}
                      className="mt-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      whileTap={{ scale: 0.98 }}
                      aria-label="Submit feedback"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Mobile Danger Zone */}
            <div className="lg:hidden bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                Danger Zone
              </h2>
              <button
                onClick={() => setIsDeactivateModalOpen(true)}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </div>

        {/* Deactivate Modal */}
        <AnimatePresence>
          {isDeactivateModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Confirm Deactivation</h2>
                  <button
                    onClick={() => {
                      setIsDeactivateModalOpen(false);
                      setIsSubmitting(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Are you sure you want to deactivate your account? This action cannot be undone. All your data will be permanently deleted.
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0">
                  <motion.button
                    onClick={() => {
                      setIsDeactivateModalOpen(false);
                      setIsSubmitting(false);
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    whileTap={{ scale: 0.98 }}
                    aria-label="Cancel deactivation"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleDeactivate}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    whileTap={{ scale: 0.98 }}
                    aria-label="Confirm deactivation"
                  >
                    {isSubmitting ? 'Deactivating...' : 'Deactivate Account'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}