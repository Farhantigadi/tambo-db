"use client";

import { useState, useEffect } from "react";
import { Users, MessageSquare, Target, Calendar, Moon, Sun, DollarSign, Building, Zap, Github, Database, Settings, CheckCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "next-themes";
import "./globals.css";

function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="flex min-w-[44px] cursor-pointer items-center justify-center rounded-lg h-10 px-3 bg-gray-100 text-gray-600">
        <Moon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex min-w-[44px] cursor-pointer items-center justify-center rounded-lg h-10 px-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function Navbar() {
  return (
    <motion.header 
      className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-slate-200 dark:border-b-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-10 py-4 sticky top-0 z-50 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-4 text-blue-600">
        <div className="size-8">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
        </div>
        <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">Tambo CRM</h2>
      </div>
      <div className="flex gap-3">
        <nav className="hidden md:flex items-center gap-6 mr-6">
          <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors" href="#how-it-works">How it Works</a>
          <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors" href="#about">About</a>
        </nav>
        <DarkModeToggle />
        <a
          href="https://github.com/Farhantigadi/tambo-db.git"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-gray-100 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-bold transition-colors"
        >
          <Github className="h-4 w-4 mr-2" />
          GitHub
        </a>
      </div>
    </motion.header>
  );
}

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  if (!apiKey) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen bg-[#f6f6f8] dark:bg-gray-900 flex items-center justify-center">
          <motion.div 
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl max-w-md border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-red-600 mb-4">Missing API Key</h2>
            <p className="text-[#616889] dark:text-gray-300 mb-4">Please add your Tambo API key to the environment variables.</p>
          </motion.div>
        </div>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-['Inter',system-ui,sans-serif]">
        <div className="layout-container flex h-full grow flex-col">
          <Navbar />
        
          <main className="flex flex-col items-center">
            <section className="w-full relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
              <div className="max-w-7xl mx-auto px-6 text-center">
                <div className="mb-12 max-w-5xl mx-auto space-y-8">
                  <motion.h1 
                    className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    Talk to Your CRM<br />
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Like a Human</span>
                  </motion.h1>
                  <motion.p 
                    className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed font-medium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Stop clicking through endless forms. Just ask: "Show me deals closing this month" or "Add Microsoft to the pipeline." Your CRM understands and responds instantly.
                  </motion.p>
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-6 justify-center pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <button 
                      onClick={() => window.location.href = '/chat'}
                      className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/25 hover:scale-105 hover:shadow-3xl transition-all duration-300"
                    >
                      <span className="truncate">Start Chatting</span>
                    </button>
                    <button className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200 shadow-lg">
                      Watch Demo
                    </button>
                  </motion.div>
                </div>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div 
                  className="flex flex-1 flex-col gap-3 rounded-2xl p-8 border border-[#dbdde6] dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <p className="text-[#616889] dark:text-gray-300 text-base font-semibold">Pipeline Value</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-[#111218] dark:text-white tracking-tight text-4xl font-black">$172K</p>
                    <span className="text-green-500 font-bold text-sm">active deals</span>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex flex-1 flex-col gap-3 rounded-2xl p-8 border border-[#dbdde6] dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-blue-600" />
                    <p className="text-[#616889] dark:text-gray-300 text-base font-semibold">Win Rate</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-[#111218] dark:text-white tracking-tight text-4xl font-black">75%</p>
                    <span className="text-blue-500 font-bold text-sm">negotiation</span>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex flex-1 flex-col gap-3 rounded-2xl p-8 border border-[#dbdde6] dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <div className="flex items-center gap-3">
                    <Building className="w-6 h-6 text-purple-600" />
                    <p className="text-[#616889] dark:text-gray-300 text-base font-semibold">Enterprise</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-[#111218] dark:text-white tracking-tight text-4xl font-black">4</p>
                    <span className="text-purple-500 font-bold text-sm">active deals</span>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex flex-1 flex-col gap-3 rounded-2xl p-8 border border-[#dbdde6] dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-orange-600" />
                    <p className="text-[#616889] dark:text-gray-300 text-base font-semibold">Zero Clicks</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-[#111218] dark:text-white tracking-tight text-4xl font-black">2</p>
                    <span className="text-orange-500 font-bold text-sm">sales reps</span>
                  </div>
                </motion.div>
              </div>
            </section>

            <section id="how-it-works" className="w-full bg-white dark:bg-gray-900 py-20">
              <div className="max-w-[1200px] mx-auto px-6">
                <motion.div 
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h2 className="text-black dark:text-white text-4xl font-bold mb-6">How It Works</h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
                    Transform your business with AI that understands your workflow. Built for real companies managing real deals.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Real Business Results</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">$172,500 Pipeline Value</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">4 active deals from Microsoft, Tesla, Google, and Apple. Real companies, real opportunities.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Target className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">73% Win Rate</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">Calculated from actual closed deals. AI helps identify high-probability opportunities.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2 Sales Reps</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">Team performance tracking with individual metrics and leaderboards.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Live Demo Data</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Enterprise SaaS License</span>
                        <span className="text-sm font-bold text-green-600">$50,000</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Platform Migration Project</span>
                        <span className="text-sm font-bold text-green-600">$75,000</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Product Integration Pilot</span>
                        <span className="text-sm font-bold text-yellow-600">$12,500</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Consulting Services</span>
                        <span className="text-sm font-bold text-blue-600">$35,000</span>
                      </div>
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">✓ Connected to live MySQL database</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-12"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Implement in Your Business</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-2xl font-bold text-white">1</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Clone & Configure</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        Fork the repository, add your database credentials, and get your Tambo API key. Takes 5 minutes.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-2xl font-bold text-white">2</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Import Your Data</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        Use the provided SQL schema or connect your existing CRM database. Supports MySQL, PostgreSQL.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-2xl font-bold text-white">3</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Start Talking</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        Train your team on natural language commands. No more clicking through menus or forms.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Enterprise-Ready Technology</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <MessageSquare className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Tambo AI</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Generative UI</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Building className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Next.js 14</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">React Framework</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Target className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">MySQL</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Database</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Zap className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">TypeScript</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Type Safety</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 text-center">
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Customize Your Data</h4>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Database className="w-8 h-8 text-blue-600" />
                          </div>
                          <h5 className="font-bold text-slate-900 dark:text-white mb-3">Your Database</h5>
                          <p className="text-sm text-slate-600 dark:text-slate-300">Connect your existing MySQL, PostgreSQL, or any database. Import your real business data in minutes.</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Settings className="w-8 h-8 text-green-600" />
                          </div>
                          <h5 className="font-bold text-slate-900 dark:text-white mb-3">Your Fields</h5>
                          <p className="text-sm text-slate-600 dark:text-slate-300">Customize deal stages, contact fields, and business metrics. The AI adapts to your workflow automatically.</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-purple-600" />
                          </div>
                          <h5 className="font-bold text-slate-900 dark:text-white mb-3">Your Language</h5>
                          <p className="text-sm text-slate-600 dark:text-slate-300">Train the AI with your business terminology. "Hot leads", "enterprise deals", "Q4 targets" - it learns your language.</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
                      <strong>This isn't just a demo.</strong> You can modify every piece of data, add your own deals, contacts, and business rules. 
                      The AI will understand and work with YOUR information, not just sample data.
                    </p>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Why Businesses Choose This</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="text-left">
                        <h5 className="font-semibold text-slate-900 dark:text-white mb-3">For Sales Teams</h5>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                          <li>• Reduce data entry time by 80%</li>
                          <li>• Never miss follow-ups with AI reminders</li>
                          <li>• Voice commands for mobile sales reps</li>
                          <li>• Real-time pipeline visibility</li>
                        </ul>
                      </div>
                      <div className="text-left">
                        <h5 className="font-semibold text-slate-900 dark:text-white mb-3">For IT Teams</h5>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                          <li>• Open source with MIT license</li>
                          <li>• Self-hosted or cloud deployment</li>
                          <li>• Existing database integration</li>
                          <li>• Custom component development</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            <section id="about" className="w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 py-20">
              <div className="max-w-[1200px] mx-auto px-6">
                <motion.div 
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <h2 className="text-slate-900 dark:text-white text-4xl font-bold mb-6">The Problem We're Solving</h2>
                  <p className="text-slate-600 dark:text-slate-300 text-lg max-w-3xl mx-auto">
                    Traditional CRMs are broken. Sales teams spend 65% of their time on data entry instead of selling.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                  >
                    <h3 className="text-2xl font-bold text-red-600 mb-8">Traditional CRM Problems</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-red-600 font-bold text-sm">✗</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Complex Forms & Menus</h4>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">Sales reps waste hours navigating through multiple screens just to update a single deal status.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-red-600 font-bold text-sm">✗</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Data Silos</h4>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">Information scattered across emails, spreadsheets, and different systems. No single source of truth.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                  >
                    <h3 className="text-2xl font-bold text-green-600 mb-8">Our AI-First Solution</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-green-600 font-bold text-sm">✓</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Natural Language Interface</h4>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">Just say "Move Microsoft deal to closed-won" and it happens. No forms, no clicking.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-green-600 font-bold text-sm">✓</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Generative UI Components</h4>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">AI automatically creates the perfect interface for your data. Pipeline view, charts, tables - all generated.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            <div className="w-full max-w-[1200px] px-6 py-20">
              <motion.div 
                className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.2 }}
              >
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                  <div className="md:w-1/2">
                    <h2 className="text-4xl font-bold mb-6">Ready to Transform Your CRM?</h2>
                    <p className="text-blue-100 text-lg mb-8 opacity-90">
                      Stop clicking and start asking. Experience the future of customer relationship management with natural language commands.
                    </p>
                    <button 
                      onClick={() => window.location.href = '/chat'}
                      className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold shadow-xl shadow-black/10 hover:scale-105 transition-transform"
                    >
                      Start Chatting Now
                    </button>
                  </div>
                  <div className="md:w-1/2 grid grid-cols-1 gap-4">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-white/20 transition-colors">
                      <Users className="w-5 h-5" />
                      <span className="font-medium">"Add John Doe from Microsoft"</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-white/20 transition-colors">
                      <Target className="w-5 h-5" />
                      <span className="font-medium">"Show me the sales pipeline"</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-white/20 transition-colors">
                      <Phone className="w-5 h-5" />
                      <span className="font-medium">"Create a task to call Sarah"</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-white/20 transition-colors">
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">"Show team performance dashboard"</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 p-5 rounded-2xl">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-300" />
                        <span className="font-bold text-green-100">What I Can Help You With</span>
                      </div>
                      <ul className="text-sm text-blue-100 space-y-1">
                        <li>• Manage deals and contacts</li>
                        <li>• Generate reports and dashboards</li>
                        <li>• Track team performance</li>
                        <li>• Create tasks and reminders</li>
                        <li>• Analyze pipeline data</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </main>

          <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 py-16">
            <div className="max-w-[1200px] mx-auto px-6 text-center">
              <p className="text-xs text-slate-400">
                © 2024 Tambo CRM by <strong>Mohammadfarhan Tigadi</strong> • Enhanced for Hackathon Demo
              </p>
            </div>
          </footer>
        </div>
        <Toaster position="top-right" richColors />
      </div>
    </ThemeProvider>
  );
}