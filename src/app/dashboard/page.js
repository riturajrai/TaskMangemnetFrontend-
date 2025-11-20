
// src/app/dashboard/page.jsx

"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from ".././context/AuthContext";

import Sidebar from "../components/Sidebar";
import DashboardScreen from "../components/DashboardScreen";
import OnboardScreen from "./(onboarding)/OnboardingScreen";
import BrainbattleScreen from "./(brainbattle)/BrainbattleScreen";
import QuizScreen from "./(brainbattle)/QuizScreen";
import ExploreSubject from "./(exploreSubject)/ExploreSubject";
import SubjectChatScreen from "./(exploreSubject)/SubjectChatScreen";
import PodcastScreen from "./(podcast)/PodcastScreen";
import PodcastDetailScreen from "./(podcast)/PodcastDetailScreen";
import SummarizerScreen from "./(summarizer)/SummarizerScreen";
import SummarizeScreen from "./(summarizer)/SummarizeScreen";
import CodingTechnology from "./(codingTechnology)/CodingTechnology";
import TopBar from "../components/TopBar/TopBar";
import PopUp from "../components/PopUp/PopUp";
import WritingCommunication from "./writingandcommunication/WritingCommunication";
import WritingResult from "./writingandcommunication/result/page";
import AskAnything from "./(askAnything)/AskAnything";

function DashboardContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [active, setActive] = useState("dashboard");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [podcastTopic, setPodcastTopic] = useState("");
  const [podcastData, setPodcastData] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const [resultData, setResultData] = useState({ format: "", topic: "" });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/dashboard");
    }
  }, [user, loading, router]);

  // Handle query params
  useEffect(() => {
    const activeParam = searchParams.get("active");
    const subjectParam = searchParams.get("subject");

    if (activeParam) setActive(activeParam);
    if (subjectParam) setSelectedSubject(subjectParam);
  }, [searchParams]);

  const handleSetActive = (value) => {
    setActive(value);
    if (value !== "subjectChat") {
      const url = value === "dashboard" ? "/dashboard" : `/dashboard?active=${value}`;
      router.push(url);
    }
  };

  const renderContent = () => {
    if (!user) return null;

    switch (active) {
      case "dashboard":
        return <DashboardScreen user={user} />;

      case "ask":
        return <AskAnything user={user} />;

      case "onboarding":
        return <OnboardScreen user={user} />;

      case "brain":
        return <BrainbattleScreen setActive={handleSetActive} />;

      case "quiz":
        return <QuizScreen setActive={handleSetActive} />;

      case "explore":
        return <ExploreSubject user={user} />;

      case "subjectChat":
        return (
          <SubjectChatScreen
            subject={selectedSubject}
            user={user}
            setActive={handleSetActive}
          />
        );

      case "podcast":
        return (
          <PodcastScreen
            setActive={handleSetActive}
            setPodcastTopic={setPodcastTopic}
            setPodcastData={setPodcastData}
            user={user}
          />
        );

      case "podcastDetail":
        return (
          <PodcastDetailScreen
            data={podcastData}
            setActive={handleSetActive}
            user={user}
          />
        );

      case "summarize":
        return <SummarizerScreen setActive={handleSetActive} />;

      case "summarizeView":
        return <SummarizeScreen setActive={handleSetActive} />;

      case "codingtech":
        return <CodingTechnology user={user} />;

      case "writingcomm":
        return (
          <WritingCommunication
            onSubmit={(format, topic) => {
              setResultData({ format, topic });
              setActive("writingResult");
              router.push("/dashboard?active=writingResult");
            }}
          />
        );

      case "writingResult":
        return <WritingResult data={resultData} user={user} />;

      default:
        return <div className="text-xl p-8">Coming soon...</div>;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-2xl font-medium text-gray-700">Loading your dashboard...</div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-xl text-gray-600">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FFFFFF] text-black overflow-hidden">
      <Sidebar active={active} setActive={handleSetActive} user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 p-4 bg-[#FFFFFF]">
          <TopBar active={active} user={user} />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#173837] scrollbar-track-transparent">
          {renderContent()}
        </div>
      </div>

      {showPopup && <PopUp onClose={() => setShowPopup(false)} />}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-400">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}