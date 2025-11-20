"use client";

import { Brain, Building2, TrendingUp, Globe2 } from "lucide-react";

export default function MentoroidMovement() {
  const stats = [
    {
      id: 1,
      number: "49,980+",
      label: "AI tutoring sessions delivered",
      icon: <Brain className="w-6 h-6 text-emerald-400" />,
    },
    {
      id: 2,
      number: "240+",
      label: "Partnered schools & institutes",
      icon: <Building2 className="w-6 h-6 text-emerald-400" />,
    },
    {
      id: 3,
      number: "60%",
      label: "Students showed improvement",
      icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
    },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-[#0B0E2C] to-white py-20 px-6 md:px-12 text-center text-white">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-16">
          The MentoroidAI Movement
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {stats.map((item) => (
            <div key={item.id} className="flex flex-col items-center">
              <p className="text-5xl font-bold text-emerald-300 mb-2">
                {item.number}
              </p>
              <div className="flex items-center gap-2 text-zinc-200">
                {item.icon}
                <p className="text-lg">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Language Info */}
        <div className="flex flex-col items-center justify-center text-zinc-200">
          <div className="flex items-center gap-2 text-lg font-semibold mb-1">
            <Globe2 className="w-6 h-6 text-emerald-300" />
            <span>
              2 Languages • <span className="text-white">English + Hindi</span>
            </span>
          </div>
          <p className="text-sm opacity-80">
            CBSE, ICSE & State Boards
          </p>
        </div>
      </div>
    </section>
  );
}
