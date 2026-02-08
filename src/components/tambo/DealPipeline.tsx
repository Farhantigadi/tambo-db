"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Calendar, User, AlertCircle, RefreshCw } from "lucide-react";

export interface Deal {
  id: number;
  title: string;
  value: number;
  probability: number;
  stage: string;
  contactId?: number;
  contactName?: string;
  contactCompany?: string;
  expectedCloseDate?: string;
  notes?: string;
  createdAt?: string;
}

export interface DealPipelineProps {
  deals?: Deal[];
  onDealMove?: (dealId: number, newStage: string) => void;
  loading?: boolean;
  error?: string;
}

const stages = [
  { id: "prospecting", name: "Prospecting", color: "bg-blue-500" },
  { id: "qualification", name: "Qualification", color: "bg-yellow-500" },
  { id: "negotiation", name: "Negotiation", color: "bg-orange-500" },
  { id: "closed_won", name: "Closed Won", color: "bg-green-500" },
  { id: "closed_lost", name: "Closed Lost", color: "bg-red-500" },
];

export function DealPipeline({ deals = [], loading = false, error }: DealPipelineProps) {
  const [localDeals, setLocalDeals] = useState<Deal[]>(deals);

  useEffect(() => {
    setLocalDeals(deals);
  }, [deals]);

  const getDealsByStage = (stage: string) => {
    return localDeals.filter(deal => deal.stage === stage);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStageTotal = (stage: string) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  if (error) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-red-200 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Pipeline</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {stages.map((stage) => (
            <div key={stage.id} className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-gray-200 rounded w-12 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
                </div>
              </div>
              <div className="p-3 space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (localDeals.length === 0) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-gray-200 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Deals Found</h3>
        <p className="text-gray-600 mb-4">Get started by creating your first deal or contact.</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add New Deal
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Import Contacts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-white/10">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sales Pipeline</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">View all deals organized by stage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.id);
          const stageTotal = getStageTotal(stage.id);

          return (
            <div key={stage.id} className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
              <div className="p-4 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{stage.name}</h4>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{stageDeals.length} deals</span>
                  <span className="font-mono">{formatCurrency(stageTotal)}</span>
                </div>
              </div>

              <div className="p-3 min-h-[200px]">
                {stageDeals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    className="mb-3 p-4 bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-white/10 rounded-lg shadow-sm transition-all hover:shadow-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="space-y-3">
                      <h5 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                        {deal.title}
                      </h5>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-mono text-sm font-bold text-green-600">
                          {formatCurrency(deal.value)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {deal.probability}% probability
                        </span>
                      </div>

                      {deal.contactName && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {deal.contactName}
                          </span>
                        </div>
                      )}

                      {deal.expectedCloseDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(deal.expectedCloseDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                    <div className="text-xs">No deals in this stage</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DealPipeline;