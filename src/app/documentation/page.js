"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight } from "lucide-react";

export default function DocumentationPage() {
  const docs = [
    {
      title: "Getting Started Guide",
      category: "Beginner",
      description: "Step-by-step instructions to set up your TaskFlow account, projects, and tasks efficiently.",
    },
    {
      title: "Advanced Workflows",
      category: "Advanced",
      description: "Learn to automate tasks, manage dependencies, and optimize team productivity.",
    },
    {
      title: "Team Management",
      category: "Intermediate",
      description: "Master managing teams, assigning roles, and tracking project progress effectively.",
    },
    {
      title: "Integrations",
      category: "Intermediate",
      description: "Connect TaskFlow with Slack, GitHub, and other tools to streamline your workflow.",
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
          TaskFlow Documentation
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-600 max-w-2xl mx-auto text-sm"
        >
          Explore detailed documentation to understand TaskFlow’s features, workflows, and integrations. Perfect for beginners and advanced users alike.
        </motion.p>
      </div>

      {/* Documentation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {docs.map((doc, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">{doc.title}</h3>
            <p className="text-slate-500 text-[10px] uppercase mb-2">{doc.category}</p>
            <p className="text-slate-600 leading-relaxed mb-4">{doc.description}</p>
            <Link
              href="/documentation/details"
              className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800"
            >
              Read More <ChevronRight className="ml-1 w-4 h-4" />
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
            Stay Updated with TaskFlow Docs
          </h2>
          <p className="opacity-90 mb-6 max-w-xl mx-auto text-sm">
            Subscribe to receive updates when new guides and tutorials are published.
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
