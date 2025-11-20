'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { registerUser } from "@/services/auth"

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await registerUser(
        {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }
      );
      console.log(response.data);
      if (response.data.success || response.data.message?.includes('OTP sent')) {
        const otpSession = {
          allowed: true,
          type: 'signup',
          email: formData.email,
          expiry: Date.now() + 1 * 60 * 1000,
          timestamp: Date.now(),
        };

        sessionStorage.setItem('otpSession', JSON.stringify(otpSession));
        router.push(`/verify-otp?type=signup&email=${encodeURIComponent(formData.email)}`);
      } else {
        alert('Registration failed. Please try again.');
        router.reload();
      }
    } catch (error) {
      console.error('Error during registration: ', error);
      alert(error.response?.data?.message || 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 md:p-16 flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[250px] md:min-h-screen">
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full"></div>
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/10 rounded-full"></div>

        <div className="relative z-10 max-w-lg flex flex-col items-center justify-center">
          <div className="flex flex-col items-start text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Welcome
              <br />
              to Mentoroid
            </h1>

            <p className="text-base md:text-xl opacity-90 leading-tight mb-8">
              Clarity gives you the blocks & components you need to create a truly
              professional website.
            </p>
          </div>
          {/* Image below text */}
          <Image
            src="/assets/mentoroid.png"
            alt="Mentoroid Illustration"
            width={362}
            height={362}
            className="rounded-2xl object-contain"
            priority
          />
        </div>
      </div>
      {/* Right Section - Form */}
      <div className="w-full md:w-1/2 bg-white p-6 md:p-16 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-6 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
              Join Mentoroid
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full name*</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 md:py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 md:py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password*</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 md:py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password*</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 md:py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                name="rememberMe"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 cursor-pointer">
                Remember me
              </label>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-semibold py-3 md:py-3.5 rounded-lg transition-all duration-200 mt-2`}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center space-x-2">
              <span className="w-16 h-px bg-gray-300"></span>
              <span className="text-sm text-gray-500">or</span>
              <span className="w-16 h-px bg-gray-300"></span>
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="w-full border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-3 md:py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <Image src="/google-logo.svg" alt="Google Logo" width={20} height={20} priority />
              <span>Continue with Google</span>
            </button>

            {/* Login Redirect */}
            <div className="text-center mt-5 text-gray-600 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
