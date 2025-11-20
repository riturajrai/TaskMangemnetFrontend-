"use client";

import React from "react";
import { Target, Gamepad2, Lightbulb } from "lucide-react";

export default function WhyMentoroidWorks() {
  const features = [
    {
      id: 1,
      title: "Personalised Paths",
      desc: "AI adapts lessons, quizzes & pace based on your learning pattern.",
      icon: <Target className="w-8 h-8 md:w-10 md:h-10" />,
      colorBg: "bg-emerald-50 dark:bg-emerald-900/20",
      colorIcon: "text-emerald-500 dark:text-emerald-400",
    },
    {
      id: 2,
      title: "Fun, Not Fear",
      desc: "Quests, badges, and streaks make learning addictive — not stressful.",
      icon: <Gamepad2 className="w-8 h-8 md:w-10 md:h-10" />,
      colorBg: "bg-yellow-50 dark:bg-yellow-900/10",
      colorIcon: "text-yellow-400 dark:text-yellow-300",
    },
    {
      id: 3,
      title: "Feedback That Teaches",
      desc: "AI explains why you made an error, helping you truly master topics.",
      icon: <Lightbulb className="w-8 h-8 md:w-10 md:h-10" />,
      colorBg: "bg-zinc-50 dark:bg-zinc-800/30",
      colorIcon: "text-zinc-700 dark:text-zinc-300",
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-zinc-950 py-16 md:py-24 px-6 md:px-12">
      <div className="">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white">
            Why MentoroidAI Works
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
            A blend of personalization, motivation and intelligent feedback — built for real learning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((item) => (
            <article
              key={item.id}
              className="relative group bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1"
              aria-labelledby={`why-title-${item.id}`}
            >
              {/* Icon container */}
              <div
                className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-xl ${item.colorBg} ${item.colorIcon} mb-4`}
                aria-hidden="true"
              >
                {React.cloneElement(item.icon, {
                  className: `${item.colorIcon} w-8 h-8 md:w-10 md:h-10`,
                })}
              </div>

              {/* Title */}
              <h3
                id={`why-title-${item.id}`}
                className="text-lg md:text-xl font-semibold text-zinc-900 dark:text-white leading-snug mb-2"
              >
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400">
                {item.desc}
              </p>

              {/* Accent gradient / chevron on hover (subtle) */}
              <span
                className="absolute -right-6 top-6 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id={`g-${item.id}`} x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#34D399" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="24" height="24" rx="6" fill={`url(#g-${item.id})`} />
                </svg>
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
