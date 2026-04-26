'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sparkles, Send, Loader2, Bot, User, BrainCircuit } from 'lucide-react';
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
    { role: 'assistant', content: "Hello! I am your AI Asset Analyst. I have access to your full inventory data. How can I help you today? (e.g., 'Summarize my assets', 'Which items need attention?')" }
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
    
    // Explicitly grab key from localstorage if state is trailing
    const activeKey = apiKey || localStorage.getItem('gemini_api_key');
    
    if (!input.trim() || isLoading || !activeKey) {
      if (!activeKey) {
        setMessages(prev => [...prev, { role: 'assistant', content: "API Key not found. Please log out and log in again." }]);
      }
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const devices = getDevices();
      const devicesJson = JSON.stringify(devices, null, 2);
      
      const genAI = new GoogleGenerativeAI(activeKey);
      
      // We try 'gemini-1.5-flash' but use a flexible approach
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are a professional Asset Lifecycle Analyst for a company called Dulang.
        Your goal is to help the user understand their inventory and provide smart summaries.
        
        CONTEXT DATA (Full Inventory JSON):
        ${devicesJson}
        
        USER QUESTION:
        ${userMessage}
        
        INSTRUCTIONS:
        1. Base your answer ONLY on the provided context data.
        2. Be concise, professional, and helpful.
        3. Use bullet points and bold text for key metrics.
        4. When asked for a report, provide:
           - Executive Summary (overall health)
           - Category Breakdown (table-like list)
           - Critical Items (list serial numbers of Warning/Critical assets)
           - Maintenance Recommendation based on log history.
        5. Use a professional corporate tone.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (err: any) {
      console.error("Gemini AI Error:", err);
      let errorMsg = "Sorry, I encountered an error. ";
      
      if (err.message?.includes('404')) {
        errorMsg += "The model 'gemini-1.5-flash' was not found. Your API key might not have access to this model yet, or it's not available in your region.";
      } else if (err.message?.includes('429')) {
        errorMsg += "Rate limit exceeded. Please wait a moment and try again.";
      } else if (err.message?.includes('API key')) {
        errorMsg += "Invalid API Key. Please check your key in the login page.";
      } else {
        errorMsg += "Please check your internet connection and API Key.";
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="bg-[#f8f9fa] h-[calc(100vh-80px)] p-6">
        <div className="max-w-4xl mx-auto h-full flex flex-col bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-[#2e7d32] text-white">
            <div className="flex items-center gap-3">
              <BrainCircuit className="w-6 h-6" />
              <div>
                <h1 className="font-bold tracking-tight">AI Asset Analyst</h1>
                <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Powered by Gemini 1.5 Flash</p>
              </div>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-white/20 rounded-full">
              Live Data Link Active
            </div>
          </div>

          {/* Chat Box */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-white"
          >
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  msg.role === 'user' ? "bg-gray-100" : "bg-[#e8f5e9]"
                )}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-gray-500" /> : <Bot className="w-5 h-5 text-[#2e7d32]" />}
                </div>
                <div className={cn(
                  "max-w-[80%] p-5 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'user' ? "bg-gray-50 text-gray-800 rounded-tr-none" : "bg-[#e8f5e9]/30 text-gray-800 rounded-tl-none border border-[#e8f5e9]"
                )}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-gray-300 animate-spin" />
                </div>
                <div className="bg-gray-50 h-12 w-48 rounded-2xl rounded-tl-none" />
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-50 bg-gray-50">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask me anything about your inventory..."
                className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-6 pr-16 outline-none focus:border-[#2e7d32] transition-all shadow-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#2e7d32] text-white rounded-xl flex items-center justify-center hover:bg-[#1b5e20] transition-all disabled:bg-gray-300"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
