"use client";

import React, { useRef } from "react";
import {
  BookOpenCheck,
  FlaskConical,
  Route,
  ClipboardList,
  Gamepad2,
  Languages,
} from "lucide-react";

export default function LearningUnderstandsYou() {
  const scrollRef = useRef(null);

  const features = [
    {
      id: 1,
      title: "Your Weaknesses Don’t Stay Weak",
      desc: "MentoroidAI detects exactly where you struggle — whether it’s fractions in math, grammar rules in English, or tricky science ideas — and builds a personalized path to fix them.",
      icon: (
        <BookOpenCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
      ),
    },
    {
      id: 2,
      title: "Lessons Explained the Way YOU Learn",
      desc: "Whether science or maths feel abstract, MentoroidAI adapts explanation style using analogies, visuals, diagrams, Hinglish breakdowns, adaptive flashcards, and story-based examples.",
      icon: (
        <FlaskConical className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
      ),
    },
    {
      id: 3,
      title: "Your Daily Plan, Built Just for You",
      desc: "From ‘Revise Photosynthesis’ to ‘5-minute Algebra Booster’, Today’s Learning Plan adjusts to your performance. Slow day → lighter tasks. Focused day → more challenges.",
      icon: <Route className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
    },
    {
      id: 4,
      title: "Revision That Fits Your Attention Span",
      desc: "Chapters turn into mini quizzes, summaries, flashcards, podcasts, and even mini-games so you stay focused without feeling overwhelmed.",
      icon: (
        <ClipboardList className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
      ),
    },
    {
      id: 5,
      title: "Adaptive Practice That Adjusts to You",
      desc: "Get a question wrong? Difficulty drops. Get it right? Difficulty increases. The app adapts in real time so you never feel overwhelmed or under-challenged.",
      icon: (
        <Gamepad2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
      ),
    },
    {
      id: 6,
      title: "An AI Mentor That Knows You",
      desc: "Whether you're a visual learner, listener, or someone who needs examples — MentoroidAI reshapes every lesson to match your speed, style, and strengths.",
      icon: (
        <Languages className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
      ),
    },
  ];

  return (
    <section className="w-full overflow-hidden bg-gradient-to-b from-white to-emerald-50 dark:from-zinc-950 dark:to-zinc-900 py-20 px-6 md:px-12 flex flex-col items-center">
      {/* Heading */}
      <div className="max-w-6xl w-full text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4">
          Learning That Understands You
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg">
          Personalized solutions for every learner.
        </p>
      </div>

      {/* Cards Section */}
      <div
        ref={scrollRef}
        className="
          flex flex-wrap justify-center
          md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3
          gap-6
          overflow-visible
          cursor-default">
        {features.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-full sm:w-[320px] md:w-full bg-white/70 dark:bg-zinc-900/60 border border-emerald-100 dark:border-zinc-700 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-md"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-zinc-800">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
