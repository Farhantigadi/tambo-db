"use client";

import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import { Send, Bot, User, Sparkles, Mic, MicOff, Lightbulb, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function Chat() {
  const { thread } = useTamboThread();
  const { value, setValue, submit, isPending } = useTamboThreadInput();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setValue(transcript);
        setIsListening(false);
        toast.success('Voice input captured!');
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice input failed. Please try again.');
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognition);
    }
  }, [setValue]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    
    // Show proactive suggestions after AI responds
    if (thread.messages.length > 0) {
      const lastMessage = thread.messages[thread.messages.length - 1];
      if (lastMessage.role === 'assistant' && lastMessage.renderedComponent) {
        setTimeout(() => setShowSuggestions(true), 1000);
      }
    }
  }, [thread.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      setShowSuggestions(false);
      submit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        setShowSuggestions(false);
        submit();
      }
    }
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      toast.error('Voice input not supported in this browser');
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast.info('Listening... Speak now!');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setValue(suggestion);
    setShowSuggestions(false);
  };

  const exampleQueries = [
    "Show me the sales pipeline",
    "Add Microsoft deal worth $50,000",
    "Show team performance dashboard", 
    "Create follow-up task for Tesla deal-Product Integration",
    "Show pipeline funnel analysis",
    "Add contact Sarah Johnson from Google"
  ];

  const proactiveSuggestions = [
    "Show me deals closing this month",
    "Add new deal for Apple", 
    "Update Microsoft deal to negotiation",
    "Show activity timeline",
    "Create task to follow up with Tesla",
    "Show pipeline conversion rates",
    "Add contact from enterprise prospect",
    "View team leaderboard"
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {thread.messages.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to your AI CRM Assistant
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
              I can help you manage contacts, deals, tasks, and provide insights. 
              Just tell me what you'd like to do in natural language or use voice input.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {exampleQueries.slice(0, 4).map((query, index) => (
                <motion.button
                  key={index}
                  onClick={() => setValue(query)}
                  className="p-3 text-left bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 text-sm text-gray-700 hover:text-gray-900"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  "{query}"
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {thread.messages.map((message, index) => {
            // Check if message should be hidden
            const shouldHideMessage = Array.isArray(message.content)
              ? message.content.every(
                  (part) =>
                    part.type === "text" &&
                    part.text &&
                    (part.text.trim() === "}" ||
                      part.text.includes('{"success"') ||
                      part.text.includes('{"error"') ||
                      part.text.trim() === ""),
                )
              : String(message.content).trim() === "}" ||
                String(message.content).includes('{"success"') ||
                String(message.content).includes('{"error"') ||
                String(message.content).trim() === "";

            // Skip message if it should be hidden and has no component
            if (shouldHideMessage && !message.renderedComponent) {
              return null;
            }

            return (
              <motion.div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                      : "bg-white border-2 border-gray-100"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-gray-600" />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`max-w-[75%] ${
                    message.role === "user" ? "items-end" : "items-start"
                  } flex flex-col gap-2`}
                >
                  {!shouldHideMessage && (
                    <motion.div
                      className={`px-5 py-3 rounded-2xl shadow-sm ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-lg"
                          : "bg-white border border-gray-200 text-gray-900 rounded-bl-lg"
                      }`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {Array.isArray(message.content)
                        ? message.content.map((part, i) => {
                            if (part.type === "text" && part.text) {
                              // Hide unwanted content
                              if (
                                part.text.includes('{"success"') ||
                                part.text.includes('{"error"') ||
                                part.text.trim() === "}" ||
                                part.text.trim() === ""
                              ) {
                                return null;
                              }
                              return (
                                <p key={i} className="text-sm leading-relaxed">
                                  {part.text}
                                </p>
                              );
                            }
                            return null;
                          })
                        : (() => {
                            const content = String(message.content);
                            if (
                              content.includes('{"success"') ||
                              content.includes('{"error"') ||
                              content.trim() === "}" ||
                              content.trim() === ""
                            ) {
                              return null;
                            }
                            return (
                              <p className="text-sm leading-relaxed">{content}</p>
                            );
                          })()}
                    </motion.div>
                  )}

                  {/* Rendered Component */}
                  {message.renderedComponent && (
                    <motion.div 
                      className="mt-2 w-full"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        {message.renderedComponent}
                      </div>
                    </motion.div>
                  )}

                  {/* Timestamp */}
                  {(!shouldHideMessage || message.renderedComponent) && (
                    <p className="text-xs text-gray-400 px-2 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isPending && (
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-10 h-10 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center shadow-sm">
                <Bot className="w-5 h-5 text-gray-600" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-lg px-5 py-3 shadow-sm">
                <div className="flex gap-1">
                  <motion.div 
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div 
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div 
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Proactive Suggestions */}
      <AnimatePresence>
        {showSuggestions && !isPending && (
          <motion.div
            className="px-6 pb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">What would you like to do next?</span>
                </div>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {proactiveSuggestions.slice(0, 6).map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-2 text-xs font-medium bg-white text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1 relative">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your CRM or use voice input..."
              className="w-full px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              disabled={isPending}
            />
            {isListening && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <motion.div
                  className="w-2 h-2 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </div>
            )}
          </div>
          
          {/* Voice Input Button */}
          <motion.button
            type="button"
            onClick={handleVoiceInput}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gray-500 hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isPending}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </motion.button>
          
          {/* Send Button */}
          <motion.button
            type="submit"
            disabled={isPending || !value.trim()}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-300 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-5 h-5 text-white" />
          </motion.button>
        </form>
        
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            Try: "Show me the sales pipeline" • "Add a new deal" • "View team performance" • "Create follow-up task"
          </p>
        </div>
      </div>
    </div>
  );
}
