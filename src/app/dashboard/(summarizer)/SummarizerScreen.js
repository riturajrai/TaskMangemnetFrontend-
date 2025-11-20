"use client";
import { useState } from "react";
import { UploadCloud, Trash2, FileText } from "lucide-react";

export default function SummarizerScreen({ setActive = () => {} }) {
  const [files, setFiles] = useState([]);
  
  // Debug: Check if setActive is passed
  // console.log("setActive prop:", typeof setActive);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const fileList = uploadedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      file: file, // Store the actual file object
      status: "uploading",
    }));
    setFiles((prev) => [...prev, ...fileList]);
    
    // Simulate upload delay
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) =>
          fileList.some((uf) => uf.name === f.name)
            ? { ...f, status: "completed" }
            : f
        )
      );
    }, 2000);
  };

  const removeFile = (name) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleGetStarted = () => {
    // Check if there are completed files
    const completedFiles = files.filter(f => f.status === "completed");
    
    if (completedFiles.length === 0) {
      alert("Please upload at least one file before proceeding.");
      return;
    }

    // Navigate to the summarize view screen with the first completed file
    // Store file in sessionStorage or pass via state
    sessionStorage.setItem("summarizerFile", JSON.stringify({
      name: completedFiles[0].name,
      size: completedFiles[0].size
    }));
    
    setActive("summarizeView");
  };

  // Check if button should be disabled
  const hasCompletedFiles = files.some(f => f.status === "completed");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F8CEFC] to-[#D6E3FF] flex flex-col md:flex-row items-center justify-center gap-10 px-4 sm:px-6 py-8 md:p-10">
      {/* Left Section */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-5 w-full md:w-[40%]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
          Summarizer Note
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-sm mx-auto md:mx-0">
          Upload your notes, lectures, or PDFs — and get concise summaries instantly.
        </p>
        <button
          className={`px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:scale-105 transition-transform text-sm sm:text-base ${
            !hasCompletedFiles ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleGetStarted}
          disabled={!hasCompletedFiles}
        >
          Get Started
        </button>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-[60%] bg-white rounded-[30px] sm:rounded-[40px] shadow-xl p-5 sm:p-8 md:p-10 border border-gray-200">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-5 sm:mb-6 text-center md:text-left">
          Upload File
        </h2>
        <div className="bg-[#F8CEFC] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-pink-200">
          <div className="text-center border-2 border-dashed border-pink-300 rounded-2xl p-6 sm:p-8 md:p-10 bg-pink-50">
            <UploadCloud className="w-8 sm:w-10 h-8 sm:h-10 mx-auto text-purple-600 mb-4" />
            <p className="text-gray-700 font-semibold mb-1 text-sm sm:text-base">
              Choose a file or drag & drop it here
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mb-4">
              JPEG, PNG, PDF up to 50MB
            </p>
            <label className="inline-block px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-md cursor-pointer hover:opacity-90 transition text-sm sm:text-base">
              Browse File
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg"
              />
            </label>
          </div>
          <div className="mt-5 sm:mt-6 space-y-3">
            {files.map((file) => (
              <div
                key={file.name}
                className={`flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl transition ${
                  file.status === "completed"
                    ? "bg-green-200"
                    : "bg-green-100 animate-pulse"
                }`}
              >
                <div className="flex items-center gap-3 w-full sm:w-auto mb-2 sm:mb-0">
                  <FileText className="text-green-800 w-5 sm:w-6 h-5 sm:h-6 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm sm:text-base truncate max-w-[200px] sm:max-w-[300px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {Math.round(file.size / 1024)} KB • {file.status}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeFile(file.name)}
                  className="p-2 rounded-full hover:bg-red-200 transition flex-shrink-0"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}