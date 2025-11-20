"use client";

import { ChevronLeft, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";

export default function BrainbattleScreen({ setActive }) {
  const [formData, setFormData] = useState({
    subject: "",
    difficulty: "",
    mode: "",
    count: 5, // default count
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.name === "count" ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { subject, difficulty, mode, count } = formData;

    if (!subject || !difficulty || !mode || !count) {
      alert("Please select all fields!");
      return;
    }

    try {
      setLoading(true);

      // Payload for your backend
      const payload = {
        topic: `${subject} quiz questions`,
        type: "mcq",
        subject,
        count: count,
        difficulty: difficulty.toLowerCase(),
        include_explanations: true,
      };

      console.log("Sending payload:", payload);

      // Call Next.js API route
      const res = await axios.post("/api/question_gen", payload);

      console.log("API raw response:", res.data);

      const data = res.data;

      // Check if questions exist
      if (!data.questions || data.questions.length === 0) {
        alert("No quiz data found. Please try again.");
        return;
      }

      // Save data to session
      sessionStorage.setItem("brainBattleData", JSON.stringify(formData));
      sessionStorage.setItem("quizQuestions", JSON.stringify(data.questions));

      // Go to quiz page
      setActive("quiz");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while generating questions!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white pb-10">

      {/* Banner */}
      <div className="relative w-[95%] md:w-[80%] mx-auto h-[220px] md:h-[300px] rounded-xl overflow-hidden">
        <Image
          src="/assets/brainbattle.jpg"
          alt="Brainbattle Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Title */}
      <div className="max-w-3xl mx-auto mt-6 px-4 text-center">
        <h3 className="text-lg md:text-2xl font-semibold text-black leading-snug">
          What is this Brain Battle?
        </h3>
        <p className="text-sm md:text-base text-gray-600 mt-2">
          Challenge yourself with customized quiz questions
        </p>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

            {/* Subject Selection */}
            <select
              name="subject"
              onChange={handleChange}
              value={formData.subject}
              className="border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Subject</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
            </select>

            {/* Difficulty Selection */}
            <select
              name="difficulty"
              onChange={handleChange}
              value={formData.difficulty}
              className="border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Mode Selection */}
            <select
              name="mode"
              onChange={handleChange}
              value={formData.mode}
              className="border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Mode</option>
              <option value="Solo">Solo</option>
              <option value="Team">Team</option>
            </select>

            {/* Question Count Selection */}
            <select
              name="count"
              onChange={handleChange}
              value={formData.count}
              className="border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Question Count</option>
              <option value="5">5 Questions</option>
              <option value="10">10 Questions</option>
              <option value="15">15 Questions</option>
              <option value="20">20 Questions</option>
              <option value="25">25 Questions</option>
            </select>

          </div>

          {/* Selected Options Preview */}
          {(formData.subject || formData.difficulty || formData.mode || formData.count) && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 w-full">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Selection:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {formData.subject && (
                  <div>
                    <span className="text-gray-600">Subject:</span>
                    <span className="ml-1 font-medium text-gray-800">{formData.subject}</span>
                  </div>
                )}
                {formData.difficulty && (
                  <div>
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="ml-1 font-medium text-gray-800 capitalize">{formData.difficulty}</span>
                  </div>
                )}
                {formData.mode && (
                  <div>
                    <span className="text-gray-600">Mode:</span>
                    <span className="ml-1 font-medium text-gray-800">{formData.mode}</span>
                  </div>
                )}
                {formData.count && (
                  <div>
                    <span className="text-gray-600">Questions:</span>
                    <span className="ml-1 font-medium text-gray-800">{formData.count}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-10 w-full md:w-auto bg-blue-600 text-white rounded-lg px-8 py-3 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating Questions...
              </span>
            ) : (
              "Start Brain Battle"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}