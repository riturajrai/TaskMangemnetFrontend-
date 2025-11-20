"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Trophy, CheckCircle2, XCircle, Info, RotateCcw, Home } from "lucide-react";

export default function QuizResultsScreen({ setActive }) {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const savedQuestions = sessionStorage.getItem("quizQuestions");
    const savedAnswers = sessionStorage.getItem("quizAnswers");

    try {
      if (!savedQuestions || !savedAnswers) {
        throw new Error("No quiz data found");
      }

      const parsedQuestions = JSON.parse(savedQuestions);
      const parsedAnswers = JSON.parse(savedAnswers);

      setQuestions(parsedQuestions);
      setUserAnswers(parsedAnswers);

      // Calculate score and results
      let correctCount = 0;
      const resultData = parsedQuestions.map((q, index) => {
        // Extract correct answer (format: "Answer: b) Babur")
        const correctAnswerFull = q.answer;
        const correctOption = correctAnswerFull.split(")")[0].replace("Answer:", "").trim() + ")";
        
        const userAnswer = parsedAnswers[index];
        const isCorrect = userAnswer && userAnswer.startsWith(correctOption);

        if (isCorrect) correctCount++;

        return {
          question: q.question.replace(/^Q\d+\.\s*/, ""), // Remove Q1. prefix
          userAnswer: userAnswer || "Not answered",
          correctAnswer: correctAnswerFull,
          explanation: q.explanation || "",
          isCorrect,
          options: q.options,
        };
      });

      setScore(correctCount);
      setResults(resultData);
    } catch (err) {
      console.error("Error loading results:", err);
      alert("Unable to load quiz results");
      setActive("brain");
    }
  }, [setActive]);

  const percentage = questions.length > 0 ? ((score / questions.length) * 100).toFixed(1) : 0;

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return "Excellent! 🎉";
    if (percentage >= 60) return "Good Job! 👍";
    return "Keep Practicing! 💪";
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center space-x-3">
            <div
              onClick={() => setActive("brain")}
              className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 transition"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Quiz Results
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 mt-8">
        {/* Score Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-full">
                <Trophy className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">{getScoreMessage()}</h2>
                <p className="text-blue-100 mt-1">Your Performance Summary</p>
              </div>
            </div>

            <div className="flex gap-6 text-center">
              <div className="bg-white/20 rounded-xl px-6 py-4">
                <p className="text-5xl font-bold">{score}</p>
                <p className="text-sm text-blue-100 mt-1">Correct</p>
              </div>
              <div className="bg-white/20 rounded-xl px-6 py-4">
                <p className="text-5xl font-bold">{questions.length - score}</p>
                <p className="text-sm text-blue-100 mt-1">Wrong</p>
              </div>
              <div className="bg-white/20 rounded-xl px-6 py-4">
                <p className={`text-5xl font-bold`}>{percentage}%</p>
                <p className="text-sm text-blue-100 mt-1">Score</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-white h-3 rounded-full transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => {
              sessionStorage.removeItem("quizQuestions");
              sessionStorage.removeItem("quizAnswers");
              setActive("brain");
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
          <button
            onClick={() => setActive("home")}
            className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-medium shadow-md"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        {/* Detailed Results */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Detailed Analysis</h3>

          {results.map((result, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${
                result.isCorrect ? "border-green-500" : "border-red-500"
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-500">Question {index + 1}</span>
                    {result.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">{result.question}</h4>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2 mb-4">
                {result.options.map((option, optIndex) => {
                  const isUserAnswer = option === result.userAnswer;
                  const isCorrectOption = result.correctAnswer.includes(option.split(")")[0]);

                  return (
                    <div
                      key={optIndex}
                      className={`p-3 rounded-lg border-2 ${
                        isCorrectOption
                          ? "bg-green-50 border-green-500"
                          : isUserAnswer && !result.isCorrect
                          ? "bg-red-50 border-red-500"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm md:text-base text-gray-800">{option}</span>
                        {isCorrectOption && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                        {isUserAnswer && !result.isCorrect && (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Your Answer */}
              <div className="bg-gray-50 rounded-lg p-4 mb-3">
                <p className="text-sm text-gray-600 mb-1">Your Answer:</p>
                <p className={`font-medium ${result.isCorrect ? "text-green-700" : "text-red-700"}`}>
                  {result.userAnswer}
                </p>
              </div>

              {/* Correct Answer */}
              {!result.isCorrect && (
                <div className="bg-green-50 rounded-lg p-4 mb-3">
                  <p className="text-sm text-gray-600 mb-1">Correct Answer:</p>
                  <p className="font-medium text-green-700">
                    {result.correctAnswer.replace("Answer:", "").trim()}
                  </p>
                </div>
              )}

              {/* Explanation */}
              {result.explanation && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
                      <p className="text-sm text-gray-700">
                        {result.explanation.replace("Explanation:", "").trim()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}