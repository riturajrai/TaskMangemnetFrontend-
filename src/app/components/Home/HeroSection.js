"use client";

import Image from "next/image";
import React from "react";
import { CheckSquare } from "lucide-react";
import { motion } from "framer-motion";
import HomeBanner from "./heroSectionImage/homeBanner.png";

const HeroSection = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between w-full px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-24 mx-auto">
      {/* Left Content */}
      <div className="flex-1 space-y-4 sm:space-y-6 mb-8 lg:mb-0 order-2 lg:order-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-zinc-900 dark:text-white leading-tight text-center lg:text-left">
          From Curiosity to{" "}
          <span className="block text-zinc-900 dark:text-white">
            Confidence — Learn the
          </span>{" "}
          <span className="text-emerald-400">MentoroidAI</span>{" "}
          <span className="block">Way.</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto lg:mx-0 text-center lg:text-left leading-relaxed">
          India&apos;s first AI-powered education platform that makes English
          easy, Science simple, and Maths fear-free — personalised for every
          learner.
        </p>

        {/* Buttons */}
        <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 pt-2 justify-center lg:justify-start">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-md transition text-sm sm:text-base w-full sm:w-auto">
            Start Free Trial
          </button>
          <button className="border border-emerald-400 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-zinc-800 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base w-full sm:w-auto">
            For Schools & Institutes
          </button>
        </div>

        {/* Checkbox icon line */}
        <h6 className="text-sm sm:text-sm text-zinc-500 dark:text-zinc-400 pt-4 flex items-center justify-center lg:justify-start gap-2">
          <CheckSquare className="text-emerald-400 w-5 h-5" />
          CBSE, ICSE & All State Boards Aligned
        </h6>
      </div>

      {/* Right Image with Animation */}
      <motion.div
        className="flex-1 flex justify-center mt-6 sm:mt-8 lg:mt-0 order-1 lg:order-2 mb-8 lg:mb-0"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        whileHover={{
          scale: 1.05,
          rotate: 1,
          transition: { duration: 0.4 },
        }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src={HomeBanner}
            alt="AI Student Illustration"
            width={400}
            height={300}
            className="rounded-xl shadow-lg max-w-full h-auto w-auto"
            priority
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
