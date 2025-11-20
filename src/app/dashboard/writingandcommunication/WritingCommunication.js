"use client";
import { useState } from "react";

export default function WritingCommunication({ onSubmit }) {
  const [selectedFormat, setSelectedFormat] = useState("");
  const [topic, setTopic] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass data to parent to show result inside dashboard
    onSubmit(selectedFormat, topic);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-black text-center mb-2">
            Formal Writing Assistant
          </h1>
          <p className="text-lg text-gray-500 text-center">
            Let's craft the perfect document together. Start by telling me what you're working on.
          </p>
        </div>

        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <button
              type="submit"
              className="w-full bg-teal-700 text-white font-semibold py-3.5 px-4 rounded-lg hover:bg-teal-800 transition-colors flex items-center justify-center gap-2.5 shadow-sm mt-2"
            >
              Generate Draft
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
