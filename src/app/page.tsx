"use client";

import { useState } from "react";
import { TamboProvider } from "@tambo-ai/react";
import { tamboComponents, tamboTools } from "../lib/tambo";
import Chat from "../components/Chat";
import { Users, MessageSquare, BarChart3, CheckSquare, Sparkles, ArrowRight, Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import "./globals.css";

function Navbar({ onLogoClick }: { onLogoClick?: () => void }) {
  return (
    <motion.nav 
      className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onLogoClick || (() => window.location.href = '/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Tambo CRM
            </span>
          </button>
          <div className="flex items-center gap-4">
            <a
              href="mailto:farhantigadi123@gmail.com"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              Contact
            </a>
            <a
              href="https://github.com/Farhantigadi/tambo-db.git"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <Github className="h-4 w-4" />
              GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function FeatureCard({ icon: Icon, title, description, delay = 0 }: { icon: any, title: string, description: string, delay?: number }) {
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default function Home() {
  const [showChat, setShowChat] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div 
          className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl max-w-md border border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Missing API Key
          </h2>
          <p className="text-gray-700 mb-4">
            Please add your Tambo API key to the environment variables.
          </p>
          <p className="text-sm text-gray-500">
            Create a{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code>{" "}
            file with:
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
          <Navbar onLogoClick={() => setShowChat(false)} />

          {/* Chat Interface */}
          <div className="max-w-6xl mx-auto px-4 py-8">
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Sparkles className="w-6 h-6 mr-3" />
                      AI Assistant
                    </h2>
                    <p className="text-blue-100 mt-1">
                      Try: "Add John from Microsoft" or "Show analytics dashboard"
                    </p>
                  </div>
                  <div className="text-blue-100 text-sm">
                    Powered by Tambo
                  </div>
                </div>
              </div>
              <div className="h-[600px]">
                <Chat />
              </div>
            </motion.div>
          </div>
        </div>
      </TamboProvider>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl mb-8 shadow-2xl"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Users className="h-10 w-10 text-white" />
            </motion.div>
            
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Smart CRM with
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Natural Language
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Experience the future of customer relationship management. 
              Just tell the AI what you want - add contacts, create tasks, 
              get insights, all through conversation.
            </motion.p>
            
            <motion.button
              onClick={() => setShowChat(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageSquare className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
              Start Chatting
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powered by Tambo AI
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Showcasing the power of Generative UI where AI chooses the right components.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={MessageSquare}
            title="Natural Conversations"
            description="Talk to your CRM like you would to a human assistant. No forms, no complex workflows - just natural language."
            delay={1.2}
          />
          <FeatureCard
            icon={Users}
            title="Smart Contact Management"
            description="AI automatically extracts and organizes contact information, tracks relationships, and provides insights."
            delay={1.4}
          />
          <FeatureCard
            icon={CheckSquare}
            title="Intelligent Task Management"
            description="Create reminders, set follow-ups, and never miss important deadlines with AI-powered task management."
            delay={1.6}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <FeatureCard
            icon={BarChart3}
            title="Analytics Dashboard"
            description="Get instant insights on your contacts, track engagement patterns, and identify opportunities with AI-generated reports."
            delay={1.8}
          />
          <FeatureCard
            icon={Sparkles}
            title="Generative UI"
            description="The AI chooses the perfect component to display your data - cards, tables, charts - based on context and user intent."
            delay={2.0}
          />
        </div>
      </div>

      {/* Example Commands */}
      <motion.div
        className="max-w-7xl mx-auto px-4 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.2 }}
      >
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Try These Commands
          </h3>
          <p className="text-lg text-gray-600">
            See the AI in action with these example queries
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            "Add Sarah from Tesla with email sarah@tesla.com",
            "Show me all contacts from tech companies",
            "Create a task to call John tomorrow",
            "Show analytics dashboard",
            "Find contacts I haven't contacted in 30 days",
            "Display contacts in table view"
          ].map((command, index) => (
            <motion.span
              key={index}
              className="bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-full text-sm font-medium hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              "{command}"
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer 
        className="border-t border-gray-200/50 bg-white/50 backdrop-blur-sm mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 3 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="font-bold text-gray-900">Tambo CRM</span>
            </div>
            <p className="text-gray-600 text-sm">
              Powered by Tambo AI • 
              <a href="https://tambo.co" className="text-blue-600 hover:text-blue-700 font-medium">tambo.co</a>
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}