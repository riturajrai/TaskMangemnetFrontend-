"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ExploreSubject() {
  const router = useRouter();

  const subjects = ["Maths", "English", "Social Science", "Mathematics", "Science"];

  const handleCardClick = (subject) => {
    router.push(`/dashboard?active=subjectChat&subject=${encodeURIComponent(subject)}`);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white px-6 md:px-16">
      {/* Top - Two Images Side by Side */}
      <div className="flex flex-wrap justify-center items-center gap-10 mb-10">
        <div className="relative w-[250px] h-[200px] sm:w-[300px] sm:h-[240px] md:w-[400px] md:h-[320px]">
          <Image
            src="/assets/exploresubject.png"
            alt="Explore Subjects Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="relative w-[250px] h-[200px] sm:w-[300px] sm:h-[240px] md:w-[400px] md:h-[320px]">
          <Image
            src="/assets/explore_subject.png"
            alt="Explore Subjects Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Below Images - Subject Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl">
        {subjects.map((subject, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(subject)}
            className="flex items-center justify-center border-2 border-gray-300 rounded-xl text-gray-800 text-lg font-semibold h-28 sm:h-32 hover:border-blue-600 hover:text-blue-600 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
          >
            {subject}
          </div>
        ))}
      </div>
    </div>
  );
}
