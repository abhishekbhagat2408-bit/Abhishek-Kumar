import React, { useState } from "react";
import {
  X,
  Sparkles,
  Send,
  User,
  Bot,
  Compass,
  Briefcase,
  HelpCircle,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import { JobOpportunity, UserProfile } from "../types";

interface Message {
  sender: "user" | "sathi";
  text: string;
  time: string;
}

interface AiSathiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  jobs: JobOpportunity[];
  language: "en" | "hi";
}

export const AiSathiAssistantModal: React.FC<AiSathiAssistantModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  jobs,
  language,
}) => {
  if (!isOpen) return null;

  const isHi = language === "hi";

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "sathi",
      text: isHi
        ? `नमस्ते ${userProfile.name}! मैं आपका "अभिज्ञान रोजगार साथी AI" हूँ। मैं आपको नजदीकी नौकरियां खोजने, कॉल पर नियोक्ता से बात करने के तरीके, और आपके कौशल अनुसार सही वेतन वाले काम चुनने में मदद कर सकता हूँ। मुझसे कुछ भी पूछें!`
        : `Hello ${userProfile.name}! I am your "Abhigyan Rojgar Sathi AI". I can guide you on finding nearby jobs, preparing for calls with local employers, fair wages, or matching your skills. How can I help you today?`,
      time: "Just now",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = isHi
    ? [
        "नियोक्ता को कॉल करते समय क्या बोलूं?",
        "मेरे लिए कौन सी नजदीकी नौकरी सबसे अच्छी है?",
        "दैनिक वेतन (Daily wage) और मासिक वेतन में क्या अंतर है?",
        "डिलीवरी राइडर बनने के लिए क्या चाहिए?",
      ]
    : [
        "What should I say when calling an employer?",
        "Which nearby job best fits my skills?",
        "Tips for negotiating fair overtime pay",
        "How to explain my driving & delivery experience?",
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg: Message = {
      sender: "user",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/sathi-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: messageText,
          userProfile,
          language,
          contextJobs: jobs.slice(0, 6),
        }),
      });

      const data = await response.json();
      const reply = data.reply || (isHi ? "मैं आपके सवाल की जांच कर रहा हूँ।" : "I am reviewing your query.");

      const sathiMsg: Message = {
        sender: "sathi",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, sathiMsg]);
    } catch (e) {
      const fallbackMsg: Message = {
        sender: "sathi",
        text: isHi
          ? "नियोक्ता को कॉल करते समय हमेशा अपना नाम, अपना नजदीकी इलाका और आप तुरंत कब से काम शुरू कर सकते हैं—यह स्पष्ट बताएं। Abhigyan Rojgar Sathi के जरिए आप बिना किसी एजेंट या फीस के सीधे बात कर सकते हैं।"
          : "When calling the employer directly, introduce yourself clearly, state that you live nearby in the same locality, and mention your immediate availability. Zero commission or middleman needed!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl overflow-hidden z-10 my-auto h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
                <span>{isHi ? "रोजगार साथी AI" : "Rojgar Sathi AI"}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  Gemini 3.8 Flash
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isHi ? "स्थानीय रोजगार, इंटरव्यू और कॉल तैयारी सलाहकार" : "Local Career & Interview Guidance"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                m.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === "user"
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-800 text-amber-400 border border-slate-700"
                }`}
              >
                {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] sm:max-w-[75%] p-3.5 rounded-2xl ${
                  m.sender === "user"
                    ? "bg-amber-500 text-slate-950 rounded-tr-none font-medium shadow-sm"
                    : "bg-slate-800/90 text-slate-200 rounded-tl-none border border-slate-700/80 shadow-sm leading-relaxed"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 ${
                    m.sender === "user" ? "text-slate-900/70" : "text-slate-400"
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>{isHi ? "साथी उत्तर तैयार कर रहा है..." : "Sathi is thinking..."}</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Chips */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(qp)}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 shrink-0 transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isHi
                  ? "रोजगार साथी से कुछ भी पूछें (उदा. कॉल में क्या बोलूं, सैलरी कैसे तय करें)..."
                  : "Ask Sathi anything about local jobs, interview prep, or wages..."
              }
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold disabled:opacity-50 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
