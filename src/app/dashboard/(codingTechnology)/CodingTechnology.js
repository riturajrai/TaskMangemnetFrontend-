"use client";
import React, { useState } from "react";

export default function FormalWritingAssistant() {
  const [selectedFormat, setSelectedFormat] = useState("");
  const [topic, setTopic] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Format:", selectedFormat);
    console.log("Topic:", topic);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-black text-center mb-2">
            Formal Writing Assistant
          </h1>
          <p className="text-lg text-gray-500 text-center">
            Let's Craft the perfect document together. Start by telling me what you're working on.
          </p>
        </div>

        {/* Card/Form */}
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document Format */}
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-black text-sm tracking-wide">
                Document Format
              </label>
              <input
                type="text"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                placeholder="Select a format (e.g., Letter, Notice)"
                className="w-full border border-gray-300 rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-gray-700 bg-gray-50 transition placeholder-gray-400"
              />
            </div>

            {/* Topic */}
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-black text-sm tracking-wide">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter the topic of your document"
                className="w-full border border-gray-300 rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent text-gray-700 bg-gray-50 transition placeholder-gray-400"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-teal-700 text-white font-semibold py-3.5 px-4 rounded-lg hover:bg-teal-800 transition-colors flex items-center justify-center gap-2.5 shadow-sm mt-2"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L14.09 8.26L20 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L4 9.27L9.91 8.26L12 2Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
              Generate Draft
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}