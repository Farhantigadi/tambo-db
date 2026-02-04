"use client";

import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat() {
  const { thread } = useTamboThread();
  const { value, setValue, submit, isPending } = useTamboThreadInput();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [thread.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      submit();
    }
  };

  const exampleQueries = [
    "Add John Doe from Microsoft",
    "Show all my contacts",
    "Create a task to call Sarah",
    "Show analytics dashboard"
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50/50">
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to your AI CRM Assistant
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              I can help you manage contacts, create tasks, and provide insights. 
              Just tell me what you'd like to do in natural language.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              {exampleQueries.map((query, index) => (
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

      {/* Input */}
      <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1 relative">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ask me anything about your contacts..."
              className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm transition-all duration-200 hover:border-gray-300"
              disabled={isPending}
            />
          </div>
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
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          Try: "Add Sarah from Tesla" • "Show analytics" • "Create a reminder"
        </p>
      </div>
    </div>
  );
}
