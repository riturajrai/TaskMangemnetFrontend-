"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MessageSquare, Users, ChevronRight, Globe, Award } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We&apos;ll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

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
          Get in Touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-600 max-w-xl mx-auto"
        >
          Have questions or need support? Contact our team to learn how TaskFlow can help your organization thrive.
        </motion.p>
      </div>

      {/* Contact Form Section */}
      <div className="max-w-7xl mx-auto mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-md">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Send Us a Message</h2>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-1">
                  Name
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-600" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full pl-10 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:border-indigo-300 focus:ring-indigo-300 outline-none"
                  />
                </div>
              </div>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-600" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:border-indigo-300 focus:ring-indigo-300 outline-none"
                  />
                </div>
              </div>
              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-900 mb-1">
                  Message
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-indigo-600" />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    required
                    className="w-full pl-10 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:border-indigo-300 focus:ring-indigo-300 outline-none h-24 resize-none"
                  />
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full py-3 font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Send Message
                <ChevronRight className="inline ml-2 h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Why Contact Us */}
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Why Contact Us?</h2>
            <p className="text-slate-600 mb-4">
              Our team is here to help you succeed. Whether you need assistance with setup, have questions about our plans, or want a custom solution, we&apos;re ready to support you.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <Users className="h-6 w-6 text-indigo-600 mr-2" />
                <p className="text-slate-600">
                  <span className="font-semibold text-slate-900">Dedicated Support:</span> Get personalized assistance from our expert team.
                </p>
              </div>
              <div className="flex items-start">
                <Globe className="h-6 w-6 text-indigo-600 mr-2" />
                <p className="text-slate-600">
                  <span className="font-semibold text-slate-900">Global Reach:</span> Supporting teams worldwide with 24/7 availability.
                </p>
              </div>
            </div>
            <Link
              href="/signup"
              className="inline-block mt-4 px-4 py-2 font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transform hover:scale-105 transition-all duration-200"
            >
              Try TaskFlow Now
              <ChevronRight className="inline ml-2 h-4 w-4" />
            </Link>
          </div>
        </motion.div>
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
          &quot;TaskFlow&apos;s support team helped us get started in no time!&quot; — Michael C., CTO
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
              question: "How quickly will I get a response?",
              answer: "Our team typically responds within 24 hours, often faster for urgent inquiries.",
            },
            {
              question: "Can I contact support for free plan users?",
              answer: "Yes, all TaskFlow users, including those on the free plan, have access to email support.",
            },
            {
              question: "Do you offer phone support?",
              answer: "Phone support is available for Pro and Enterprise plan users. Contact us to schedule a call.",
            },
            {
              question: "How can I request a demo?",
              answer: "Fill out the contact form or reach out to our sales team via email to schedule a personalized demo.",
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

export default ContactPage;