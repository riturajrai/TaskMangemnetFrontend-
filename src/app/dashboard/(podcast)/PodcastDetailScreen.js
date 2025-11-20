"use client";
import { useRef, useState, useEffect } from "react";
import { ArrowLeft, Play, Pause, Volume2 } from "lucide-react";
import axios from "axios";

export default function PodcastDetailScreen({ data, setActive }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [scriptContent, setScriptContent] = useState(null); // null = not loaded yet
  const [scriptLoading, setScriptLoading] = useState(true);  

  // Format seconds to mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Toggle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Update progress & duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const setAudioDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, []);

  
  useEffect(() => {
    const fetchScript = async () => {
      if (!data?.scriptUrl) {
        setScriptLoading(false);
        setScriptContent("No script URL available.");
        return;
      }
  
      setScriptLoading(true);
      
      // Extract session_id from scriptUrl (e.g., "/podcast/script/abc-123")
      const sessionId = data.scriptUrl.split('/').pop();
      const apiUrl = `/api/podcast/script/${sessionId}`;
      

      
      try {
        const res = await axios.get(apiUrl);

  
        // Check if response is empty
        if (!res.data) {
          setScriptContent("Script is empty.");
          setScriptLoading(false);
          return;
        }
  
        // If response is an object with a script property
        if (typeof res.data === 'object' && res.data.script) {
          setScriptContent(res.data.script);
        } 
        // If response is plain text
        else if (typeof res.data === 'string') {
          setScriptContent(res.data);
        }
        // If response is an object, stringify it
        else if (typeof res.data === 'object') {
          setScriptContent(JSON.stringify(res.data, null, 2));
        }
        else {
          setScriptContent(String(res.data));
        }
        
        setScriptLoading(false);
      } catch (err) {
        console.error("Failed to fetch script:", err);
        console.error("Error response:", err.response?.data);
        setScriptContent(`Failed to load script: ${err.message}`);
        setScriptLoading(false);
      }
    };
  
    fetchScript();
  }, [data]);
  

  if (!data) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 sm:p-6 bg-white shadow-sm sticky top-0 z-10">
        <button
          onClick={() => setActive("podcast")}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          Podcast
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-gray-700 py-8">
        <div className="min-h-[85vh] w-full max-w-4xl bg-white rounded-3xl shadow-lg p-6 sm:p-10 text-center">
          {/* Podcast Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4">
            🎙️ Podcast Topic: {data.topic}
          </h2>

          {/* Metadata */}
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            Subject: {data.subject} | Student: {data.studentName}
          </p>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Format: {data.format} ({data.quality})
          </p>

          {/* Audio Player */}
          <div className="max-w-3xl mx-auto mb-10 p-6 bg-gray-100 rounded-2xl shadow-inner">
            <audio
              ref={audioRef}
              src={`https://mentoroid-production.up.railway.app/${data.audioUrl}`}
              preload="metadata"
            />

            <div className="flex items-center justify-between mb-3">
              <button
                onClick={togglePlay}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
              </button>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Volume2 className="w-4 h-4" />
                <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div
              className="relative w-full h-2 bg-gray-300 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                const audio = audioRef.current;
                if (!audio) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newTime = (clickX / rect.width) * audio.duration;
                audio.currentTime = newTime;
              }}
            >
              <div
                className="absolute top-0 left-0 h-2 bg-blue-600 transition-all duration-150"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Podcast Script / Notes */}
          <div className="h-[50vh] overflow-y-auto text-left bg-gray-50 p-6 rounded-2xl border border-gray-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent whitespace-pre-wrap">
  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
    📝 Podcast Script / Notes
  </h3>
  {scriptLoading ? "Loading script..." : scriptContent}
</div>

        </div>
      </div>
    </div>
  );
}
