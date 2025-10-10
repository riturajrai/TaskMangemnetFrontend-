"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ChevronRight } from "lucide-react";

export default function DemoPage() {
  const demos = [
    {
      title: "TaskFlow Overview",
      description: "A complete walkthrough of TaskFlow&apos;s dashboard, task management, and reporting features.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      title: "Team Collaboration",
      description: "See how teams can collaborate in real-time, share updates, and manage projects effectively.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      title: "Automation Features",
      description: "Learn how to automate repetitive tasks and boost productivity with TaskFlow&apos;s automation engine.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
          TaskFlow Demos
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-600 max-w-2xl mx-auto text-sm"
        >
          Watch our product demos to understand how TaskFlow can help your team manage projects, collaborate effectively, and automate tasks.
        </motion.p>
      </div>

      {/* Demo Videos Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {demos.map((demo, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="relative pb-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-t-lg"
                src={demo.videoUrl}
                title={demo.title}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{demo.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-4">{demo.description}</p>
              <Link
                href="/signup"
                className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800"
              >
                Get Started <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
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
          <h2 className="text-2xl font-bold mb-4">Experience TaskFlow Yourself</h2>
          <p className="opacity-90 mb-6 max-w-xl mx-auto text-sm">
            Start your free trial or request a demo to see how TaskFlow can transform your team&apos;s productivity.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-lg bg-white text-indigo-700 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              Start Free Trial <ChevronRight className="ml-1 h-4 w-4 text-indigo-700" />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-lg border border-indigo-300 text-white font-semibold hover:bg-indigo-600 transform hover:scale-105 transition-all duration-200"
            >
              Request a Demo
            </Link>
          </div>
          <p className="mt-4 text-slate-200 text-sm">No credit card required • 14-day free trial • Cancel anytime</p>
        </motion.div>
      </div>
    </div>
  );
}
