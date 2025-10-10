"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Award, Users, Globe, ChevronRight } from "lucide-react";
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-16 text-[12px] font-[Inter] relative">
      {/* Floating Gradient Orbs */}
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-8 right-8 w-80 h-80 rounded-full bg-gradient-to-r from-purple-300 to-indigo-300 opacity-20 blur-3xl animate-pulse z-0" />
      <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 opacity-15 blur-3xl animate-pulse z-0" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-12 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl font-bold text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4"
        >
          About TaskFlow
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-600 max-w-xl mx-auto"
        >
          Empowering teams worldwide to streamline workflows, enhance collaboration, and achieve remarkable results with intelligent task management.
        </motion.p>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              At TaskFlow, our mission is to revolutionize how teams work by providing an AI-powered platform that simplifies complex workflows, fosters seamless collaboration, and drives productivity. We believe in empowering every team to achieve their goals with precision and ease.
            </p>
            <Link
              href="/signup"
              className="inline-block mt-4 px-4 py-2 font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transform hover:scale-105 transition-all duration-200"
            >
              Get Started
              <ChevronRight className="inline ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -right-4 w-full h-full rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 -z-10"></div>
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-md">
              <Globe className="h-8 w-8 text-indigo-600 mb-4" />
              <p className="text-slate-600 italic">
                &quot;Transforming productivity for teams across the globe.&quot;
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto mb-12 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-slate-900 text-center mb-6"
        >
          Our Core Values
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Award className="h-6 w-6 text-indigo-600" />,
              title: "Innovation",
              desc: "We leverage cutting-edge AI to deliver smarter, more efficient solutions.",
            },
            {
              icon: <Users className="h-6 w-6 text-indigo-600" />,
              title: "Collaboration",
              desc: "We foster teamwork with tools designed for seamless communication.",
            },
            {
              icon: <Globe className="h-6 w-6 text-indigo-600" />,
              title: "Impact",
              desc: "We empower teams to make a meaningful difference in their work.",
            },
          ].map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-lg bg-white border border-slate-200 hover:border-indigo-100 hover:shadow-md transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
                {value.icon}
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">{value.title}</h3>
              <p className="text-slate-600">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto mb-12 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-slate-900 text-center mb-6"
        >
          Meet Our Team
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Sarah Johnson", role: "CEO & Founder", avatar: "SJ" },
            { name: "Michael Chen", role: "CTO", avatar: "MC" },
            { name: "Elena Rodriguez", role: "Head of Product", avatar: "ER" },
            { name: "David Lee", role: "Lead Engineer", avatar: "DL" },
          ].map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-4 rounded-lg bg-white border border-slate-200 hover:shadow-md transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold mb-4 mx-auto">
                {member.avatar}
              </div>
              <h3 className="text-sm font-semibold text-slate-900 text-center">{member.name}</h3>
              <p className="text-slate-600 text-center">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trust Signals */}
      <div className="max-w-7xl mx-auto mb-12 text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-slate-600 mb-6"
        >
          Trusted by over 30,000 professionals worldwide
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-2"
        >
          {[...Array(5)].map((_, i) => (
            <Award key={i} className="h-4 w-4 text-indigo-600" />
          ))}
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-slate-600 mt-4"
        >
          &quot;TaskFlow has transformed our workflow with its intuitive design and powerful features.&quot; — Sarah J., Project Director
        </motion.p>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto mb-12 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-slate-900 text-center mb-6"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              question: "What is TaskFlow?",
              answer:
                "TaskFlow is an AI-powered task management platform designed to streamline workflows, enhance collaboration, and boost productivity for teams of all sizes.",
            },
            {
              question: "Who can benefit from TaskFlow?",
              answer:
                "From startups to enterprises, any team looking to organize projects, automate tasks, and gain insights through analytics can benefit from TaskFlow.",
            },
            {
              question: "How does TaskFlow ensure data security?",
              answer:
                "We use end-to-end encryption and comply with SOC 2 standards to protect your data, ensuring enterprise-grade security.",
            },
            {
              question: "How can I get started with TaskFlow?",
              answer:
                "Sign up for our free Basic plan with no credit card required, or contact our sales team for a custom Enterprise solution.",
            },
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-4 rounded-lg border border-slate-200"
            >
              <h3 className="text-sm font-semibold text-slate-900 mb-2">{faq.question}</h3>
              <p className="text-slate-600">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto text-center bg-gradient-to-r from-indigo-700 to-purple-700 text-white py-12 rounded-lg relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold mb-4"
        >
          Ready to Boost Your Team&apos;s Productivity?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-200 mb-6 max-w-xl mx-auto"
        >
          Join thousands of teams using TaskFlow to streamline workflows and achieve results.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/signup"
            className="inline-block px-6 py-3 font-semibold bg-white text-indigo-700 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Start Free Trial
            <ChevronRight className="inline ml-2 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
