'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Send, Loader2, Bot, User, BrainCircuit, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getDevices } from '@/lib/storage';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ReportsPage() {
  const { isAuthenticated, apiKey } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I am your AI Asset Analyst. I have access to your full inventory (100+ assets). How can I help you today? You can ask for a 'Summary Report' or 'Maintenance Predictions'." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isAuthenticated) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeKey = apiKey || localStorage.getItem('gemini_api_key');
    
    if (!input.trim() || isLoading || !activeKey) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const devices = getDevices();
      const devicesJson = JSON.stringify(devices.slice(0, 50), null, 2); // Send first 50 for context limit
      
      const genAI = new GoogleGenerativeAI(activeKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are a professional Asset Lifecycle Analyst for Dulang Enterprise.
        CONTEXT: ${devicesJson}
        
        USER: ${userMessage}
        
        INSTRUCTIONS:
        1. Analyze the asset data provided.
        2. Provide professional, data-driven answers.
        3. Use bold text for key metrics.
        4. If a report is requested, provide a structured summary of Health, Locations, and Recommendations.
      `;

      const result = await model.generateContent(prompt);
      setMessages(prev => [...prev, { role: 'assistant', content: result.response.text() }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to AI service. Please check your Gemini API Key." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="bg-[#f8f9fa] h-[calc(100vh-80px)] p-6">
        <div className="max-w-4xl mx-auto h-full flex flex-col bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          
          <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-[#2e7d32] text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">AI Asset Intelligence</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-70 font-bold">Enterprise Analytics Engine</p>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex gap-6", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                  msg.role === 'user' ? "bg-gray-50" : "bg-[#e8f5e9]"
                )}>
                  {msg.role === 'user' ? <User className="w-6 h-6 text-gray-400" /> : <Bot className="w-6 h-6 text-[#2e7d32]" />}
                </div>
                <div className={cn(
                  "max-w-[80%] p-6 rounded-3xl text-sm leading-relaxed shadow-sm",
                  msg.role === 'user' ? "bg-gray-50 text-gray-800 rounded-tr-none" : "bg-[#e8f5e9]/30 text-gray-800 rounded-tl-none border border-[#e8f5e9]/50"
                )}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
                <div className="bg-gray-50 h-16 w-64 rounded-3xl rounded-tl-none" />
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-8 border-t border-gray-50 bg-gray-50">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask your AI Analyst about inventory health or trends..."
                className="w-full bg-white border border-gray-200 rounded-2xl py-5 pl-8 pr-20 outline-none focus:border-[#2e7d32] transition-all shadow-sm font-medium"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-[#2e7d32] text-white rounded-xl flex items-center justify-center hover:bg-[#1b5e20] transition-all shadow-lg shadow-[#2e7d32]/20 disabled:bg-gray-300"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
