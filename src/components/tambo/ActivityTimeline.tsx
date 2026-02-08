"use client";

import { motion } from "framer-motion";
import { Phone, Mail, Calendar, MessageSquare, TrendingUp, TrendingDown, Minus, User, Building } from "lucide-react";

export interface Activity {
  id: number;
  contact_id?: number;
  deal_id?: number;
  user_id?: number;
  type: "call" | "email" | "meeting" | "note";
  description: string;
  outcome?: "positive" | "neutral" | "negative";
  interaction_date: string;
  contact_name?: string;
  deal_title?: string;
  user_name?: string;
}

export interface ActivityTimelineProps {
  activities?: Activity[];
  showFilters?: boolean;
}

const activityIcons = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: MessageSquare,
};

const outcomeIcons = {
  positive: TrendingUp,
  neutral: Minus,
  negative: TrendingDown,
};

const outcomeColors = {
  positive: "text-green-600 bg-green-100",
  neutral: "text-gray-600 bg-gray-100",
  negative: "text-red-600 bg-red-100",
};

const activityColors = {
  call: "text-blue-600 bg-blue-100",
  email: "text-purple-600 bg-purple-100",
  meeting: "text-orange-600 bg-orange-100",
  note: "text-gray-600 bg-gray-100",
};

export function ActivityTimeline({ activities = [], showFilters = false }: ActivityTimelineProps) {
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.interaction_date).getTime() - new Date(a.interaction_date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-gray-200 dark:border-white/10 p-8 text-center backdrop-blur-sm">
        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Activities Yet</h3>
        <p className="text-gray-600 dark:text-gray-400">Start engaging with your contacts to see activity history here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-gray-200 dark:border-white/10 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Activity Timeline</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Recent interactions and updates</p>
        </div>
        {showFilters && (
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              All
            </button>
            <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full">
              Calls
            </button>
            <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full">
              Meetings
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {sortedActivities.map((activity, index) => {
          const ActivityIcon = activityIcons[activity.type];
          const OutcomeIcon = activity.outcome ? outcomeIcons[activity.outcome] : null;

          return (
            <motion.div
              key={activity.id}
              className="relative flex gap-4 pb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {/* Timeline line */}
              {index < sortedActivities.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200 dark:bg-slate-600" />
              )}

              {/* Activity icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                activityColors[activity.type]
              }`}>
                <ActivityIcon className="w-5 h-5" />
              </div>

              {/* Activity content */}
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white capitalize">
                        {activity.type}
                      </span>
                      {activity.outcome && OutcomeIcon && (
                        <div className={`p-1 rounded-full ${outcomeColors[activity.outcome]}`}>
                          <OutcomeIcon className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{formatDate(activity.interaction_date)}</p>
                      <p className="text-xs text-gray-400">{formatTime(activity.interaction_date)}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                    {activity.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    {activity.contact_name && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{activity.contact_name}</span>
                      </div>
                    )}
                    
                    {activity.deal_title && (
                      <div className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        <span>{activity.deal_title}</span>
                      </div>
                    )}

                    {activity.user_name && (
                      <div className="flex items-center gap-1">
                        <span>by {activity.user_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Load more button */}
      {sortedActivities.length > 10 && (
        <div className="text-center mt-6">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            Load More Activities
          </button>
        </div>
      )}
    </div>
  );
}

export default ActivityTimeline;