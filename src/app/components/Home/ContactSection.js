"use client";

import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="bg-[#F9FAFB] py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Left Side - Contact Info */}
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Mail className="text-emerald-500 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">contact@mentoroidai.com</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Phone className="text-emerald-500 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Phone</h3>
                <p className="text-gray-600">+91 9876543210</p>
              </div>
            </div>

            {/* Office */}
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <MapPin className="text-emerald-500 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Office</h3>
                <p className="text-gray-600">Mumbai, Maharashtra, India</p>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side - Contact Form */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">I am a...</label>
              <select className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                <option>Student</option>
                <option>Parent</option>
                <option>Teacher</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
              <textarea
                placeholder="Tell us how we can help..."
                rows="4"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-[#0A0E1A] text-white font-semibold py-3 rounded-lg hover:bg-gray-900 transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
