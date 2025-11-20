"use client";
import { useSearchParams } from "next/navigation";

export default function WritingResult({ data }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFFFF] px-6 py-12">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-8">
        {/* Header Section */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Suggest Connectors</h2>
          <p className="text-gray-600 text-base">
            Let's craft the perfect document together. Start by telling me what you're working on.
          </p>
        </div>

        {/* Form Section */}
        <form className="flex flex-col gap-4 shadown-xl">
          <textarea
            placeholder="Type or paste your text here..."
            className="w-full h-80 border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-gray-700"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
          >
            Suggest Connectors
          </button>
        </form>
      </div>
    </div>
  );
}
