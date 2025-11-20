"use client";

import React from "react";
import {
  Camera,
  Brain,
  MessageSquare,
  BookOpen,
  Sparkles,
  BarChart3,
  ClipboardList,
  Bot,
} from "lucide-react";

export default function CoreFeatures() {
  const features = [
    {
      title: "AI Homework Helper",
      desc: "Click a photo → get guided hints, not direct answers. Supports Maths, Science, English & more with whiteboard-style explanations.",
      icon: <Camera className="w-8 h-8 text-emerald-500" />,
    },
    {
      title: "Chanakya Mode (Think, Don't Copy)",
      desc: "No direct answers — only analytical questions. Builds logic, reasoning and deeper understanding like a personal Chanakya.",
      icon: <Brain className="w-8 h-8 text-yellow-500" />,
    },
    {
      title: "AI English Lab",
      desc: "Grammar Guru, SpeakRight AI, English Adda & Confidence Coach. Learn with zero fear — in English or Hindi.",
      icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
    },
    {
      title: "Smart Summaries & Flashcards",
      desc: "Upload any chapter → get notes, flashcards, quizzes, mind maps & podcasts. Saves 70% study time.",
      icon: <BookOpen className="w-8 h-8 text-purple-500" />,
    },
    {
      title: "Progress Dashboard",
      desc: "See strengths, weaknesses, accuracy trends, streaks, XP & badges. Adaptive practice auto-fixes weak areas.",
      icon: <BarChart3 className="w-8 h-8 text-cyan-500" />,
    },
    {
      title: "Today's Learning Plan",
      desc: "Your daily personalized plan: 1 lesson, 1 quiz, 1 visual/podcast. Builds consistency automatically.",
      icon: <Sparkles className="w-8 h-8 text-pink-500" />,
    },
    {
      title: "Teacher Toolkit",
      desc: "Lesson plans, rubrics, worksheets, quizzes & student insights in one click. Saves hours of teacher workload.",
      icon: <ClipboardList className="w-8 h-8 text-orange-500" />,
    },
    {
      title: "AI Tutor (24/7 Help)",
      desc: "Explains like a human, asks Chanakya-style questions, gives diagrams, visuals & examples anytime you need.",
      icon: <Bot className="w-8 h-8 text-amber-400" />,
    },
  ];

  return (
    <section className="w-full bg-[#F9FAFB] dark:bg-zinc-950 py-20 px-6 md:px-12 flex flex-col items-center">
      <div className=" w-full text-center">

        <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-12">
          Core <span className="text-emerald-500">Features</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-start justify-start text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="p-3 rounded-xl mb-4 bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                {feature.icon}
              </div>

              <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-2">
                {feature.title}
              </h3>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
