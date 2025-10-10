'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Clock, 
  CheckCircle, 
  Users, 
  BarChart3, 
  Calendar, 
  Zap, 
  Shield, 
  ChevronRight, 
  Star, 
  Award, 
  TrendingUp, 
  Timer, 
  MessageSquare,
  Rocket
} from "lucide-react";
import timeTrackingIllustration from '../../business-task-management-illustration-concept_701961-3283.avif';

export default function TimeTracking() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 text-slate-900 font-[Inter] text-[12px]">
      {/* Floating Gradient Orbs */}
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-8 right-8 w-80 h-80 rounded-full bg-gradient-to-r from-purple-300 to-indigo-300 opacity-20 blur-3xl animate-pulse z-0" />
      <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 opacity-15 blur-3xl animate-pulse z-0" />

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center px-2 py-1 rounded-full font-medium bg-indigo-100 text-indigo-700 mb-4">
            <Clock className="h-3 w-3 mr-1 text-indigo-600" />
            Track time, boost productivity
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Master Your Time with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              TaskFlow Time Tracking
            </span>
          </h1>
          <p className="text-slate-600 mb-6 max-w-md leading-relaxed">
            Optimize your team’s productivity with TaskFlow’s AI-powered time-tracking tools. Monitor tasks, analyze performance, and make data-driven decisions to stay on schedule.
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
              <Rocket className="ml-1 w-4 h-4 text-indigo-600 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center shadow-sm"></div>
              ))}
            </div>
            <div className="text-slate-500">
              <span className="font-semibold text-slate-700">50,000+</span> professionals track time with us
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -top-4 -right-4 w-full h-full rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 -z-10"></div>
          <Image
            src={timeTrackingIllustration}
            alt="Time Tracking Dashboard"
            className="rounded-xl shadow-xl max-w-full h-auto border border-slate-200"
            width={600}
            height={400}
            priority
          />
          <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-lg shadow-md border border-slate-100">
            <div className="flex items-center">
              <Timer className="w-3 h-3 text-indigo-600 mr-1" />
              <span className="font-medium text-slate-700">Time tracked</span>
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">10K+ hours</div>
          </div>
          <div className="absolute -top-4 -right-4 bg-white p-2 rounded-lg shadow-md border border-slate-100 flex items-center">
            <TrendingUp className="h-5 w-5 text-indigo-600 mr-2" />
            <div>
              <div className="font-medium text-slate-700">Efficiency</div>
              <div className="text-slate-500">+35% this quarter</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Why Track Time with TaskFlow Section */}
      <div id="why-time-tracking" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Why Track Time with TaskFlow?
            </h2>
            <p className="text-slate-600 leading-relaxed">
              TaskFlow’s time-tracking features empower teams to measure productivity, optimize workflows, and make informed decisions with real-time data.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Timer className="h-6 w-6 text-indigo-600" />, title: "Accurate Time Tracking", desc: "Track time spent on tasks with precision, down to the second, for better project management." },
              { icon: <BarChart3 className="h-6 w-6 text-indigo-600" />, title: "Insightful Analytics", desc: "Gain deep insights into team performance with detailed time-based reports and dashboards." },
              { icon: <Zap className="h-6 w-6 text-indigo-600" />, title: "Automated Timers", desc: "Start and stop timers effortlessly, with automatic tracking for repetitive tasks." },
              { icon: <Users className="h-6 w-6 text-indigo-600" />, title: "Team Productivity", desc: "Monitor team time allocation to ensure balanced workloads and efficient collaboration." },
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Time-Tracking Features for Success
            </h2>
            <p className="text-slate-600 leading-relaxed">
              TaskFlow’s time-tracking tools are designed to simplify time management, enhance accountability, and drive productivity for modern teams.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Clock className="h-6 w-6 text-indigo-600" />, title: "Real-Time Tracking", desc: "Track time as it happens with intuitive timers integrated into every task and project." },
              { icon: <BarChart3 className="h-6 w-6 text-indigo-600" />, title: "Detailed Reports", desc: "Generate comprehensive reports to analyze time spent by task, project, or team member." },
              { icon: <Calendar className="h-6 w-6 text-indigo-600" />, title: "Calendar Integration", desc: "Sync time tracking with your calendar for seamless scheduling and time allocation." },
              { icon: <Zap className="h-6 w-6 text-indigo-600" />, title: "Automated Time Entries", desc: "Automate time logging for repetitive tasks to save time and reduce manual work." },
              { icon: <Users className="h-6 w-6 text-indigo-600" />, title: "Team Time Insights", desc: "Monitor team time usage to optimize workloads and improve project efficiency." },
              { icon: <Shield className="h-6 w-6 text-indigo-600" />, title: "Secure Data", desc: "Keep your time-tracking data safe with end-to-end encryption and compliance standards." },
              { icon: <MessageSquare className="h-6 w-6 text-indigo-600" />, title: "Collaboration Tools", desc: "Combine time tracking with built-in communication for better team coordination." },
              { icon: <TrendingUp className="h-6 w-6 text-indigo-600" />, title: "Productivity Metrics", desc: "Track time-based KPIs to measure and improve team performance over time." },
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              What Our Users Say About Time Tracking
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Hear from teams who have transformed their time management with TaskFlow’s powerful time-tracking tools.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: "&quot;TaskFlow’s time-tracking feature helped us identify inefficiencies and boost our project delivery by 30%.&quot;", author: "Laura Thompson", role: "Project Manager, TechTrend", avatar: "LT" },
              { text: "&quot;The automated timers and detailed reports have made it so easy to manage our team’s time effectively.&quot;", author: "David Kim", role: "Operations Lead, GrowFast", avatar: "DK" },
              { text: "&quot;TaskFlow’s time insights gave us a clear picture of our team’s productivity, saving us hours every week.&quot;", author: "Sophia Martinez", role: "CTO, InnovateNow", avatar: "SM" },
              { text: "&quot;Integrating time tracking with our existing tools was seamless, and the analytics are a game-changer.&quot;", author: "James Lee", role: "CEO, FutureWorks", avatar: "JL" },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-slate-100"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, star) => (
                    <Star key={star} className="h-4 w-4 text-indigo-600 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-4 italic">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.author}</div>
                    <div className="text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Take Control of Your Team’s Time Today
          </h2>
          <p className="opacity-90 mb-6 max-w-xl mx-auto">
            Start tracking time with TaskFlow and unlock insights to optimize workflows, enhance productivity, and achieve your goals faster.
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
