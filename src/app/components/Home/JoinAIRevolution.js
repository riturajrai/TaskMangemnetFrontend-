"use client";

import { Phone, Play, BookOpenCheck, Brain, Sigma, Smile } from "lucide-react";

export default function JoinLearningSection() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Top Section */}
      <section className="bg-[#0A0E1A] text-white text-center py-16 px-4 sm:px-6 md:px-10 lg:px-20 w-full">
        <div className="space-y-6 text-xl sm:text-2xl md:text-3xl font-semibold leading-relaxed">
          <p className="flex items-center justify-center gap-3">
            <Smile className="w-7 h-7 text-emerald-400" />
            <span>
              <span className="text-emerald-400">From Grammar Fear</span> →{" "}
              <span className="text-emerald-500">English Cheer!</span>
            </span>
          </p>

          <p className="flex items-center justify-center gap-3">
            <Brain className="w-7 h-7 text-yellow-400" />
            <span>
              <span className="text-yellow-400">From Science Confusion</span> →{" "}
              <span className="text-yellow-400">Concept Clarity!</span>
            </span>
          </p>

          <p className="flex items-center justify-center gap-3">
            <Sigma className="w-7 h-7 text-purple-400" />
            <span>
              <span className="text-purple-400">From Maths Horror</span> →{" "}
              <span className="text-white">Logical Power!</span>
            </span>
          </p>

          <p className="flex items-center justify-center gap-3">
            <BookOpenCheck className="w-7 h-7 text-emerald-400" />
            <span>
              <span className="text-emerald-400">From Exam Stress</span> →{" "}
              <span className="text-emerald-400">Smart Success!</span>
            </span>
          </p>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="bg-gradient-to-r from-emerald-500 via-green-400 to-yellow-400 w-full text-center py-20 px-6 sm:px-10 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-lg">
            Join the AI Learning Revolution
          </h2>
          <p className="text-white text-base sm:text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10">
            Education meets Intelligence. Empower your classroom, your students, your future.
          </p>

          {/* Input Row */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 max-w-4xl mx-auto">
            {/* Button */}
            <button className="flex items-center justify-center gap-2 bg-[#0A0E1A] hover:bg-zinc-900 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg transition-all duration-300 w-full md:w-auto">
              <Play className="w-5 h-5 text-yellow-300" />
              Start Learning Free
            </button>

            {/* Input Field 1 */}
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full md:w-80 p-3 rounded-2xl outline-none border-none text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-emerald-600 shadow-md"
            />

            {/* Input Field 2 */}
            <div className="relative w-full md:w-60">
              <Phone className="absolute left-3 top-3.5 w-5 h-5 text-emerald-600" />
              <input
                type="text"
                placeholder="Phone number"
                className="w-full p-3 pl-10 rounded-2xl outline-none border-none text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-emerald-600 shadow-md"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
