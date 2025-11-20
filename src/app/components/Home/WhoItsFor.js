"use client";

import React from "react";
import {GraduationCap, Presentation, Building2, Heart, } from "lucide-react"; // Fixed icon import

export default function WhoItsFor() {
  const cards = [
    {
      title: "Students",
      desc: "AI makes every subject fun, personalised, and exam-ready.",
      icon: <GraduationCap className="w-8 h-8 text-emerald-500" />,
      border: "border-emerald-400",
    },
    {
      title: "Teachers",
      desc: "Save hours with AI lesson prep & student analytics.",
      icon: <Presentation className="w-8 h-8 text-amber-500" />,
      border: "border-amber-400",
    },
    {
      title: "Schools / Coaching",
      desc: "Personalised dashboards, real-time insights & better results.",
      icon: <Building2 className="w-8 h-8 text-sky-500" />,
      border: "border-sky-400",
    },
    {
      title: "Parents",
      desc: "Track progress, strengths, and engagement — with clarity.",
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      border: "border-pink-400",
    },
  ];

  return (
    <section className="w-full bg-[#F9FAFB] dark:bg-zinc-950 py-20 px-6 md:px-12 flex flex-col items-center">
      <div className="w-full text-center">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-12">
          Who <span className="text-emerald-500">It’s For</span>
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`rounded-2xl bg-white dark:bg-zinc-900 border ${card.border} p-6 flex flex-col items-start text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
            >
              {/* Icon */}
              <div className="p-3 rounded-xl mb-4 bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                {card.icon}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-2">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
