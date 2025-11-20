"use client";

import {
  Linkedin,
  Youtube,
  Instagram,
  Twitter,
  Info,
  BookOpen,
  GraduationCap,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0A0E1A] text-white pt-16 pb-8 px-6 sm:px-10 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12">
        {/* About */}
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Info className="text-emerald-400 w-5 h-5" /> About
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="#" className="hover:text-emerald-400 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-400 transition">
                Vision
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-400 transition">
                Team
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-400 transition">
                Careers
              </a>
            </li>
          </ul>
        </div>

        {/* Product */}
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BookOpen className="text-emerald-400 w-5 h-5" /> Product
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="#" className="hover:text-emerald-400 transition">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-400 transition">
                For Schools
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-400 transition">
                For Teachers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-400 transition">
                For Parents
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <GraduationCap className="text-emerald-400 w-5 h-5" /> Resources
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="#" className="hover:text-emerald-400 transition">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-400 transition">
                Case Studies
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-400 transition">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-emerald-400 transition">
                Help Center
              </a>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="text-emerald-400 w-5 h-5" /> Connect
          </h3>
          <ul className="space-y-3 text-gray-300">
            <li>
              <a href="#" className="hover:text-emerald-400 transition">
                Contact
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-4 mt-5 text-gray-400">
            <a
              href="#"
              className="hover:text-emerald-400 transition-transform transform hover:scale-110"
            >
              <Linkedin size={22} />
            </a>
            <a
              href="#"
              className="hover:text-emerald-400 transition-transform transform hover:scale-110"
            >
              <Youtube size={22} />
            </a>
            <a
              href="#"
              className="hover:text-emerald-400 transition-transform transform hover:scale-110"
            >
              <Instagram size={22} />
            </a>
            <a
              href="#"
              className="hover:text-emerald-400 transition-transform transform hover:scale-110"
            >
              <Twitter size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400 text-sm">
        <p>
          © MentoroidAI Labs Pvt. Ltd. 2025 | Made with{" "}
          <span className="text-rose-500">❤️</span> in India
        </p>
        <p className="mt-2 text-emerald-400 font-semibold text-sm sm:text-base">
          “Every Mind is Unique — So Should Be Learning.”
        </p>
      </div>
    </footer>
  );
}
