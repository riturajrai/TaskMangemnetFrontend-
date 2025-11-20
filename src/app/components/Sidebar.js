"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowUpDownIcon, MenuIcon, XIcon, ArrowUp, ChevronDown } from "lucide-react";
import { menuItems } from "../dashboard/data/menuItems";
import Image from "next/image";
import Cookies from "js-cookie";

export default function Sidebar({ active, setActive }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // 🧠 Read user cookie
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        if (user.name) setUserName(user.name);
      } catch (err) {
        console.error("Error parsing user cookie:", err);
      }
    }
  }, []);

  // 🧩 Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    Cookies.remove("user");
    window.location.href = "/login";
  };

  return (
    <>
      {/* 🌐 Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-[#FFFFFF] p-4 shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="text-white font-bold text-lg">Mentoroid</div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none"
        >
          {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* 🌙 Sidebar Drawer */}
      <div
        className={`fixed md:static top-0 left-0 h-full md:h-screen w-4/5 sm:w-2/5 md:w-1/4 lg:w-1/5 bg-[#FFFFFF] p-6  shadow-2xl transform transition-transform duration-300 flex flex-col z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo Section */}
        <div className="flex-shrink-0 w-full h-[60px] bg-[#FFFFFF] flex items-center justify-between px-5 rounded-[20px] shadow-md mt-10 md:mt-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center text-white font-semibold rounded-md">
            <Image
            src="/assets/mentoroid.png" // 🖼️ your logo image path
            alt="Mentoroid Logo"
            width={50}
            height={50}
            className="object-contain"
          />        
              </div>
            <div className="flex flex-col leading-tight">
              <div className="font-bold text-lg">
                <span className="text-[#0B3D91]">Mentoroid</span>
               <span className="text-[#20C997]">AI</span>
              </div>

              <p className="text-sm text-[#002D8A] opacity-70">Free Plan</p>
            </div>
          </div>
          <ArrowUpDownIcon className="text-white w-4 h-4 opacity-80 cursor-pointer" />
        </div>

        {/* Menu Section */}
        {/* Menu Section */}
<div className="mt-8 flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-[#FFFFFF] scrollbar-track-transparent hover:scrollbar-thumb-[#205b5a]">
  {menuItems.map((item) => (
    <div
      key={item.id}
      onClick={() => {
        setActive(item.id);
        setIsOpen(false);
      }}
      className={`flex items-center space-x-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200
        ${
          active === item.id
            ? "bg-[#006188] text-white"
            : "text-[#333333] hover:bg-[#006188] hover:text-white"
        }`}
    >
      <span className="text-xl">{item.icon}</span>
      <span className="font-medium">{item.label}</span>
    </div>
  ))}
</div>



      </div>

      {/* 🌫 Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
