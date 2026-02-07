"use client";

import { TamboProvider } from "@tambo-ai/react";
import { tamboComponents, tamboTools } from "../../lib/tambo";
import Chat from "../../components/Chat";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import GalaxyBackground from "@/components/GalaxyBackground";

function ChatSkeleton() {
  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Chat Header Skeleton */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-64 mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
        </div>
      </div>
      
      {/* Messages Area Skeleton */}
      <div className="flex-1 p-6 space-y-4">
        <div className="animate-pulse">
          {/* AI Message */}
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-200 dark:bg-blue-800 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-2"></div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
          
          {/* User Message */}
          <div className="flex gap-3 justify-end mb-6">
            <div className="flex-1 max-w-xs">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-2 ml-auto"></div>
              <div className="bg-blue-600 rounded-2xl p-4">
                <div className="h-4 bg-blue-500 rounded w-full mb-1"></div>
                <div className="h-4 bg-blue-500 rounded w-2/3"></div>
              </div>
            </div>
            <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex-shrink-0"></div>
          </div>
          
          {/* Component Skeleton */}
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-200 dark:bg-blue-800 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-4"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
                  <div className="h-24 bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
                  <div className="h-24 bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Input Area Skeleton */}
      <div className="p-6 border-t border-slate-200 dark:border-slate-700">
        <div className="animate-pulse">
          <div className="flex gap-3">
            <div className="flex-1 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            <div className="w-12 h-12 bg-blue-200 dark:bg-blue-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!apiKey) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen bg-[#f6f6f8] dark:bg-gray-900 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl max-w-md border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-red-600 mb-4">Missing API Key</h2>
            <p className="text-[#616889] dark:text-gray-300 mb-4">Please add your Tambo API key to the environment variables.</p>
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </motion.div>
        </div>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TamboProvider
        apiKey={apiKey}
        components={tamboComponents}
        tools={tamboTools}
        systemPrompt="You are a helpful CRM assistant. IMPORTANT: When displaying data like contacts, deals, tasks, or analytics, ALWAYS use the appropriate component instead of text. Never list data in text format. Use plain text without markdown formatting (no **bold**, *italic*, etc.) only for brief confirmations or questions. Always prefer visual components over text lists."
      >
        <div className="min-h-screen bg-slate-50 dark:bg-transparent relative">
          <GalaxyBackground />
          <motion.header 
            className="flex items-center justify-between bg-white/80 dark:bg-slate-900/30 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-4 py-3 sticky top-0 z-50 shadow-sm"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button 
              onClick={() => router.push('/')}
              className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">Tambo CRM</h1>
            </div>
            
            <div className="w-16"></div>
          </motion.header>
          
          {isLoading ? (
            <ChatSkeleton />
          ) : (
            <motion.div 
              className="h-[calc(100vh-64px)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Chat />
            </motion.div>
          )}
        </div>
        <Toaster position="top-right" richColors />
      </TamboProvider>
    </ThemeProvider>
  );
}