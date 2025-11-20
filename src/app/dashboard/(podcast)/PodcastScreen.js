"use client";

import { useState, useEffect } from "react";
import { Send, Mic, Search, AlertCircle, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import axios from "axios";

export default function PodcastScreen({ setActive, setPodcastTopic, setPodcastData, user }) {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [subject, setSubject] = useState("General");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [progress, setProgress] = useState(0);

  const languages = ["English", "Hindi", "Spanish", "French", "German", "Mandarin"];
  const subjects = ["General", "Science", "Mathematics", "History", "Geography", "Literature", "Technology"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");
    setStatus("Initializing podcast generation...");
    setProgress(0);

    try {
      console.log("Sending request with:", {
        topic: topic.trim(),
        subject,
        language,
        grade_level: "Grade 9",
        student_gender: "male",
        student_name: user?.name || "Student",
      });

      const res = await axios.post("/api/podcast/generate", {
        topic: topic.trim(),
        subject: subject,
        language: language,
        grade_level: "Grade 9",
        student_gender: "male",
        student_name: user?.name || "Student",
      });

      const data = res.data;
      console.log("Response received:", data);

      if (data?.session_id) {
        setSessionId(data.session_id);
        setPodcastTopic(topic.trim());
        setStatus("Podcast generation started...");
        setProgress(10);
      } else {
        setError("Failed to start podcast generation. No session ID received.");
        setLoading(false);
        setProgress(0);
      }
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response:", err?.response);
      
      let errorMsg = "Error starting podcast.";
      
      if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err?.message) {
        errorMsg = err.message;
      }
      
      setError(`Script generation failed: ${errorMsg}`);
      setLoading(false);
      setProgress(0);
    }
  };

  // Polling for podcast status
  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/api/podcast/status/${sessionId}`);
        const data = res.data;

        console.log("Status update:", data);

        if (data?.status) {
          setStatus(data.message || "Generating...");

          // Update progress based on status
          if (data.status === "processing") {
            setProgress((prev) => Math.min(prev + 5, 70));
          } else if (data.status === "generating_audio") {
            setProgress(80);
          } else if (data.status === "finalizing") {
            setProgress(90);
          }

          if (data.status === "completed") {
            clearInterval(interval);
            setProgress(100);
            setStatus("Podcast generation completed! 🎉");
            
            setTimeout(() => {
              setLoading(false);

              const podcastPayload = {
                audioUrl: data.audio_url,
                scriptUrl: data.script_url,
                topic: data.topic,
                subject: data.subject,
                studentName: data.student_name,
                format: data.format,
                quality: data.quality,
              };

              setPodcastData(podcastPayload);
              setActive("podcastDetail");
            }, 1000);
          } else if (data.status === "failed" || data.status === "error") {
            clearInterval(interval);
            setError(`Podcast generation failed: ${data.message || "Unknown error"}`);
            setLoading(false);
            setProgress(0);
          }
        }
      } catch (err) {
        console.error("Status fetch error:", err);
        setError(`Failed to fetch podcast status: ${err?.response?.data?.message || err.message}`);
        clearInterval(interval);
        setLoading(false);
        setProgress(0);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [sessionId, setActive, setPodcastData]);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-gray-600">
        <div className="w-full max-w-4xl p-2 sm:p-8 md:p-2 border border-gray-200 rounded-3xl bg-white shadow-lg flex flex-col items-center">
          <div className="flex flex-col items-center gap-6 sm:gap-8 w-full">
            
            {/* Show loader overlay when generating */}
            {loading ? (
              <div className="w-full max-w-xl flex flex-col items-center justify-center py-12 px-4">
                {/* Animated Podcast Icon */}
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full animate-ping opacity-20"></div>
                </div>

                {/* Status Text */}
                <div className="flex items-center gap-3 mb-6">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Generating Your Podcast
                  </h3>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                  </div>
                </div>

                {/* Progress Percentage */}
                <p className="text-sm font-medium text-gray-600 mb-4">
                  {progress}% Complete
                </p>

                {/* Status Message */}
                <div className="text-center space-y-2">
                  <p className="text-base text-gray-700 font-medium">
                    {status}
                  </p>
                  <p className="text-sm text-gray-500">
                    This may take a few moments...
                  </p>
                </div>

                {/* Loading Animation Dots */}
                <div className="flex gap-2 mt-6">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>

                {/* Topic Info */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">Topic:</span> {topic}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold text-gray-800">Subject:</span> {subject}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold text-gray-800">Language:</span> {language}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Image
                  src="/assets/createpodcast.png"
                  alt="Create Podcast"
                  width={470}
                  height={300}
                  className="mx-auto w-[85%] sm:w-[70%] md:w-[470px] h-auto"
                  priority
                />

                {/* Language and Subject Tabs */}
                <div className="w-full max-w-xl space-y-4">
                  {/* Language Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setLanguage(lang)}
                          disabled={loading}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            language === lang
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subj) => (
                        <button
                          key={subj}
                          type="button"
                          onClick={() => setSubject(subj)}
                          disabled={loading}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            subject === subj
                              ? "bg-indigo-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {subj}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Topic Input */}
                <form onSubmit={handleSubmit} className="relative w-full max-w-xl px-1">
                  <div className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-300 rounded-full shadow-md px-3 sm:px-4 py-2 sm:py-3 transition-all hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-400">
                    <Search className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Enter your podcast topic..."
                      className="flex-grow bg-transparent text-gray-700 placeholder-gray-500 text-sm sm:text-base focus:outline-none"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 sm:p-2 rounded-full transition-all flex items-center justify-center disabled:opacity-50"
                      disabled={loading}
                    >
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="absolute right-14 sm:right-16 top-1/2 -translate-y-1/2 bg-white border border-gray-200 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
                    aria-label="Voice Input"
                    disabled={loading}
                  >
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                </form>

                <div className="text-center text-sm sm:text-base text-gray-500 mt-4 px-2">
                  💡 Try asking: <span className="italic">"Create a podcast about climate change."</span>
                </div>
              </>
            )}

            {/* Error Message */}
            {error && !loading && (
              <div className="flex items-start gap-2 text-red-500 text-sm mt-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg max-w-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="font-semibold">Error:</p>
                  <p>{error}</p>
                  <p className="text-xs mt-1 text-red-400">Check console for more details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}