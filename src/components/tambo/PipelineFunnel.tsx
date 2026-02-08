"use client";

import { motion } from "framer-motion";
import { Funnel, Cell, ResponsiveContainer, Tooltip, LabelList } from "recharts";
import { TrendingDown, Users, DollarSign, Percent } from "lucide-react";

export interface FunnelStage {
  stage: string;
  name: string;
  count: number;
  value: number;
  color: string;
}

export interface PipelineFunnelProps {
  stages?: FunnelStage[];
  showMetrics?: boolean;
  title?: string;
}

const defaultStages: FunnelStage[] = [
  { stage: "prospecting", name: "Prospecting", count: 100, value: 500000, color: "#3b82f6" },
  { stage: "qualification", name: "Qualification", count: 75, value: 400000, color: "#eab308" },
  { stage: "negotiation", name: "Negotiation", count: 45, value: 300000, color: "#f97316" },
  { stage: "closed_won", name: "Closed Won", count: 25, value: 200000, color: "#22c55e" },
];

export function PipelineFunnel({ 
  stages = defaultStages, 
  showMetrics = true, 
  title = "Sales Pipeline Funnel" 
}: PipelineFunnelProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateConversionRate = (currentStage: number, previousStage: number) => {
    if (previousStage === 0) return 0;
    return Math.round((currentStage / previousStage) * 100);
  };

  const totalDeals = stages.reduce((sum, stage) => sum + stage.count, 0);
  const totalValue = stages.reduce((sum, stage) => sum + stage.value, 0);
  const overallConversion = stages.length > 0 
    ? Math.round((stages[stages.length - 1].count / stages[0].count) * 100)
    : 0;

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: FunnelStage }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">{data.count} deals</p>
          <p className="text-sm text-green-600 font-mono">{formatCurrency(data.value)}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = (props: any) => {
    const { x, y, width, height, name } = props;
    if (typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') {
      return null;
    }
    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white text-sm font-semibold"
      >
        {name}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <TrendingDown className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">Conversion rates and stage analysis</p>
        </div>
      </div>

      {showMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">{totalDeals}</p>
                <p className="text-xs text-blue-700">Total Opportunities</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-lg font-bold text-green-900">{formatCurrency(totalValue)}</p>
                <p className="text-xs text-green-700">Pipeline Value</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <Percent className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-900">{overallConversion}%</p>
                <p className="text-xs text-purple-700">Overall Conversion</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Funnel Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <Funnel
              dataKey="count"
              data={stages}
              isAnimationActive={true}
              animationDuration={800}
            >
              <Tooltip content={<CustomTooltip />} />
              <LabelList content={CustomLabel} />
              {stages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Funnel>
          </ResponsiveContainer>
        </div>

        {/* Stage Details */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 mb-4">Stage Breakdown</h4>
          {stages.map((stage, index) => {
            const previousStage = index > 0 ? stages[index - 1] : null;
            const conversionRate = previousStage 
              ? calculateConversionRate(stage.count, previousStage.count)
              : 100;

            return (
              <motion.div
                key={stage.stage}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{stage.name}</p>
                    <p className="text-xs text-gray-500">{stage.count} deals</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-gray-900">
                    {formatCurrency(stage.value)}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${
                      conversionRate >= 50 ? 'text-green-600' : 
                      conversionRate >= 25 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {conversionRate}%
                    </span>
                    {index > 0 && (
                      <div className="w-12 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            conversionRate >= 50 ? 'bg-green-500' : 
                            conversionRate >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(conversionRate, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h5 className="font-semibold text-blue-900 mb-2">Key Insights</h5>
        <div className="space-y-1 text-sm text-blue-800">
          {stages.length > 1 && (
            <>
              <p>• Biggest drop-off: {stages.reduce((max, stage, index) => {
                if (index === 0) return max;
                const dropRate = 100 - calculateConversionRate(stage.count, stages[index - 1].count);
                return dropRate > max.rate ? { stage: stage.name, rate: dropRate } : max;
              }, { stage: '', rate: 0 }).stage} stage</p>
              
              <p>• Best conversion: {stages.reduce((best, stage, index) => {
                if (index === 0) return best;
                const convRate = calculateConversionRate(stage.count, stages[index - 1].count);
                return convRate > best.rate ? { stage: stage.name, rate: convRate } : best;
              }, { stage: '', rate: 0 }).stage} stage</p>
              
              <p>• Average deal value: {formatCurrency(totalValue / totalDeals)}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PipelineFunnel;