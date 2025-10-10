"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Video, ChevronRight } from "lucide-react";

export default function WebinarsPage() {
  const webinars = [
    {
      title: "Boost Productivity with TaskFlow Automation",
      date: "Sep 5, 2025",
      time: "3:00 PM - 4:00 PM UTC",
      description: "Learn how to automate repetitive tasks using TaskFlow’s powerful automation features.",
    },
    {
      title: "Advanced Project Management Techniques",
      date: "Sep 12, 2025",
      time: "2:00 PM - 3:30 PM UTC",
      description: "Explore advanced strategies for project tracking, prioritization, and team collaboration.",
    },
    {
      title: "Integrating TaskFlow with Slack and GitHub",
      date: "Sep 19, 2025",
      time: "4:00 PM - 5:00 PM UTC",
      description: "Discover seamless integrations with Slack and GitHub to enhance your workflow.",
    },
    {
      title: "Mastering Team Collaboration",
      date: "Sep 26, 2025",
      time: "3:30 PM - 4:30 PM UTC",
      description: "Learn best practices for real-time collaboration, updates, and shared boards.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 text-slate-900 font-[Inter] text-[12px]">
      
      {/* Floating Gradient Orbs */}
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-8 right-8 w-80 h-80 rounded-full bg-gradient-to-r from-purple-300 to-indigo-300 opacity-20 blur-3xl animate-pulse z-0" />
      <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 opacity-15 blur-3xl animate-pulse z-0" />

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4"
        >
          TaskFlow Webinars
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-600 max-w-2xl mx-auto text-sm"
        >
          Join our live and on-demand webinars to learn tips, strategies, and deep dives into TaskFlow features. Improve team productivity and workflow efficiency.
        </motion.p>
      </div>

      {/* Webinars List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {webinars.map((webinar, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center text-slate-500 text-[10px] mb-2 space-x-2">
              <Calendar className="w-3 h-3 text-indigo-600" />
              <span>{webinar.date} • {webinar.time}</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{webinar.title}</h3>
            <p className="text-slate-600 leading-relaxed mb-4">{webinar.description}</p>
            <Link
              href="/webinars/details"
              className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800"
            >
              Register Now <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-700 to-purple-700 text-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-bold mb-4">
            Stay Ahead with TaskFlow Webinars
          </h2>
          <p className="opacity-90 mb-6 max-w-xl mx-auto text-sm">
            Subscribe to receive notifications about upcoming webinars and on-demand recordings.
          </p>
          <form className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-2 rounded-lg flex-1 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition-all duration-200"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-slate-200 text-sm">
            No spam • Unsubscribe anytime
          </p>
        </motion.div>
      </div>
    </div>
  );
}
