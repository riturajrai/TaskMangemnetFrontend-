
"use client";

import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function TopBar({ active }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userName = user?.name || user?.email?.split("@")[0] || "User";

  // Proper logout
  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false); // Close dropdown after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sectionLabels = {
    dashboard: "Dashboard",
    onboarding: "Onboarding",
    brain: "Brain Battle",
    quiz: "Quiz",
    explore: "Explore Subjects",
    podcast: "Podcasts",
    podcastDetail: "Podcast Details",
    subjectChat: "Subject Chat",
    summarize: "Summarizer",
    summarizeView: "Summary View",
    codingtech: "Coding & Technology",
    writingcomm: "Writing Communication",
    writingResult: "Writing Result",
    ask: "Ask Anything",
  };

  const currentSection = sectionLabels[active] || "Dashboard";

  return (
    <div className="w-full bg-white shadow-md rounded-2xl px-4 sm:px-6 lg:px-10 py-3 sm:py-4 ">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left / Center on Mobile - Section Title */}
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[#0B3D91] truncate max-w-[50%] sm:max-w-none">
          {currentSection}
        </h2>

        {/* Right - Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#0B3D91] focus:ring-opacity-30 rounded-full p-1 transition-all"
            aria-label="User menu"
          >
            {/* Profile Avatar */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0B3D91] flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md">
              {userName.charAt(0).toUpperCase()}
            </div>

            {/* Username - Hidden on very small screens */}
            <span className="hidden xs:block text-xs sm:text-sm font-medium text-gray-800">
              Hello,{" "}
              <span className="font-semibold text-[#0B3D91]">{userName}</span>
            </span>

            {/* Dropdown Arrow */}
            <svg
              className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div
              className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200"
              role="menu"
            >
              {/* My Profile */}
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                role="menuitem"
              >
                <svg
                  className="w-5 h-5 text-[#0B3D91]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>My Profile</span>
              </Link>

              <div className="border-t border-gray-200 my-1"></div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                role="menuitem"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0v-1m6-8V5a3 3 0 016 0v1"
                  />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}