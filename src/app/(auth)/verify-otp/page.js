'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

function VerifyOtpInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = decodeURIComponent(searchParams.get("email") || "");
  const type = searchParams.get("type") || "signup"; // signup / login

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  // FIXED: removed TypeScript syntax (e: any)
  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_BASE}/user/auth/verify-otp`, {
        email,
        otp,
        type,
      });

      if (res.data.success || res.data.message?.includes("verified")) {
        setSuccess(true);

        // Save token & user if sent by backend
        if (res.data.token) {
          Cookies.set("authToken", res.data.token, { expires: 7 });
        }
        if (res.data.user) {
          Cookies.set("user", JSON.stringify(res.data.user), { expires: 7 });
        }

        // Redirect
        setTimeout(() => router.push("/dashboard"), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: proper resend OTP logic
  const resendOTP = async () => {
    try {
      await axios.post(`${API_BASE}/user/auth/resend-otp`, { email, type });
      alert("A new OTP has been sent to your email!");
      setOtp("");
    } catch (err) {
      alert("Failed to resend OTP. Try again later.");
    }
  };

  if (!email) {
    router.push("/register");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center p-10">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Almost There!</h1>
          <p className="text-xl">Verify your email to continue</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-center mb-2">Enter OTP</h2>
          <p className="text-center text-gray-600 mb-8">
            Code sent to <strong>{email}</strong>
          </p>

          {/* ERROR */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              Verified! Redirecting...
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full text-center text-3xl font-bold tracking-widest py-5 border-2 border-gray-300 rounded-xl focus:border-blue-600 outline-none"
              autoFocus
            />

            <button
              type="submit"
              disabled={loading || otp.length !== 6 || success}
              className={`w-full py-5 rounded-xl font-bold text-white transition ${
                loading || success || otp.length !== 6
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          {/* RESEND OTP */}
          <div className="text-center mt-8">
            <button
              onClick={resendOTP}
              className="text-blue-600 font-medium hover:underline"
            >
              Didn’t receive the code? Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtp() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div>Loading...</div>
        </div>
      }
    >
      <VerifyOtpInner />
    </Suspense>
  );
}
