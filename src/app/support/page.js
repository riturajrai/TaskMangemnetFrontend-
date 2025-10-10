"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Users, Phone, MapPin, ChevronRight } from "lucide-react";

export default function SupportPage() {
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
    alert("Thank you! Our support team will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const faqs = [
    {
      question: "How can I reset my password?",
      answer: "Click on 'Forgot Password' on the login page and follow the instructions to reset your password.",
    },
    {
      question: "Can I upgrade my plan later?",
      answer: "Yes! You can upgrade or change your subscription anytime from your account settings.",
    },
    {
      question: "Is there 24/7 support?",
      answer: "Our email support is available 24/7. Phone support is available for Pro and Enterprise users.",
    },
    {
      question: "How do I request a new feature?",
      answer: "Submit a request via our contact form or reach out to support@example.com.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-900 font-[Inter] text-[12px]">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4"
        >
          Support Center
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-600 max-w-xl mx-auto"
        >
          Have questions or need help? Our support team is here to guide you. Fill out the form below or browse the FAQs.
        </motion.p>
      </div>

      {/* Contact Form + FAQ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 py-12">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-lg shadow-md border border-slate-200"
        >
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Contact Support</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">Name</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-600" />
                <input
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
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-600" />
                <input
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
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">Message</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-indigo-600" />
                <textarea
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
              type="submit"
              className="w-full py-3 font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              Send Message
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 space-y-3 text-slate-600 text-sm">
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-indigo-500 mr-2" />
              contact@taskflow.com
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-indigo-500 mr-2" />
              +1 (555) 123-4567
            </div>
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-indigo-500 mr-2 mt-0.5" />
              123 Innovation Drive, San Francisco, CA 94107
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Frequently Asked Questions</h2>
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-md transition-all duration-200"
            >
              <h3 className="text-sm font-semibold text-slate-900 mb-1">{faq.question}</h3>
              <p className="text-slate-600 text-sm">{faq.answer}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-700 to-purple-700 text-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h2>
          <p className="opacity-90 mb-6 max-w-xl mx-auto">
            Our team is here to help you resolve issues quickly. Start a chat, send us an email, or call our support line.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <a
              href="mailto:support@taskflow.com"
              className="px-6 py-3 rounded-lg bg-white text-indigo-700 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              Email Support
            </a>
            <a
              href="tel:+15551234567"
              className="px-6 py-3 rounded-lg border border-indigo-300 text-white font-semibold hover:bg-indigo-600 transform hover:scale-105 transition-all duration-200"
            >
              Call Us
            </a>
          </div>
          <p className="mt-4 text-slate-200">
            Available 24/7 • Response within 24 hours
          </p>
        </motion.div>
      </div>
    </div>
  );
}
