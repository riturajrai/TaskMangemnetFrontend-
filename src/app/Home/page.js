
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import HeroSection from "../components/Home/HeroSection";
import FeaturesSection from "../components/Home/FeaturesSection";
import LearningUnderstandsYou from "../components/Home/LearningUnderstandsYou";
import StakeholdersSection from "../components/Home/StakeholdersSection";
import WhyMentoroidWorks from "../components/Home/WhyMentoroidWorks";
import CoreFeatures from "../components/Home/CoreFeatures";
import WhoItsFor from "../components/Home/WhoItsFor";
import HowItWorks from "../components/Home/HowItWorks";
import MentoroidMovement from "../components/Home/MentoroidMovement";
import CommunitySlider from "../components/Home/CommunitySlider";
import JoinAIRevolution from "../components/Home/JoinAIRevolution";
import ContactSection from "../components/Home/ContactSection";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <div className="bg-zinc-50 dark:bg-black font-sans relative">
      {/* Floating Login + Signup Buttons */}
      <div className="absolute top-4 right-6 z-50 flex items-center gap-3">
        <button
          onClick={handleSignup}
          className="px-5 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium shadow-md transition-all"
        >
          Sign Up
        </button>

        <button
          onClick={handleLogin}
          className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all"
        >
          Login
        </button>
      </div>

      <HeroSection />
      <FeaturesSection />
      <LearningUnderstandsYou />
      <StakeholdersSection />
      <WhyMentoroidWorks />
      <CoreFeatures />
      <WhoItsFor />
      <HowItWorks />
      <MentoroidMovement />
      <CommunitySlider />
      <JoinAIRevolution />
      <ContactSection />
    </div>
  );
}
