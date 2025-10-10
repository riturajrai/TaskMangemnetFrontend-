"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, List, ChevronRight, Zap, Clock, Users } from "lucide-react";
import taskManagement from '../../business-task-management-illustration-concept_701961-3283.avif';

export default function TaskManagement() {
  console.log('motion:', motion); // Debug to verify motion import
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 text-slate-900 font-[Inter] text-[12px]">
      {/* Floating Gradient Orbs */}
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-8 right-8 w-80 h-80 rounded-full bg-gradient-to-r from-purple-300 to-indigo-300 opacity-20 blur-3xl animate-pulse z-0" />
      <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 opacity-15 blur-3xl animate-pulse z-0" />

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center px-2 py-1 rounded-full font-medium bg-indigo-100 text-indigo-700 mb-4">
            <List className="h-3 w-3 mr-1 text-indigo-600" />
            Master Your Tasks
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Optimize Your Workflow with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Task Management
            </span>
          </h1>
          <p className="text-slate-600 mb-6 max-w-md leading-relaxed">
            TaskFlow’s task management features empower you to organize, prioritize, and track tasks with AI-driven precision and seamless collaboration.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            <Link
              href="/register"
              className="group relative px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center"
            >
              Start Free Trial
              <ChevronRight className="ml-1 w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/demo"
              className="group px-6 py-3 rounded-lg border border-slate-200 font-semibold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transform hover:scale-105 transition-all duration-200 flex items-center"
            >
              Watch Demo
              <ChevronRight className="ml-1 w-4 h-4 text-indigo-600 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -top-4 -right-4 w-full h-full rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 -z-10"></div>
          <Image
            src={taskManagement}
            alt="Task Management Dashboard"
            className="rounded-xl shadow-xl max-w-full h-auto border border-slate-200"
            width={600}
            height={400}
            priority
          />
          <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-lg shadow-md border border-slate-100">
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 text-indigo-600 mr-1" />
              <span className="font-medium text-slate-700">Tasks Completed</span>
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">92%</div>
          </div>
        </motion.div>
      </div>

      {/* Task Management Features Section */}
      <div id="task-management" className="relative z-10 bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Advanced Task Management Features
            </h2>
            <p className="text-slate-600">
              Discover how TaskFlow’s task management tools streamline your workflow with intelligent prioritization, automation, and collaboration.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <List className="h-6 w-6 text-indigo-600" />,
                title: "Smart Task Prioritization",
                desc: "Leverage AI to automatically categorize and prioritize tasks based on deadlines, importance, and project goals.",
              },
              {
                icon: <Zap className="h-6 w-6 text-indigo-600" />,
                title: "Task Automation",
                desc: "Automate repetitive tasks with custom rules and integrations to save time and reduce manual work.",
              },
              {
                icon: <Users className="h-6 w-6 text-indigo-600" />,
                title: "Collaborative Task Boards",
                desc: "Share task boards with your team for real-time updates and seamless collaboration across projects.",
              },
              {
                icon: <Clock className="h-6 w-6 text-indigo-600" />,
                title: "Task Scheduling",
                desc: "Use predictive scheduling to assign tasks efficiently and keep your projects on track.",
              },
              {
                icon: <CheckCircle className="h-6 w-6 text-indigo-600" />,
                title: "Progress Tracking",
                desc: "Monitor task completion with detailed analytics and customizable dashboards for clear insights.",
              },
            ].map(({ icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group p-6 rounded-lg bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                  {icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600 leading-relaxed">{desc}</p>
                <Link
                  href="/guides"
                  className="mt-4 inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800"
                >
                  Learn More
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
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
            Ready to Streamline Your Tasks?
          </h2>
          <p className="opacity-90 mb-6 max-w-xl mx-auto">
            Start using TaskFlow’s task management features today to organize your projects and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <Link
              href="/register"
              className="px-6 py-3 rounded-lg bg-white text-indigo-700 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              Start Free Trial
              <ChevronRight className="ml-1 h-4 w-4 text-indigo-700" />
            </Link>
            <Link
              href="/demo"
              className="px-6 py-3 rounded-lg border border-indigo-300 text-white font-semibold hover:bg-indigo-600 transform hover:scale-105 transition-all duration-200"
            >
              Request a Demo
            </Link>
          </div>
          <p className="mt-4 text-slate-200">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </div>
  );
}