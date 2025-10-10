"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Calendar, Zap, BookOpen } from "lucide-react";

export default function UpdatesPage() {
  const updates = [
    {
      title: "TaskFlow 2.5 Released: Advanced Automation",
      date: "Aug 25, 2025",
      excerpt: "Introducing new automation features to streamline repetitive tasks and improve team productivity.",
    },
    {
      title: "New Kanban Board Enhancements",
      date: "Aug 18, 2025",
      excerpt: "Customize your Kanban boards with tags, color-coding, and automated workflows to better manage projects.",
    },
    {
      title: "Integration with Slack and GitHub",
      date: "Aug 10, 2025",
      excerpt: "Seamlessly connect TaskFlow with Slack and GitHub to enhance communication and project tracking.",
    },
    {
      title: "Mobile App Update v1.3",
      date: "Aug 5, 2025",
      excerpt: "Our mobile app now includes push notifications, offline mode, and improved performance across iOS and Android.",
    },
    {
      title: "Enhanced Reporting Dashboard",
      date: "Aug 1, 2025",
      excerpt: "Gain deeper insights into your team’s performance with new reporting metrics and visualizations.",
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
          TaskFlow Updates
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-600 max-w-2xl mx-auto text-sm"
        >
          Keep up with the latest feature releases, product improvements, and announcements from the TaskFlow team. Stay informed and maximize your productivity.
        </motion.p>
      </div>

      {/* Updates List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {updates.map((update, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center text-slate-500 text-[10px] mb-2 space-x-2">
                <Calendar className="w-3 h-3 text-indigo-600" />
                <span>{update.date}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{update.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-4">{update.excerpt}</p>
              <Link
                href="/updates/details"
                className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800"
              >
                Read More <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
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
            Never Miss an Update
          </h2>
          <p className="opacity-90 mb-6 max-w-xl mx-auto text-sm">
            Subscribe to receive notifications about new TaskFlow features and product announcements.
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
