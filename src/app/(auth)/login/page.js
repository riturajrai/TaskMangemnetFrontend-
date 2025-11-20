"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.js";
import toast, { Toaster } from "react-hot-toast"; // Import toast + Toaster
import { X, Lock, Mail, CheckCircle, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Forgot Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [step, setStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/profile");
    }
  }, [user, authLoading, router]);

  // Login Handler with Success Toast
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await login(email, password);

      // Success Toast
      toast.success("Welcome back! Login successful", {
        duration: 4000,
        position: "top-center",
        icon: "Welcome",
        style: {
          background: "#10b981",
          color: "white",
          fontWeight: "bold",
        },
      });

      // Redirect after a short delay so user sees the toast
      setTimeout(() => {
        router.push("/profile");
      }, 800);

    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Invalid credentials";
      setErrorMsg(msg);
      toast.error(msg); // Error toast
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Functions (same with toast feedback)
  const sendOtp = async () => {
    setForgotError("");
    setForgotLoading(true);
    try {
      await axios.post(`${API_URL}/user/forget-password`, { email: forgotEmail });
      toast.success("OTP sent to your email!");
      setForgotSuccess("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send OTP";
      setForgotError(msg);
      toast.error(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  const verifyOtp = async () => {
    setForgotError("");
    setForgotLoading(true);
    try {
      await axios.post(`${API_URL}/user/verify-forget-otp`, { email: forgotEmail, otp });
      toast.success("OTP verified successfully!");
      setForgotSuccess("OTP verified successfully!");
      setStep(3);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid or expired OTP";
      setForgotError(msg);
      toast.error(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) return setForgotError("Passwords do not match");
    if (newPassword.length < 6) return setForgotError("Password must be at least 6 characters");

    setForgotError("");
    setForgotLoading(true);
    try {
      await axios.post(`${API_URL}/user/reset-password`, { email: forgotEmail, newPassword });
      toast.success("Password changed successfully!");
      setForgotSuccess("Password changed successfully!");

      setTimeout(() => {
        setShowForgotModal(false);
        setStep(1);
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setForgotSuccess("");
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to reset password";
      setForgotError(msg);
      toast.error(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <>
      {/* Toaster Component - Add this at root level */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Your existing beautiful UI */}
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* LEFT: Branding */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 text-white p-10 lg:p-16 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10 text-center lg:text-left max-w-lg">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Welcome Back<br />
              to <span className="text-yellow-300">MentoroidAI</span>
            </h1>
            <p className="text-lg lg:text-xl opacity-90 mb-10">
              Your personal AI mentor is waiting to help you grow.
            </p>
            <Image
              src="/assets/mentoroid.png"
              alt="MentoroidAI"
              width={420}
              height={420}
              className="rounded-2xl shadow-2xl mx-auto lg:mx-0"
              priority
            />
          </div>
        </div>

        {/* RIGHT: Login Form */}
        <div className="w-full lg:w-1/2 bg-white p-8 lg:p-16 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center lg:text-left">
              Login Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {errorMsg && (
                <p className="text-red-600 bg-red-50 px-4 py-3 rounded-lg text-center font-medium">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || authLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 font-bold hover:underline">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold">
                {step === 1 && "Reset Password"}
                {step === 2 && "Enter OTP"}
                {step === 3 && "Set New Password"}
              </h3>
            </div>

            {forgotError && (
              <p className="text-red-600 bg-red-50 px-4 py-3 rounded-lg text-center mb-4">
                {forgotError}
              </p>
            )}
            {forgotSuccess && (
              <p className="text-green-600 flex items-center justify-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5" /> {forgotSuccess}
              </p>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-5 py-4 border rounded-xl text-center text-lg"
                />
                <button
                  onClick={sendOtp}
                  disabled={forgotLoading || !forgotEmail.includes("@")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {forgotLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                  {forgotLoading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-5 py-4 border rounded-xl text-center text-3xl tracking-widest font-mono"
                />
                <button
                  onClick={verifyOtp}
                  disabled={forgotLoading || otp.length !== 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl disabled:opacity-70"
                >
                  {forgotLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full px-5 py-4 border rounded-xl"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full px-5 py-4 border rounded-xl"
                />
                <button
                  onClick={resetPassword}
                  disabled={forgotLoading || newPassword !== confirmPassword || newPassword.length < 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl disabled:opacity-70"
                >
                  {forgotLoading ? "Updating..." : "Change Password"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}