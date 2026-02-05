"use client";

import { useState, useEffect } from "react";
import { TamboProvider } from "@tambo-ai/react";
import { tamboComponents, tamboTools } from "../lib/tambo";
import Chat from "../components/Chat";
import { Users, MessageSquare, BarChart3, CheckSquare, Sparkles, ArrowRight, Github, ExternalLink, Zap, Bot, TrendingUp, Target, Calendar, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import "./globals.css";

function Navbar({ onLogoClick }: { onLogoClick?: () => void }) {
  return (
    <motion.header 
      className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 bg-white px-10 py-4 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <button 
        onClick={onLogoClick || (() => window.location.href = '/')}
        className="flex items-center gap-4 text-[#2b4bee] hover:opacity-80 transition-opacity duration-200"
      >
        <div className="size-6">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor" />
          </svg>
        </div>
        <h2 className="text-black text-xl font-extrabold leading-tight tracking-tight">Tambo CRM</h2>
      </button>
      <div className="flex flex-1 justify-end gap-8 items-center">
        <nav className="hidden md:flex items-center gap-9">
          <a className="text-gray-600 text-sm font-medium hover:text-[#2b4bee] transition-colors" href="#features">Features</a>
          <a className="text-gray-600 text-sm font-medium hover:text-[#2b4bee] transition-colors" href="#how-it-works">How it Works</a>
        </nav>
        <div className="flex gap-3">
          {/* TODO: Dark mode toggle - work on this later */}
          {/* <button 
            onClick={toggleDarkMode}
            className="flex min-w-[44px] cursor-pointer items-center justify-center rounded-lg h-10 px-3 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Moon className="h-4 w-4" />
          </button> */}
          <a
            href="https://github.com/Farhantigadi/tambo-db.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-gray-100 text-black hover:bg-gray-200 text-sm font-bold transition-colors"
          >
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </a>
        </div>
      </div>
    </motion.header>
  );
}

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  // TODO: Dark mode functionality - work on this later
  // const [darkMode, setDarkMode] = useState(false);
  const darkMode = false; // Default to light mode

  // TODO: Dark mode useEffect and toggle function - work on this later
  // useEffect(() => {
  //   const saved = localStorage.getItem('darkMode');
  //   if (saved) {
  //     setDarkMode(JSON.parse(saved));
  //   }
  // }, []);

  // const toggleDarkMode = () => {
  //   const newMode = !darkMode;
  //   setDarkMode(newMode);
  //   localStorage.setItem('darkMode', JSON.stringify(newMode));
  // };

  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center">
        <motion.div 
          className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl max-w-md border border-gray-200"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-red-600 mb-4">Missing API Key</h2>
          <p className="text-[#616889] mb-4">Please add your Tambo API key to the environment variables.</p>
          <p className="text-sm text-[#616889]">
            Create a <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file with:
            <br />
            <code className="bg-gray-100 px-2 py-1 rounded mt-2 block">
              NEXT_PUBLIC_TAMBO_API_KEY=your_api_key_here
            </code>
          </p>
        </motion.div>
      </div>
    );
  }

  if (showChat) {
    return (
      <TamboProvider
        apiKey={apiKey}
        components={tamboComponents}
        tools={tamboTools}
      >
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
          <Navbar onLogoClick={() => setShowChat(false)} />
          <div className="h-[calc(100vh-80px)]">
            <Chat />
          </div>
        </div>
      </TamboProvider>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f6f6f8] text-[#111218] font-display">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        
        <main className="flex flex-col items-center">
          {/* Hero Section with Background Grid & Glow */}
          <section className="relative overflow-hidden pt-20 pb-12 lg:pt-32 lg:pb-24">
            <div 
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #ffffff10 1px, transparent 1px)',
                backgroundSize: '32px 32px'
              }}
            />
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(43, 75, 238, 0.15) 0%, transparent 70%)'
              }}
            />
            <div className="max-w-7xl mx-auto px-6 text-center">
              <div className="mb-10 max-w-4xl mx-auto space-y-6">
                <motion.h1 
                  className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight text-[#111218]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  The Future of CRM is <span className="text-[#2b4bee]">Conversational</span>
                </motion.h1>
                <motion.p 
                  className="text-lg md:text-xl text-[#616889] max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Experience the world's first AI-powered CRM with a natural language interface. 
                  Manage your entire pipeline by simply talking to it.
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-4 justify-center pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <button 
                    onClick={() => setShowChat(true)}
                    className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-[#2b4bee] text-white text-base font-bold shadow-lg shadow-[#2b4bee]/25 hover:scale-105 transition-transform"
                  >
                    <span className="truncate">Start Chatting</span>
                  </button>
                  <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-white text-[#111218] text-base font-bold border border-[#dbdde6] hover:bg-gray-50 transition-colors">
                    <span className="truncate">Watch Demo</span>
                  </button>
                </motion.div>
              </div>

              {/* Chat Interface Preview (Generative UI Example) */}
              <motion.div 
                className="max-w-4xl mx-auto mt-16 relative"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden p-6 md:p-10 text-left">
                  {/* User Message */}
                  <div className="flex items-end gap-3 mb-8 justify-end">
                    <div className="flex flex-1 flex-col gap-1 items-end">
                      <p className="text-[#616889] text-[13px] font-medium leading-normal">You</p>
                      <div className="text-base font-medium leading-normal flex max-w-[360px] rounded-2xl rounded-tr-none px-5 py-3 bg-[#2b4bee] text-white shadow-md">
                        Add Sarah from Tesla
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-10 h-10 shrink-0 ring-2 ring-[#2b4bee]/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* AI Response (Generative UI Card) */}
                  <div className="flex items-start gap-3 justify-start">
                    <div className="bg-[#2b4bee] aspect-square rounded-full w-10 h-10 shrink-0 flex items-center justify-center text-white ring-2 ring-[#2b4bee]/20">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="flex flex-1 flex-col gap-3">
                      <p className="text-[#616889] text-[13px] font-medium leading-normal">Tambo AI</p>
                      <div className="text-base font-normal leading-normal max-w-[480px] rounded-2xl rounded-tl-none px-5 py-3 bg-gray-100 text-[#111218] border border-gray-200">
                        Let's add Sarah from Tesla to your contacts.
                      </div>
                      
                      {/* Generative UI Component */}
                      <div className="max-w-[480px] w-full mt-2">
                        <div className="rounded-xl bg-white p-4 shadow-xl border border-gray-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-[#2b4bee] rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">SJ</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-900">Sarah Jones</h4>
                              <p className="text-xs text-gray-500">Tesla</p>
                            </div>
                          </div>
                          <div className="text-xs text-green-600 font-medium">✓ Contact added successfully</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating decoration */}
                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden lg:block">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-[#616889]">Sync Status</p>
                      <p className="text-sm font-bold">100% Up to date</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                className="flex flex-1 flex-col gap-3 rounded-2xl p-8 border border-[#dbdde6] bg-white/50 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <p className="text-[#616889] text-base font-semibold">Natural Language</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-[#111218] tracking-tight text-4xl font-black">Talk</p>
                  <span className="text-[#2b4bee] font-bold text-sm">don't click</span>
                </div>
              </motion.div>
              <motion.div 
                className="flex flex-1 flex-col gap-3 rounded-2xl p-8 border border-[#dbdde6] bg-white/50 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <p className="text-[#616889] text-base font-semibold">Open Source</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-[#111218] tracking-tight text-4xl font-black">Free</p>
                  <span className="text-green-500 font-bold text-sm">MIT License</span>
                </div>
              </motion.div>
              <motion.div 
                className="flex flex-1 flex-col gap-3 rounded-2xl p-8 border border-[#dbdde6] bg-white/50 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <p className="text-[#616889] text-base font-semibold">Tech Stack</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-[#111218] tracking-tight text-4xl font-black">Modern</p>
                  <span className="text-purple-500 font-bold text-sm">Next.js + AI</span>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Features Section - Bento Grid */}
          <div id="features" className="w-full max-w-[1200px] px-6 py-16">
            <div className="flex flex-col gap-12">
              <motion.div 
                className="flex flex-col gap-4 text-left max-w-[720px]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <h2 className="text-black text-3xl font-bold leading-tight">Built for the way you actually work</h2>
                <p className="text-gray-600 text-base font-normal leading-normal">
                  Experience the power of natural language and generative UI for effortless customer management.
                </p>
              </motion.div>
              
              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Large Feature Card */}
                <motion.div 
                  className="md:col-span-8 bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200 p-10 min-h-[400px] flex flex-col justify-between shadow-xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <div className="max-w-md">
                    <div className="w-12 h-12 bg-[#2b4bee]/10 rounded-xl flex items-center justify-center mb-6">
                      <MessageSquare className="w-6 h-6 text-[#2b4bee]" />
                    </div>
                    <h3 className="text-black text-2xl font-bold mb-4">Natural Language Engine</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">Stop clicking, start describing. Query your entire database with simple, conversational English. Our engine understands context, relationships, and intent.</p>
                  </div>
                  <div className="mt-8 bg-gray-900 border border-gray-200 rounded-lg p-4 font-mono text-xs text-[#2b4bee]">
                    &gt; "Find high-value leads in tech sector with no contact in 7 days"
                  </div>
                </motion.div>

                {/* Small Feature Card */}
                <motion.div 
                  className="md:col-span-4 bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200 p-8 flex flex-col justify-between shadow-xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                      <Sparkles className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-black text-xl font-bold mb-3">Instant Actions</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">AI-suggested workflows that trigger based on lead behavior.</p>
                  </div>
                  <div className="space-y-2 mt-6">
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2b4bee] w-3/4 transition-all duration-1000"></div>
                    </div>
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2b4bee] w-1/2 transition-all duration-1000"></div>
                    </div>
                  </div>
                </motion.div>

                {/* Medium Feature Card */}
                <motion.div 
                  className="md:col-span-4 bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200 p-8 flex flex-col justify-between shadow-xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-black text-xl font-bold mb-3">Unified Data</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">All your customer data in one clean, accessible interface.</p>
                  </div>
                </motion.div>

                {/* Large Feature Card 2 */}
                <motion.div 
                  className="md:col-span-8 bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200 p-10 flex flex-col md:flex-row gap-10 items-center overflow-hidden shadow-xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                >
                  <div className="flex-1">
                    <h3 className="text-black text-2xl font-bold mb-3">Real-time Intelligence</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">Monitor customer signals and get notified about the perfect moment to reach out.</p>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 w-full flex justify-end">
                    <div className="w-64 h-48 bg-gray-50 border border-gray-200 rounded-xl rotate-6 translate-x-10 translate-y-10 shadow-2xl p-4">
                      <div className="space-y-3">
                        <div className="w-full h-2 bg-gray-200 rounded"></div>
                        <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
                        <div className="w-full h-12 bg-[#2b4bee]/10 border border-[#2b4bee]/20 rounded"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Showcase: Table to Chart */}
          <div id="how-it-works" className="w-full bg-white py-20 border-y border-gray-200">
            <div className="max-w-[1200px] mx-auto px-6">
              <motion.div 
                className="text-center mb-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                <h2 className="text-black text-3xl font-bold tracking-tight">Generative UI in Action</h2>
                <p className="text-gray-500 text-base max-w-2xl mx-auto mt-4">
                  Watch your data transform instantly. From raw lists to insightful visualizations based on your text prompts.
                </p>
              </motion.div>
              <div className="flex flex-col lg:flex-row gap-10 items-start">
                <motion.div 
                  className="w-full lg:w-1/2 space-y-6"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.8 }}
                >
                  <div className="p-4 bg-gray-50 rounded-xl border border-[#2b4bee]/30 flex items-center gap-4">
                    <Bot className="text-[#2b4bee] w-5 h-5" />
                    <p className="text-sm font-medium text-gray-700 italic">"Show me the top 3 deals by value and their status."</p>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="px-6 py-4 text-sm font-semibold">Acme Corp</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 text-[10px] font-bold uppercase bg-blue-100 text-blue-700 rounded-full">In Progress</span></td>
                          <td className="px-6 py-4 text-sm text-right font-mono">$50,000</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm font-semibold">Globex</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 text-[10px] font-bold uppercase bg-green-100 text-green-700 rounded-full">Closed Won</span></td>
                          <td className="px-6 py-4 text-sm text-right font-mono">$120,000</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm font-semibold">Soylent Corp</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 text-[10px] font-bold uppercase bg-orange-100 text-orange-700 rounded-full">Proposal</span></td>
                          <td className="px-6 py-4 text-sm text-right font-mono">$25,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
                <motion.div 
                  className="w-full lg:w-1/2 space-y-6"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 2.0 }}
                >
                  <div className="p-4 bg-gray-50 rounded-xl border border-[#2b4bee]/30 flex items-center gap-4">
                    <TrendingUp className="text-[#2b4bee] w-5 h-5" />
                    <p className="text-sm font-medium text-gray-700 italic">"Convert this to a sales velocity chart."</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 aspect-video flex flex-col justify-end">
                    <div className="flex items-end gap-6 h-full">
                      <div className="flex-1 flex flex-col items-center gap-3">
                        <div className="w-full bg-[#2b4bee]/20 rounded-t-lg relative" style={{height: '40%'}}>
                          <div className="absolute inset-x-0 bottom-0 bg-[#2b4bee] h-2/3 rounded-t-lg"></div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Q1</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-3">
                        <div className="w-full bg-[#2b4bee]/20 rounded-t-lg relative" style={{height: '70%'}}>
                          <div className="absolute inset-x-0 bottom-0 bg-[#2b4bee] h-4/5 rounded-t-lg"></div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Q2</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-3">
                        <div className="w-full bg-[#2b4bee]/20 rounded-t-lg relative" style={{height: '90%'}}>
                          <div className="absolute inset-x-0 bottom-0 bg-[#2b4bee] h-full rounded-t-lg"></div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Q3</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-3">
                        <div className="w-full bg-gray-100 rounded-t-lg" style={{height: '30%'}}></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Q4</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Business Benefits */}
          <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
            <div className="max-w-[1200px] mx-auto px-6">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 3.0 }}
              >
                <h2 className="text-black text-4xl font-bold mb-6">Transform Your Business</h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  Stop losing deals in spreadsheets. Start closing more with AI that actually understands your business.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 3.2 }}
                >
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Faster Sales Cycles</h3>
                  <p className="text-gray-600 text-sm">Instant access to contact history and next steps. No more digging through emails.</p>
                </motion.div>

                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 3.4 }}
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Target className="w-8 h-8 text-[#2b4bee]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Never Miss Follow-ups</h3>
                  <p className="text-gray-600 text-sm">AI automatically creates reminders and tracks your pipeline without manual entry.</p>
                </motion.div>

                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 3.6 }}
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Team Alignment</h3>
                  <p className="text-gray-600 text-sm">Everyone sees the same data. No more "I thought you were handling that" moments.</p>
                </motion.div>

                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 3.8 }}
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Focus on Relationships</h3>
                  <p className="text-gray-600 text-sm">Spend time building connections, not updating databases. Let AI handle the admin work.</p>
                </motion.div>
              </div>

              <motion.div 
                className="text-center mt-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 4.0 }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="text-4xl font-black text-[#2b4bee]">Demo</div>
                    <div className="text-left">
                      <div className="text-sm text-gray-500">hackathon project</div>
                      <div className="text-lg font-bold">built with Tambo AI</div>
                    </div>
                  </div>
                  <p className="text-gray-600">This is a proof-of-concept showcasing Generative UI capabilities for "The UI Strikes Back" hackathon.</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* How It Works - Developer Guide */}
          <div className="w-full max-w-[1200px] px-6 py-20">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.4 }}
            >
              <h2 className="text-black text-4xl font-bold mb-6">How It Works</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Built with 3 core tables and extensible architecture. Clone, customize, and scale to your needs.
              </p>
            </motion.div>

            {/* Current System */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.6 }}
            >
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-[#2b4bee]" />
                </div>
                <h3 className="text-xl font-bold mb-4">Contacts</h3>
                <p className="text-gray-600 text-sm mb-4">Store customer information, company details, and relationship data.</p>
                <div className="text-xs text-gray-500 font-mono bg-gray-50 p-3 rounded-lg">
                  id, name, email, company, notes
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                  <CheckSquare className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Tasks</h3>
                <p className="text-gray-600 text-sm mb-4">Manage follow-ups, reminders, and action items with priorities.</p>
                <div className="text-xs text-gray-500 font-mono bg-gray-50 p-3 rounded-lg">
                  id, title, description, status, priority
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Interactions</h3>
                <p className="text-gray-600 text-sm mb-4">Track calls, meetings, emails, and touchpoint history.</p>
                <div className="text-xs text-gray-500 font-mono bg-gray-50 p-3 rounded-lg">
                  id, contact_id, type, notes, date
                </div>
              </div>
            </motion.div>

            {/* Extension Guide */}
            <motion.div 
              className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.8 }}
            >
              <h3 className="text-2xl font-bold mb-8 text-center">Want to Add Your Own Data?</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-lg font-bold mb-4 text-[#2b4bee]">1. Database Schema</h4>
                  <p className="text-gray-600 mb-4">Add your table to <code className="bg-gray-100 px-2 py-1 rounded text-sm">src/db/schema.ts</code></p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono mb-6">
                    <div>export const deals = mysqlTable('deals', {`{`}</div>
                    <div className="ml-4">id: int('id').primaryKey().autoincrement(),</div>
                    <div className="ml-4">name: varchar('name', {`{`} length: 255 {`}`}),</div>
                    <div className="ml-4">value: decimal('value', {`{`} precision: 10, scale: 2 {`}`}),</div>
                    <div className="ml-4">stage: varchar('stage', {`{`} length: 50 {`}`})</div>
                    <div>{`}`});</div>
                  </div>
                  
                  <h4 className="text-lg font-bold mb-4 text-[#2b4bee]">2. API Routes</h4>
                  <p className="text-gray-600 mb-4">Extend <code className="bg-gray-100 px-2 py-1 rounded text-sm">src/app/api/[[...route]]/route.ts</code></p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono">
                    <div>app.get('/deals', async (c) = {`{`}</div>
                    <div className="ml-4">const deals = await db.select().from(dealsTable);</div>
                    <div className="ml-4">return c.json(deals);</div>
                    <div>{`}`});</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold mb-4 text-[#2b4bee]">3. Tambo Components</h4>
                  <p className="text-gray-600 mb-4">Create UI in <code className="bg-gray-100 px-2 py-1 rounded text-sm">src/components/tambo/</code></p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono mb-6">
                    <div>export function DealsList({`{`} deals = [] {`}`}) {`{`}</div>
                    <div className="ml-4">return (</div>
                    <div className="ml-6">&lt;div className="space-y-4"&gt;</div>
                    <div className="ml-8">{`{deals.map(deal => (`}</div>
                    <div className="ml-10">&lt;DealCard key={`{deal.id}`} deal={`{deal}`} /&gt;</div>
                    <div className="ml-8">{`))}`}</div>
                    <div className="ml-6">&lt;/div&gt;</div>
                    <div className="ml-4">);</div>
                    <div>{`}`}</div>
                  </div>
                  
                  <h4 className="text-lg font-bold mb-4 text-[#2b4bee]">4. Tambo Tools</h4>
                  <p className="text-gray-600 mb-4">Register in <code className="bg-gray-100 px-2 py-1 rounded text-sm">src/lib/tambo.ts</code></p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono">
                    <div>createDeal: {`{`}</div>
                    <div className="ml-4">description: 'Create a new deal',</div>
                    <div className="ml-4">parameters: z.object({`{`}</div>
                    <div className="ml-6">name: z.string(),</div>
                    <div className="ml-6">value: z.number(),</div>
                    <div className="ml-6">stage: z.string()</div>
                    <div className="ml-4">{`}`}),</div>
                    <div className="ml-4">execute: async (params) = {`{`}...{`}`}</div>
                    <div>{`}`}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <a 
                  href="https://github.com/Farhantigadi/tambo-db.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 bg-[#2b4bee] text-white px-8 py-4 rounded-xl hover:bg-[#2b4bee]/90 transition-colors cursor-pointer"
                >
                  <Github className="w-5 h-5" />
                  <span className="font-bold">Clone the repo and start building!</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Interactive Commands */}
          <div className="w-full max-w-[1200px] px-6 py-20">
            <motion.div 
              className="bg-[#2b4bee] rounded-3xl p-12 text-white relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.2 }}
            >
              {/* Abstract Background Decoration */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                  <h2 className="text-4xl font-bold mb-6">Try these commands</h2>
                  <p className="text-blue-100 text-lg mb-8 opacity-90">
                    Ready to stop clicking and start asking? Tambo handles the complexity so you can focus on the relationships.
                  </p>
                  <button 
                    onClick={() => setShowChat(true)}
                    className="bg-white text-[#2b4bee] px-8 py-4 rounded-xl font-extrabold shadow-xl shadow-black/10 hover:scale-105 transition-transform"
                  >
                    Start Chatting Now
                  </button>
                </div>
                <div className="md:w-1/2 grid grid-cols-1 gap-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-white/20 transition-colors">
                    <Target className="w-5 h-5" />
                    <span className="font-medium">"Summarize my calls with Acme Corp this week."</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-white/20 transition-colors">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">"Add Jane Smith from the email to my high-priority list."</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-white/20 transition-colors">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">"Remind me to follow up with everyone I haven't talked to in 30 days."</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full bg-white border-t border-gray-200 py-16">
          <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between gap-12">
            <div className="flex flex-col gap-6 max-w-sm">
              <div className="flex items-center gap-3 text-[#2b4bee]">
                <div className="size-6">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor" />
                  </svg>
                </div>
                <h2 className="text-black text-xl font-extrabold tracking-tight">Tambo AI</h2>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                The intelligent layer for your customer relationships. Built with love for modern teams who value speed and clarity.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-sm text-black">Product</h4>
                <a className="text-sm text-gray-500 hover:text-[#2b4bee]" href="#features">Features</a>
                <a className="text-sm text-gray-500 hover:text-[#2b4bee]" href="#how-it-works">How it Works</a>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-sm text-black">Company</h4>
                <a className="text-sm text-gray-500 hover:text-[#2b4bee]" href="#">About</a>
                <a className="text-sm text-gray-500 hover:text-[#2b4bee]" href="https://github.com/Farhantigadi/tambo-db.git" target="_blank">GitHub</a>
                <a className="text-sm text-gray-500 hover:text-[#2b4bee]" href="mailto:farhantigadi123@gmail.com">Contact</a>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-sm text-black">Developer</h4>
                <a className="text-sm text-gray-500 hover:text-[#2b4bee]" href="https://www.linkedin.com/in/mohammadfarhan-tigadi-934258237/" target="_blank">LinkedIn</a>
                <a className="text-sm text-gray-500 hover:text-[#2b4bee]" href="mailto:farhantigadi123@gmail.com">Email</a>
                <a className="text-sm text-gray-500 hover:text-[#2b4bee]" href="https://tambo.co" target="_blank">Tambo AI</a>
              </div>
            </div>
          </div>
          <div className="max-w-[1200px] mx-auto px-6 mt-16 pt-8 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              © 2024 Tambo CRM by <strong>Mohammadfarhan Tigadi</strong> • Java Backend Developer • Belagavi, India
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}