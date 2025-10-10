
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

// Constants
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const CONFIG = {
  MIN_PASSWORD_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  OTP_LENGTH: 6,
};

/**
 * ResetPassword component for verifying OTP and resetting password
 * @returns {JSX.Element}
 */
function ResetPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const otpInputRef = useRef(null);

  useEffect(() => {
    const emailFromQuery = searchParams.get('email') || '';
    setEmail(decodeURIComponent(emailFromQuery));
    otpInputRef.current?.focus();
  }, [searchParams]);

  /**
   * Validates email format
   * @param {string} email - Email to validate
   * @returns {boolean}
   */
  const isValidEmail = (email) => CONFIG.EMAIL_REGEX.test(email);

  /**
   * Validates OTP format
   * @param {string} otp - OTP to validate
   * @returns {boolean}
   */
  const isValidOtp = (otp) => otp.length === CONFIG.OTP_LENGTH && /^\d+$/.test(otp);

  /**
   * Validates password strength
   * @param {string} password - Password to validate
   * @returns {boolean}
   */
  const isValidPassword = (password) => CONFIG.PASSWORD_REGEX.test(password);

  /**
   * Verifies OTP via API
   * @param {string} email - User email
   * @param {string} otp - OTP code
   * @returns {Promise<void>}
   */
  const handleVerifyOtp = async (email, otp) => {
    try {
      axios.defaults.withCredentials = true;
      await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Invalid or expired OTP');
    }
  };

  /**
   * Resets password via API
   * @param {string} email - User email
   * @param {string} otp - OTP code
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   */
  const handleResetPassword = async (email, otp, newPassword) => {
    try {
      axios.defaults.withCredentials = true;
      await axios.post(`${API_URL}/auth/reset-password`, { email, otp, newPassword });
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to reset password');
    }
  };

  /**
   * Handles form submission for OTP verification and password reset
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    toast.dismiss();

    if (!isValidEmail(email)) {
      const errorMsg = 'Please enter a valid email address.';
      setError(errorMsg);
      toast.error(errorMsg, {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
      return;
    }

    if (!isValidOtp(otp)) {
      const errorMsg = 'OTP must be a 6-digit number.';
      setError(errorMsg);
      toast.error(errorMsg, {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
      return;
    }

    if (!isValidPassword(newPassword)) {
      const errorMsg = 'Password must be at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.';
      setError(errorMsg);
      toast.error(errorMsg, {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      const errorMsg = 'Passwords do not match.';
      setError(errorMsg);
      toast.error(errorMsg, {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
      return;
    }

    setLoading(true);
    try {
      await handleVerifyOtp(email, otp);
      await handleResetPassword(email, otp, newPassword);
      toast.success('Password reset successfully! Redirecting to login...', {
        icon: <CheckCircle className="h-4 w-4 text-indigo-600" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      toast.error(errorMsg, {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 text-slate-900 font-[Inter] text-[14px] flex items-center justify-center p-4 sm:p-6">
      <Toaster position="bottom-right" />
      <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-slate-100 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-[18px] font-bold text-slate-900">Reset Password</h1>
          <p className="text-[14px] text-slate-600 mt-2">Enter the verification code and your new password</p>
        </div>
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md" role="alert">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2" />
              <span className="text-[14px] text-red-700">{error}</span>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-[14px] font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-500" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                className="w-full pl-9 pr-3 py-2 text-[14px] rounded-md border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
                disabled
              />
            </div>
          </div>
          <div>
            <label htmlFor="otp" className="block text-[14px] font-medium text-slate-700 mb-1">Verification Code</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.trim())}
              className="w-full px-3 py-2 text-[14px] rounded-md border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter 6-digit code"
              ref={otpInputRef}
              disabled={loading}
              required
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-[14px] font-medium text-slate-700 mb-1">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-500" />
              </div>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-[14px] rounded-md border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-[14px] font-medium text-slate-700 mb-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-500" />
              </div>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-[14px] rounded-md border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="flex-1 py-2 px-4 border border-slate-200 rounded-lg text-[14px] font-semibold bg-white hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2 px-4 rounded-lg text-[14px] font-semibold text-white ${
                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              }`}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
export const dynamic = 'force-dynamic';