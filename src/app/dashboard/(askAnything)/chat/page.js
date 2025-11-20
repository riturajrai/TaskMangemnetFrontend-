"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Bot, User } from "lucide-react";


// Component to render formatted markdown-like text
function FormattedMessage({ text }) {
  const formatInlineMarkdown = (text) => {
    const parts = [];
    let current = "";
    let i = 0;

    while (i < text.length) {
      if (text.substr(i, 2) === "**") {
        if (current) parts.push(current);
        current = "";
        i += 2;
        let boldText = "";
        while (i < text.length && text.substr(i, 2) !== "**") {
          boldText += text[i];
          i++;
        }
        parts.push(<strong key={i} className="font-semibold">{boldText}</strong>);
        i += 2;
      } else if (text[i] === "`") {
        if (current) parts.push(current);
        current = "";
        i++;
        let codeText = "";
        while (i < text.length && text[i] !== "`") {
          codeText += text[i];
          i++;
        }
        parts.push(
          <code key={i} className="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono">
            {codeText}
          </code>
        );
        i++;
      } else {
        current += text[i];
        i++;
      }
    }

    if (current) parts.push(current);
    return parts.length > 0 ? parts : text;
  };

  const formatMarkdown = (content) => {
    const lines = content.split("\n");
    const elements = [];
    let key = 0;

    for (let line of lines) {
      if (!line.trim()) {
        elements.push(<br key={key++} />);
        continue;
      }

      if (line.startsWith("###")) elements.push(<h3 key={key++} className="text-lg font-semibold mt-4 mb-2 text-slate-800">{line.replace(/^###\s*/, "")}</h3>);
      else if (line.startsWith("##")) elements.push(<h2 key={key++} className="text-xl font-bold mt-5 mb-3 text-slate-900">{line.replace(/^##\s*/, "")}</h2>);
      else if (line.startsWith("#")) elements.push(<h1 key={key++} className="text-2xl font-bold mt-6 mb-4 text-slate-900">{line.replace(/^#\s*/, "")}</h1>);
      else if (/^\d+\./.test(line.trim())) elements.push(<li key={key++} className="ml-4 mb-1 list-decimal">{formatInlineMarkdown(line.replace(/^\d+\.\s*/, ""))}</li>);
      else if (line.trim().startsWith("-")) elements.push(<li key={key++} className="ml-4 mb-1">{formatInlineMarkdown(line.replace(/^- /, ""))}</li>);
      else elements.push(<p key={key++} className="mb-2">{formatInlineMarkdown(line)}</p>);
    }

    return elements;
  };

  return <div className="formatted-content">{formatMarkdown(text)}</div>;
}

function ChatComponent() {
  const searchParams = useSearchParams();
  const initialMsg = searchParams.get("msg") || "";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streamText, setStreamText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (initialMsg) {
      setInput(initialMsg);
      sendMessage(initialMsg);
    }
  }, [initialMsg]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  const formatText = (text) => {
    return text.replace(/([a-z])([A-Z])/g, "$1 $2")
               .replace(/\.([A-Z])/g, ". $1")
               .replace(/,([A-Z])/g, ", $1")
               .replace(/##([A-Za-z])/g, "## $1")
               .replace(/###([A-Za-z])/g, "### $1")
               .replace(/:([A-Z])/g, ": $1")
               .replace(/(\d+)\.([A-Z])/g, "$1. $2")
               .replace(/(#{1,3})\s/g, "\n\n$1 ")
               .replace(/(#{1,3}[^\n]+)/g, "$1\n");
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isStreaming) return;

    setMessages(prev => [...prev, { role: "user", text }]);
    setInput("");
    setStreamText("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/stream", {
        method: "POST",
        body: JSON.stringify({ message: text, user_id: "user_12345", subject: "General", topic: "", websearch: false }),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response reader found");

      const decoder = new TextDecoder();
      let aiResponse = "";
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          let cleanText = line.replace(/^data:\s*/i, "").replace(/<\|NEWLINE\|>/g, "\n").trim();
          if (cleanText) {
            cleanText = formatText(cleanText);
            aiResponse += cleanText;
            setStreamText(prev => prev + cleanText);
          }
        }
      }

      if (buffer.trim()) {
        let cleanText = buffer.replace(/^data:\s*/i, "").replace(/<\|NEWLINE\|>/g, "\n").trim();
        if (cleanText) {
          cleanText = formatText(cleanText);
          aiResponse += cleanText;
          setStreamText(prev => prev + cleanText);
        }
      }

      setMessages(prev => [...prev, { role: "assistant", text: aiResponse }]);
      setStreamText("");
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Mentoroid AI</h1>
            <p className="text-xs text-slate-500">Your intelligent assistant</p>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-grow overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && !streamText && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Bot className="w-9 h-9 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">Welcome to Mentoroid AI</h2>
              <p className="text-slate-600 max-w-md mx-auto">Ask me anything and I'll help you with detailed, thoughtful responses.</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"><Bot className="w-5 h-5 text-white" /></div>}
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${m.role === "user" ? "bg-gradient-to-br from-teal-600 to-teal-700 text-white" : "bg-white text-slate-800 border border-slate-200"}`}>
                <div className="whitespace-pre-wrap break-words leading-relaxed prose prose-sm max-w-none">{m.role === "assistant" ? <FormattedMessage text={m.text} /> : m.text}</div>
              </div>
              {m.role === "user" && <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"><User className="w-5 h-5 text-white" /></div>}
            </div>
          ))}

          {streamText && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-white text-slate-800 border border-slate-200 shadow-sm">
                <div className="whitespace-pre-wrap break-words leading-relaxed prose prose-sm max-w-none">
                  <FormattedMessage text={streamText} />
                  <span className="inline-block w-1 h-4 bg-teal-600 ml-1 animate-pulse" />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-200 px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3 bg-slate-50 rounded-2xl border border-slate-200 p-2 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isStreaming}
              className="flex-grow bg-transparent outline-none px-3 py-2 resize-none max-h-32 text-slate-800 placeholder-slate-400 disabled:opacity-50"
              placeholder="Type your message here..."
              rows={1}
              style={{ minHeight: 40, maxHeight: 128, overflowY: "auto" }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isStreaming}
              className="bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-xl p-3 hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}

export default function ChatPageWrapper() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading chat...</div>}>
      <ChatComponent />
    </Suspense>
  );
}
