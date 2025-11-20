'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import Card from "../../components/Card";

export default function AskAnything() {
  const router = useRouter();

  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;

    router.push(`/dashboard/chat?msg=${encodeURIComponent(input)}`);
  };

  const cards = [
    {
      id: 1, title: "Flashcards",
      image: "https://cdn-icons-png.flaticon.com/512/4904/4904198.png",
      href: "/flashcards",
      color: "from-pink-500 to-pink-700",
    },
    {
      id: 2, title: "AI Chatbot",
      image: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
      href: "/chatbot",
      color: "from-green-500 to-emerald-700",
    },
    {
      id: 3, title: "Practice Tests",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      href: "/tests",
      color: "from-blue-500 to-indigo-700",
    },
    {
      id: 4, title: "Learning Roadmap",
      image: "https://cdn-icons-png.flaticon.com/512/201/201623.png",
      href: "/roadmap",
      color: "from-yellow-500 to-amber-700",
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen px-6 py-20 text-white">

      <h2 className="text-2xl md:text-3xl text-black font-bold mt-10 mb-6">
        Hi Abhay, how can I help you today?
      </h2>

      {/* Ask Me Anything Input */}
      <div className="flex items-center w-full sm:w-3/4 lg:w-1/2 bg-white rounded-full shadow-lg px-4 py-2 gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Ask me anything..."
          className="flex-grow text-black bg-transparent focus:outline-none"
        />

        <button
          onClick={handleSendMessage}
          className="bg-[#1D4645] text-white rounded-full p-2 px-3"
        >
          ➤
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-6 mt-10 w-full max-w-6xl pb-20">
        {cards.map((card, index) => (
          <Card key={card.id} index={index} {...card} />
        ))}
      </div>
    </div>
  );
}
