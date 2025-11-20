"use client";

import { useState, useEffect } from "react";
import {
  School,
  GraduationCap,
  BookOpen,
  Star,
  Quote,
} from "lucide-react";

const testimonials = [
  {
    id: 1,
    icon: <School className="w-12 h-12 text-emerald-500" />,
    quote: "Our school saw 30% faster concept mastery.",
    name: "Bloomfield Int’l School",
    location: "Pune",
  },
  {
    id: 2,
    icon: <GraduationCap className="w-12 h-12 text-amber-500" />,
    quote:
      "MentoroidAI helped our students improve their test scores dramatically.",
    name: "Silver Oak Academy",
    location: "Delhi",
  },
  {
    id: 3,
    icon: <BookOpen className="w-12 h-12 text-blue-500" />,
    quote:
      "AI lessons made learning more engaging and personalized for every child.",
    name: "Greenfield Public School",
    location: "Mumbai",
  },
];

export default function CommunitySlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % testimonials.length),
      4000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-16 px-4 sm:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10">
        What Our Community Says
      </h2>

      {/* Testimonial Card */}
      <div
        key={testimonials[current].id}
        className="max-w-2xl mx-auto bg-gradient-to-br from-green-50 to-orange-50 
                   p-8 md:p-10 rounded-2xl shadow-md transition-all duration-700 ease-in-out"
      >
        <div className="flex justify-center mb-4">
          {testimonials[current].icon}
        </div>

        <Quote className="w-8 h-8 mx-auto text-gray-400 mb-3" />
        <p className="text-lg md:text-xl italic text-gray-700 mb-6 leading-relaxed">
          "{testimonials[current].quote}"
        </p>

        <div className="flex flex-col items-center">
          <h4 className="text-lg font-bold text-gray-900">
            {testimonials[current].name}
          </h4>
          <p className="text-gray-500 text-sm">{testimonials[current].location}</p>
        </div>

        <div className="flex justify-center gap-1 mt-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === current ? "bg-emerald-500 w-5" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
