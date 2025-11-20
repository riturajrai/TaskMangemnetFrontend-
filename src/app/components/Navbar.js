"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import logo from './logo.png';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="mx-auto flex items-center justify-between px-4 md:px-6 py-3 max-w-8xl ">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
          <Image
            src={logo}
            alt="MentoroidAI Logo"
            width={32}
            height={32}
            className="md:w-10 md:h-10"
            priority
          />
          <span className="text-lg md:text-xl font-semibold text-[#0A1E46] whitespace-nowrap">
            mentoroid<span className="text-[#00A082]">AI</span>
          </span>
        </Link>
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-[#0A1E46] font-medium">
          <Link href="#features" className="hover:text-[#00A082] transition text-sm lg:text-base">
            Features
          </Link>
          <Link href="#solutions" className="hover:text-[#00A082] transition text-sm lg:text-base">
            Solutions
          </Link>
          <Link href="#pricing" className="hover:text-[#00A082] transition text-sm lg:text-base">
            Pricing
          </Link>
          <Link href="#about" className="hover:text-[#00A082] transition text-sm lg:text-base">
            About
          </Link>
          <Link
            href="/login"
            className="border border-[#0A1E46] px-3 py-1 md:px-4 md:py-1.5 rounded-md hover:bg-[#0A1E46] hover:text-white transition text-sm"
          >
            Log in
          </Link>
        </div>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#0A1E46] p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-md py-2 space-y-2 text-center border-t border-gray-200 overflow-hidden">
          <Link
            href="#features"
            className="block text-xs text-[#0A1E46] font-medium hover:text-[#00A082] transition px-4 py-3"
            onClick={() => setOpen(false)}>
            Features
          </Link>
          <Link
            href="#solutions"
            className="block text-xs text-[#0A1E46] font-medium hover:text-[#00A082] transition px-4 py-3"
            onClick={() => setOpen(false)}
          >
            Solutions
          </Link>
          <Link
            href="#pricing"
            className="block text-xs text-[#0A1E46] font-medium hover:text-[#00A082] transition px-4 py-3"
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="#about"
            className="block text-xs text-[#0A1E46] font-medium hover:text-[#00A082] transition px-4 py-3"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          <Link
            href="/login"
            className="block mx-4 border border-[#0A1E46] text-xs text-[#0A1E46] px-6 py-3 rounded-md hover:bg-[#0A1E46] hover:text-white transition font-medium"
            onClick={() => setOpen(false)}
          >Log in</Link>
        </div>
      )}
    </nav>
  );
}