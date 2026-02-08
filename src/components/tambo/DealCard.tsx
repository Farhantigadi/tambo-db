"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Calendar, User, Edit3, Save, X, Building } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

export interface Deal {
  id: number;
  title: string;
  value: number;
  probability: number;
  stage: string;
  contact_id?: number;
  contact_name?: string;
  company?: string;
  expected_close_date?: string;
  notes?: string;
  created_at?: string;
}

export interface DealCardProps {
  deal: Deal;
  view?: "detail" | "compact" | "mini-chart";
  onUpdate?: (dealId: number, updates: Partial<Deal>) => void;
}

const stageColors = {
  prospecting: "bg-blue-100 text-blue-800",
  qualification: "bg-yellow-100 text-yellow-800",
  negotiation: "bg-orange-100 text-orange-800",
  closed_won: "bg-green-100 text-green-800",
  closed_lost: "bg-red-100 text-red-800",
};

const stageNames = {
  prospecting: "Prospecting",
  qualification: "Qualification",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

export function DealCard({ deal, view = "detail", onUpdate }: DealCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(deal);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(deal.id, editData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(deal);
    setIsEditing(false);
  };

  // Generate mock probability trend data
  const probabilityData = [
    { day: 1, probability: Math.max(0, (deal?.probability || 0) - 30) },
    { day: 7, probability: Math.max(0, (deal?.probability || 0) - 20) },
    { day: 14, probability: Math.max(0, (deal?.probability || 0) - 10) },
    { day: 21, probability: deal?.probability || 0 },
  ];

  if (view === "compact") {
    return (
      <motion.div
        className="bg-white dark:bg-slate-800/90 border border-gray-200 dark:border-white/10 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer backdrop-blur-sm"
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsEditing(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{deal.title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{deal.contact_name}</p>
          </div>
          <div className="text-right ml-4">
            <p className="font-mono text-sm font-bold text-green-600">
              {formatCurrency(deal.value)}
            </p>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
              stageColors[deal.stage as keyof typeof stageColors] || "bg-gray-100 text-gray-800"
            }`}>
              {stageNames[deal.stage as keyof typeof stageNames] || deal.stage}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (view === "mini-chart") {
    return (
      <motion.div
        className="bg-white dark:bg-slate-800/90 border border-gray-200 dark:border-white/10 rounded-lg p-4 hover:shadow-md transition-all backdrop-blur-sm"
        whileHover={{ scale: 1.02 }}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-gray-900 truncate">{deal.title}</h4>
            <span className="text-xs font-mono text-green-600">{formatCurrency(deal.value)}</span>
          </div>
          
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={probabilityData}>
                <XAxis dataKey="day" hide />
                <YAxis hide />
                <Line 
                  type="monotone" 
                  dataKey="probability" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Probability</span>
            <span className="font-semibold text-blue-600">{deal.probability}%</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Detail view
  return (
    <motion.div
      className="bg-white dark:bg-slate-800/90 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-all backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="text-lg font-bold text-gray-900 dark:text-white bg-transparent border-b border-blue-300 dark:border-blue-600 focus:outline-none focus:border-blue-500 w-full"
              />
            ) : (
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{deal.title}</h3>
            )}
            <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
              stageColors[deal.stage as keyof typeof stageColors] || "bg-gray-100 text-gray-800"
            }`}>
              {stageNames[deal.stage as keyof typeof stageNames] || deal.stage}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Value and Probability */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Deal Value</p>
              {isEditing ? (
                <input
                  type="number"
                  value={editData.value}
                  onChange={(e) => setEditData({ ...editData, value: parseFloat(e.target.value) || 0 })}
                  className="font-mono text-lg font-bold text-green-600 dark:text-green-400 bg-transparent border-b border-blue-300 dark:border-blue-600 focus:outline-none focus:border-blue-500 w-full"
                />
              ) : (
                <p className="font-mono text-lg font-bold text-green-600">
                  {formatCurrency(deal.value)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Probability</p>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editData.probability}
                  onChange={(e) => setEditData({ ...editData, probability: parseInt(e.target.value) || 0 })}
                  className="text-lg font-bold text-blue-600 dark:text-blue-400 bg-transparent border-b border-blue-300 dark:border-blue-600 focus:outline-none focus:border-blue-500 w-full"
                />
              ) : (
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{deal.probability}%</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact and Company */}
        {(deal.contact_name || deal.company) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deal.contact_name && (
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Contact</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{deal.contact_name}</p>
                </div>
              </div>
            )}
            
            {deal.company && (
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{deal.company}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expected Close Date */}
        {deal.expected_close_date && (
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-purple-600" />
            <div>
              <p className="text-xs text-gray-500">Expected Close</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(deal.expected_close_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {/* Probability Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Win Probability</span>
            <span>{deal.probability}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${deal.probability}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Notes */}
        {(deal.notes || isEditing) && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Notes</p>
            {isEditing ? (
              <textarea
                value={editData.notes || ""}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                className="w-full p-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Add notes about this deal..."
              />
            ) : (
              deal.notes && (
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {deal.notes}
                </p>
              )
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default DealCard;