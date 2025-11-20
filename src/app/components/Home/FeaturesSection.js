"use client";

import React, { useState } from "react";
import {
  Camera,
  MessageSquareQuote,
  Languages,
  FileText,
  Gauge,
  Calendar,
  PenTool,
  ClipboardList,
  Lightbulb,
  Sparkles,
  Gamepad,
  BookOpen,
  Users,
  Target,
} from "lucide-react";

const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState("students");

  const featuresData = {
    students: [
      {
        icon: <Camera className="w-7 h-7 text-emerald-500" />,
        title: "AI Homework Helper (Photo → Step-by-Step)",
        desc: "Click a photo → get guided hints, reasoning steps, and whiteboard breakdowns. Helps in Maths, Science, English & more — without giving direct answers.",
      },
      {
        icon: <MessageSquareQuote className="w-7 h-7 text-emerald-500" />,
        title: "Chanakya Mode (Think, Don’t Copy)",
        desc: "Instead of giving answers, Chanakya Mode asks analytical questions, encourages reasoning, and builds deeper understanding — just like a real mentor.",
      },
      {
        icon: <Languages className="w-7 h-7 text-emerald-500" />,
        title: "AI English Lab (Grammar + Speaking + Pronunciation)",
        desc: "Grammar Guru, SpeakRight AI, English Adda & Pronunciation Coach remove English fear. Learn in English or Hindi, confidently & naturally.",
      },
      {
        icon: <FileText className="w-7 h-7 text-emerald-500" />,
        title: "Smart Summaries, Flashcards & Auto Notes",
        desc: "Upload any chapter → get bullet notes, flashcards, quizzes, mind maps & even podcasts instantly. Saves 70% study time — perfect for exam revision.",
      },
      {
        icon: <Gauge className="w-7 h-7 text-emerald-500" />,
        title: "Progress Dashboard (Your Academic Fitness Tracker)",
        desc: "Track strengths, weak areas, accuracy trends, streaks & XP. Adaptive Practice auto-fixes gaps using real-time performance analytics.",
      },
      {
        icon: <Calendar className="w-7 h-7 text-emerald-500" />,
        title: "Today’s Learning – Your Daily Personalized Plan",
        desc: "No more confusion. Daily plan includes one lesson, one quick quiz, one podcast/visual & streak tracking. Builds consistent learning habits.",
      },
    ],

    teachers: [
      {
        icon: <PenTool className="w-7 h-7 text-emerald-500" />,
        title: "Teacher Toolkit (AI Tools That Save Hours)",
        desc: "One tap generates lesson plans, rubrics, assessments & class activities — making teaching easier, faster & more impactful.",
      },
      {
        icon: <ClipboardList className="w-7 h-7 text-emerald-500" />,
        title: "Track Student Progress",
        desc: "AI analytics dashboard shows performance by topic and chapter.",
      },
      {
        icon: <Lightbulb className="w-7 h-7 text-emerald-500" />,
        title: "Smart Teaching Aids",
        desc: "Get visual aids and bilingual explanations for complex concepts.",
      },
      {
        icon: <Sparkles className="w-7 h-7 text-emerald-500" />,
        title: "AI Suggestions",
        desc: "MentoroidAI suggests custom lessons based on student behavior.",
      },
      {
        icon: <Gamepad className="w-7 h-7 text-emerald-500" />,
        title: "Interactive Classes",
        desc: "Gamified content keeps engagement high during lessons.",
      },
      {
        icon: <BookOpen className="w-7 h-7 text-emerald-500" />,
        title: "Curriculum Support",
        desc: "Aligned with CBSE, ICSE & all major boards.",
      },
    ],

    parents: [
      {
        icon: <Users className="w-7 h-7 text-emerald-500" />,
        title: "Monitor Learning Progress",
        desc: "Real-time insights on your child’s growth & daily activities.",
      },
      {
        icon: <Target className="w-7 h-7 text-emerald-500" />,
        title: "AI Progress Reports",
        desc: "Weekly personalized reports tracking strengths & improvement areas.",
      },
      {
        icon: <Lightbulb className="w-7 h-7 text-emerald-500" />,
        title: "Smart Notifications",
        desc: "Get instant alerts for new lessons, tests, or milestones.",
      },
      {
        icon: <Sparkles className="w-7 h-7 text-emerald-500" />,
        title: "Balanced Screen Time",
        desc: "AI tracks study vs play time and keeps it healthy.",
      },
      {
        icon: <Gamepad className="w-7 h-7 text-emerald-500" />,
        title: "Gamified Rewards",
        desc: "Children earn stars and badges for completing lessons.",
      },
      {
        icon: <Languages className="w-7 h-7 text-emerald-500" />,
        title: "Bilingual Parent Portal",
        desc: "View reports and progress in both Hindi & English.",
      },
    ],
  };

  const features = featuresData[activeTab];

  return (
    <section
      id="features"
      className="w-full bg-gradient-to-b from-white to-emerald-50 dark:from-zinc-950 dark:to-zinc-900 py-16 sm:py-20 px-4 sm:px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
          Who We Empower
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {["students", "teachers", "parents"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 whitespace-nowrap ${
                activeTab === tab
                  ? "bg-emerald-500 text-white shadow-lg scale-105"
                  : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-emerald-200 dark:border-zinc-700 hover:bg-emerald-50 dark:hover:bg-zinc-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-zinc-800 border border-emerald-100 dark:border-zinc-700 rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="mb-4 p-3 w-fit rounded-lg bg-emerald-50 dark:bg-emerald-900/30 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;