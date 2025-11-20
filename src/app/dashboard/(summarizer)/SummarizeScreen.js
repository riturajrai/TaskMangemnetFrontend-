"use client";
import { useEffect, useState } from "react";
import { FileText, MessageCircle, Send, ArrowLeft, Sparkles, BookOpen, Lightbulb } from "lucide-react";

export default function SummarizeScreen({ setActive }) {
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    // Get file from sessionStorage
    const storedFile = sessionStorage.getItem("summarizerFile");
    if (storedFile) {
      const file = JSON.parse(storedFile);
      setFileName(file.name);
      fetchSummary(file.name);
    }
  }, []);

  const fetchSummary = (file) => {
    setSummaryLoading(true);
    // Simulate an API call to get the summary
    setTimeout(() => {
      setSummary(
        "This comprehensive document covers key concepts in machine learning and artificial intelligence. The main topics include supervised learning algorithms, neural networks architecture, and practical applications in real-world scenarios. Important highlights include the discussion on model training techniques, data preprocessing strategies, and evaluation metrics for assessing model performance."
      );
      setSummaryLoading(false);
    }, 2000);
  };

  const handleAskQuestion = () => {
    if (!question.trim()) return;

    // Add user question to chat
    const userMessage = { type: "user", text: question };
    setChatHistory((prev) => [...prev, userMessage]);
    
    setQuestion("");
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: "ai",
        text: "Based on the document, " + question.toLowerCase() + " is explained in section 3. The key points include data normalization, feature scaling, and handling missing values to ensure optimal model performance."
      };
      setChatHistory((prev) => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const suggestedQuestions = [
    "What are the main topics covered?",
    "Summarize the key findings",
    "What are the conclusions?"
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F8CEFC] via-[#E5D4FF] to-[#D6E3FF] flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActive("summarize")}
              className="p-2 hover:bg-purple-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-purple-700" />
            </button>
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-600" />
              <div>
                <h1 className="font-bold text-gray-800 text-sm sm:text-base truncate max-w-[200px] sm:max-w-xs">
                  {fileName || "Document Summary"}
                </h1>
                <p className="text-xs text-gray-500">AI-Powered Analysis</p>
              </div>
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="w-full mx-auto">
          {/* Summary Section */}
         
          {/* Chat Section */}
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-purple-200 flex flex-col lg:h-[calc(100vh-200px)]">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Ask Questions
              </h2>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-[200px]">
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-10 h-10 text-purple-500" />
                  </div>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Ask any question about your document and get instant AI-powered answers
                  </p>
                  
                  {/* Suggested Questions */}
                  <div className="space-y-2 w-full">
                    <p className="text-xs text-gray-400 font-medium">Suggested questions:</p>
                    {suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuestion(q)}
                        className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm text-purple-700 border border-purple-200 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.type === "user"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "bg-gradient-to-br from-purple-50 to-pink-50 text-gray-800 border border-purple-200"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl px-4 py-3 border border-purple-200">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-3 border border-purple-200">
              <div className="flex items-end gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
                  placeholder="Ask anything about your document..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={!question.trim() || loading}
                  className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}