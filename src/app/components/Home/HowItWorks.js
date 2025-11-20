"use client";

import { BookOpen, Brain, Sparkles, TrendingUp } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Pick a Topic or Upload Notes",
      desc: "Choose your goal — revision, test prep, or concept clarity.",
      icon: <BookOpen className="w-6 h-6 text-emerald-500" />,
    },
    {
      number: "2",
      title: "AI Analyses You",
      desc: "MentoroidAI studies your responses & patterns.",
      icon: <Brain className="w-6 h-6 text-emerald-500" />,
    },
    {
      number: "3",
      title: "Personalised Experience",
      desc: "Get summaries, podcasts, or flashcards — whichever you learn best with.",
      icon: <Sparkles className="w-6 h-6 text-emerald-500" />,
    },
    {
      number: "4",
      title: "Track Progress & Improve",
      desc: "Get feedback and celebrate milestones with badges.",
      icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
    },
  ];

  return (
    <section className="w-full bg-[#F9FAFB] dark:bg-zinc-950 py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-zinc-900 dark:text-white mb-14">
          How <span className="text-emerald-500">It Works</span>
        </h2>

        {/* Steps */}
        <div className="flex flex-col gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-6 hover:translate-x-1 transition-transform"
            >
              {/* Number Circle */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-white font-semibold text-lg shrink-0">
                {step.number}
              </div>

              {/* Text + Icon */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {step.icon}
                  <h3 className="text-lg md:text-xl font-semibold text-zinc-900 dark:text-white">
                    {step.title}
                  </h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
