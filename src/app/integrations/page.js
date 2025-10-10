"use client";

import { motion } from "framer-motion";
import { ChevronRight, Zap, Github, Slack, Globe } from "lucide-react"; // Microsoft removed

export default function IntegrationsPage() {
  const integrations = [
    { name: "Slack", icon: <Slack className="w-6 h-6 text-indigo-600" /> },
    { name: "GitHub", icon: <Github className="w-6 h-6 text-indigo-600" /> },
    { name: "Google Workspace", icon: <Globe className="w-6 h-6 text-indigo-600" /> },
    { name: "Microsoft Teams", icon: <Globe className="w-6 h-6 text-indigo-600" /> }, // Microsoft replaced with Globe
    { name: "Zapier", icon: <Zap className="w-6 h-6 text-indigo-600" /> },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 text-slate-900 font-[Inter] text-[12px]">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6"
        >
          Connect TaskFlow With Your Favorite Tools
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-600 max-w-2xl mx-auto mb-8 text-lg"
        >
          Seamlessly integrate TaskFlow with the tools your team already uses. Automate workflows, collaborate efficiently, and increase productivity across platforms.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a
            href="/signup"
            className="inline-flex items-center px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Get Started
            <ChevronRight className="ml-2 h-4 w-4" />
          </a>
        </motion.div>
      </div>

      {/* Integrations Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Popular Integrations
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-lg">
            TaskFlow connects with the tools you already use. Increase team productivity and reduce manual work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {integrations.map((integration, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="w-16 h-16 flex items-center justify-center mb-4 bg-indigo-50 rounded-full">
                {integration.icon}
              </div>
              <span className="text-base font-medium text-slate-900">{integration.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-700 to-purple-700 text-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Connect Your Tools?
          </h2>
          <p className="opacity-90 mb-6 max-w-xl mx-auto text-lg">
            Start using TaskFlow integrations today and streamline your workflows across platforms.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <a
              href="/signup"
              className="px-6 py-3 rounded-lg bg-white text-indigo-700 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              Start Free Trial
              <ChevronRight className="ml-2 h-4 w-4 text-indigo-700" />
            </a>
            <a
              href="/demo"
              className="px-6 py-3 rounded-lg border border-indigo-300 text-white font-semibold hover:bg-indigo-600 transform hover:scale-105 transition-all duration-200"
            >
              Request a Demo
            </a>
          </div>
          <p className="mt-4 text-slate-200 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </div>
  );
}
