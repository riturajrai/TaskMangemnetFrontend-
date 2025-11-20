"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Trash2, Bookmark, Clock } from "lucide-react";

export default function QuizScreen({ setActive }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); // 3 hours in seconds

  useEffect(() => {
    const savedQuestions = sessionStorage.getItem("quizQuestions");
  
    try {
      if (!savedQuestions || savedQuestions === "undefined") {
        throw new Error("No quiz found");
      }
  
      const parsed = JSON.parse(savedQuestions);
      if (!Array.isArray(parsed)) throw new Error("Invalid quiz format");
  
      setQuestions(parsed);
    } catch (err) {
      console.error("Invalid quizQuestions data:", err.message);
      alert("No quiz data found. Returning back.");
      setActive("brain");
    }
  }, [setActive]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelect = (qIndex, option) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleAutoSubmit = () => {
    sessionStorage.setItem("quizAnswers", JSON.stringify(answers));
    alert("Time's up! Quiz submitted automatically.");
    setActive("results");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.keys(answers).length < questions.length) {
      const unanswered = questions.length - Object.keys(answers).length;
      const confirm = window.confirm(
        `You have ${unanswered} unanswered question(s). Do you want to submit anyway?`
      );
      if (!confirm) return;
    }

    console.log("Submitted answers:", answers);

    // Save answers for results page
    sessionStorage.setItem("quizAnswers", JSON.stringify(answers));
    setActive("results");
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all answers?")) {
      setAnswers({});
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div
              onClick={() => {
                if (window.confirm("Are you sure you want to leave? Your progress will be lost.")) {
                  setActive("brain");
                }
              }}
              className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 transition"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Brain Battle Quiz
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                {answeredCount} of {questions.length} answered
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-4">
            <Trash2 
              onClick={handleClearAll}
              className="w-5 h-5 md:w-6 md:h-6 text-gray-600 hover:text-red-600 cursor-pointer transition" 
            />
            <div className="flex items-center bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mr-2" />
              <span className="text-sm md:text-base font-semibold text-blue-600">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div 
            className="bg-blue-600 h-1 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Quiz Content */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 w-full max-w-6xl mx-auto px-4 py-6"
      >
        {/* Grid of questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {questions.map((q, index) => (
            <div
              key={index}
              className={`bg-white border-2 rounded-xl p-5 transition-all hover:shadow-lg ${
                answers[index] 
                  ? "border-blue-500 shadow-md" 
                  : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    answers[index]
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {index + 1}
                  </span>
                  <h3 className="text-sm md:text-base font-semibold text-gray-800">
                    {q.question.replace(/^Q\d+\.\s*/, "")}
                  </h3>
                </div>

                <Bookmark 
                  className={`w-5 h-5 cursor-pointer transition ${
                    answers[index] ? "text-blue-500 fill-blue-500" : "text-gray-400 hover:text-blue-500"
                  }`}
                />
              </div>

              {/* Options */}
              <div className="flex flex-col space-y-2">
                {q.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                      answers[index] === opt
                        ? "bg-blue-50 border-2 border-blue-500"
                        : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={opt}
                      checked={answers[index] === opt}
                      onChange={() => handleSelect(index, opt)}
                      className="accent-blue-600 w-4 h-4"
                    />
                    <span className="text-sm md:text-base text-gray-700 flex-1">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 rounded-t-2xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600">
                Progress: <span className="font-semibold text-gray-800">{answeredCount}/{questions.length} questions</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Make sure to answer all questions before submitting
              </p>
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-blue-600 text-white rounded-lg px-8 py-3 hover:bg-blue-700 transition font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={answeredCount === 0}
            >
              Submit Quiz ({answeredCount}/{questions.length})
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}