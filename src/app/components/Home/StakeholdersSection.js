"use client";

import React from "react";
import {
  Brain,
  HeartHandshake,
  Gamepad2,
} from "lucide-react"; // Lucide SVG icons (lightweight and responsive)

export default function StakeholdersSection() {
  const features = [
    {
      id: 1,
      title: "Personalised Intelligence",
      desc: "Adaptive learning paths for every mind.",
      icon: <Brain className="w-12 h-12 text-emerald-400" />,
    },
    {
      id: 2,
      title: "Human-Like Support",
      desc: "Feedback that teaches, not just grades.",
      icon: <HeartHandshake className="w-12 h-12 text-pink-400" />,
    },
    {
      id: 3,
      title: "Motivation That Lasts",
      desc: "Gamified, bilingual, stress-free learning.",
      icon: <Gamepad2 className="w-12 h-12 text-yellow-400" />,
    },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-zinc-900 via-zinc-800 to-white dark:from-black dark:via-zinc-900 dark:to-zinc-950 py-20 px-6 md:px-12 text-center">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          One Platform. Three Stakeholders. Infinite Impact.
        </h2>
        <p className="text-zinc-300 mb-16 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
          MentoroidAI unites Students, Teachers, and Parents in one AI-powered ecosystem —
          making education personalised, measurable, and joyful.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center justify-center text-center bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md rounded-2xl p-8 shadow-md hover:shadow-lg hover:scale-[1.03]"
            >
              <div className="mb-4 flex items-center justify-center bg-white/10 rounded-full p-6">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-300 text-sm sm:text-base max-w-xs mx-auto">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
