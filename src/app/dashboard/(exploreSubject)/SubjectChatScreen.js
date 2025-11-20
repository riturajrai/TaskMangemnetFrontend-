"use client";
import { ChevronLeft, Send } from "lucide-react";
import Image from "next/image";

export default function SubjectChatScreen({ subject, setActive }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-3 sm:px-4 md:px-16 py-4 sm:py-6 md:py-8 overflow-hidden bg-white">
      <div className="relative w-full h-[85vh] rounded-lg outline outline-1 outline-[#2563EB] p-3 sm:p-4 md:p-6 lg:p-10 overflow-hidden">
        {/* 🟠 Fluid Blob Shape (top-right background) */}
        <div className="absolute top-[-30px] right-[-40px] w-[180px] h-[140px] sm:top-[-60px] sm:right-[-80px] sm:w-[320px] sm:h-[260px] md:top-[-100px] md:right-[-150px] md:w-[600px] md:h-[450px] z-0">
          <svg
            viewBox="0 0 600 400"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M600,0 C520,120 480,160 350,220 C250,260 120,200 0,400 L600,400 Z"
              fill="#FF7B4D"
            />
        </svg>
        </div>

        {/* 🖼️ Vector Image (Top-right overlay) */}
        <div className="absolute top-0 right-0 w-[120px] h-[90px] sm:w-[200px] sm:h-[150px] md:w-[300px] md:h-[225px] lg:w-[400px] lg:h-[300px] z-10">
          <Image
            src="/assets/chatvectorsubject.png"
            alt="Subject Chat Banner"
            fill
            className="object-contain pointer-events-none"
            priority
          />
        </div>

        {/* 💬 Header */}
        <div className="relative z-20 flex items-center space-x-2 sm:space-x-3 mt-1 sm:mt-4 md:mt-6 lg:mt-10">
          <button
            onClick={() => setActive("explore")}
            className="p-1.5 sm:p-2 md:p-3 rounded-full bg-[#2563EB] hover:bg-blue-700 transition flex-shrink-0"
          >
            <ChevronLeft className="text-white w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 truncate">
            Chat about {subject}
          </h1>
        </div>

        {/* 💭 Subtitle */}
        <p className="relative z-20 text-xs sm:text-sm md:text-base text-gray-600 mt-1.5 sm:mt-2 pr-2 sm:pr-0">
          Ask me anything about {subject}. I'll help you understand concepts and solve doubts.
        </p>

        {/* 🧠 Chat Area Placeholder */}
        <div className="relative z-20 mt-6 sm:mt-8 md:mt-10 mb-16 sm:mb-18 md:mb-20 flex flex-col space-y-3 sm:space-y-4 w-full max-w-3xl mx-auto">
          <div className="self-start bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-lg max-w-[85%] sm:max-w-[80%] text-sm sm:text-base">
            Hello! What would you like to know about {subject}?
          </div>
        </div>

        {/* ✏️ Chat Input Bar */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-0 right-0 flex items-center justify-center z-20 px-2 sm:px-0">
          <div className="flex w-full sm:w-[90%] md:w-[75%] lg:w-[60%] bg-white border border-gray-300 rounded-full shadow-md overflow-hidden">
            <input
              type="text"
              placeholder={`Ask a ${subject} question...`}
              className="flex-grow px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base focus:outline-none"
            />
            <button className="bg-[#2563EB] hover:bg-blue-700 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-r-full flex items-center justify-center flex-shrink-0">
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}