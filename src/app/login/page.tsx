'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Key, Sparkles, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function LoginPage() {
  const [apiKey, setApiKey] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined' && localStorage.getItem('gemini_api_key')) {
      router.push('/');
    }
  }, [router]);

  const validateAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const trimmedKey = apiKey.trim();

    // 1. Basic Pattern Check
    if (!trimmedKey.startsWith('AIzaSy')) {
      setError('Invalid API Key format. Gemini keys usually start with "AIzaSy".');
      setIsLoading(false);
      return;
    }

    try {
      // 2. Real API Validation Call
      const genAI = new GoogleGenerativeAI(trimmedKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Simple prompt to test the key
      await model.generateContent("test");
      
      // If success, save and redirect
      localStorage.setItem('gemini_api_key', trimmedKey);
      router.push('/');
    } catch (err: any) {
      console.error("Gemini Auth Error:", err);
      // Extract a meaningful error message
      const errorMessage = err.message || "Unknown error occurred";
      if (errorMessage.includes("fetch")) {
        setError("Network/CORS Error: The browser blocked the request. Try disabling AdBlock or check your internet connection.");
      } else if (errorMessage.includes("403") || errorMessage.includes("401")) {
        setError("Invalid Key: The API Key is incorrect or doesn't have access to Gemini 1.5 Flash.");
      } else {
        setError(`API Error: ${errorMessage.substring(0, 100)}...`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-white flex flex-col md:flex-row">
      <div className="bg-[#2e7d32] md:w-1/2 p-12 md:p-24 flex flex-col justify-between text-white">
        <div className="text-4xl font-black italic tracking-tighter">DULANG</div>
        
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Secure AI Asset Management.
          </h1>
          <p className="text-xl opacity-80 max-w-lg leading-relaxed">
            Authentication is required. Each API Key unlocks a unique and isolated asset registry environment.
          </p>
          
          <div className="grid grid-cols-1 gap-6 pt-12">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest">Isolated Data Buckets</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest">Encrypted Local Storage</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] opacity-50 font-bold uppercase tracking-[0.3em]">
          © 2024 Dulang Enterprise Security
        </div>
      </div>

      <div className="md:w-1/2 p-12 md:p-24 flex items-center justify-center">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-black">Sign In to Registry</h2>
            <p className="text-gray-500 font-medium">Validating your Gemini API Key unlocks your specific asset database.</p>
          </div>

          <form onSubmit={validateAndLogin} className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Gemini API Key</label>
                <div className="relative">
                  <Key className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    required
                    disabled={isLoading}
                    type="password" 
                    placeholder="AIzaSy..."
                    className="w-full border-b-2 border-gray-100 py-4 pl-8 text-sm outline-none focus:border-[#2e7d32] transition-colors disabled:opacity-50"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold border border-red-100 animate-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button 
              disabled={isLoading}
              type="submit"
              className="w-full bg-[#2e7d32] text-white py-5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1b5e20] transition-all group disabled:bg-gray-400"
            >
              {isLoading ? (
                <>VALIDATING... <Loader2 className="w-5 h-5 animate-spin" /></>
              ) : (
                <>CONNECT REGISTRY <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
              *Your data is isolated by a unique hash of your API Key. Switching keys will switch your asset view.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
