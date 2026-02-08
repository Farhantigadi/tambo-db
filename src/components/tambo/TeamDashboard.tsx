"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Trophy, Target, TrendingUp, Users, Award, Star, DollarSign } from "lucide-react";

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: "rep" | "manager" | "admin";
  assigned_deals?: number;
  closed_deals?: number;
  win_rate?: number;
  total_value?: number;
  this_month_deals?: number;
  avatar?: string;
}

export interface TeamDashboardProps {
  team?: TeamMember[];
  currentUserId?: number;
  showLeaderboard?: boolean;
}

const roleColors = {
  rep: "bg-blue-100 text-blue-800",
  manager: "bg-purple-100 text-purple-800",
  admin: "bg-green-100 text-green-800",
};

const roleNames = {
  rep: "Sales Rep",
  manager: "Manager",
  admin: "Admin",
};

export function TeamDashboard({ team = [], currentUserId, showLeaderboard = true }: TeamDashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

   const getInitials = (name: string) => {
    return (name || '?')
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sortedTeam = [...team].sort((a, b) => (b.total_value || 0) - (a.total_value || 0));

  const teamStats = {
    totalMembers: team.length,
    totalDeals: team.reduce((sum, member) => sum + (member.assigned_deals || 0), 0),
    totalValue: team.reduce((sum, member) => sum + (member.total_value || 0), 0),
    avgWinRate: team.length > 0 
      ? team.reduce((sum, member) => sum + (member.win_rate || 0), 0) / team.length 
      : 0,
  };

  if (team.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Team Data</h3>
        <p className="text-gray-600">Add team members to see performance metrics here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Team Overview Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Team Dashboard</h3>
            <p className="text-sm text-gray-600">Performance overview and leaderboard</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">{teamStats.totalMembers}</p>
                <p className="text-xs text-blue-700">Team Members</p>
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
              <Target className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">{teamStats.totalDeals}</p>
                <p className="text-xs text-green-700">Active Deals</p>
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
              <DollarSign className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-lg font-bold text-purple-900">{formatCurrency(teamStats.totalValue)}</p>
                <p className="text-xs text-purple-700">Pipeline Value</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-900">{Math.round(teamStats.avgWinRate)}%</p>
                <p className="text-xs text-orange-700">Avg Win Rate</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Team Leaderboard */}
      {showLeaderboard && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Leaderboard</h3>
              <p className="text-sm text-gray-600">Ranked by total pipeline value</p>
            </div>
          </div>

          <div className="space-y-3">
            {sortedTeam.map((member, index) => {
              const isCurrentUser = member.id === currentUserId;
              const rank = index + 1;
              
              return (
                <motion.div
                  key={member.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    isCurrentUser 
                      ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200 font-bold text-sm">
                    {rank <= 3 ? (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        rank === 1 ? 'bg-yellow-400' : rank === 2 ? 'bg-gray-400' : 'bg-orange-400'
                      }`}>
                        {rank === 1 ? <Trophy className="w-3 h-3 text-white" /> : 
                         rank === 2 ? <Award className="w-3 h-3 text-white" /> : 
                         <Star className="w-3 h-3 text-white" />}
                      </div>
                    ) : (
                      <span className="text-gray-600">{rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                    {member.avatar ? (
                      <Image src={member.avatar} alt={member.name} width={48} height={48} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(member.name)
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">{member.name}</h4>
                      {isCurrentUser && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        roleColors[member.role]
                      }`}>
                        {roleNames[member.role]}
                      </span>
                      <span className="text-xs text-gray-500">{member.email}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <p className="font-mono text-lg font-bold text-green-600">
                      {formatCurrency(member.total_value || 0)}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>{member.assigned_deals || 0} deals</span>
                      <span>{member.win_rate || 0}% win rate</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Individual Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.slice(0, 6).map((member, index) => (
          <motion.div
            key={member.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(member.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 truncate">{member.name}</h4>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  roleColors[member.role]
                }`}>
                  {roleNames[member.role]}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Pipeline Value</span>
                <span className="font-mono text-sm font-bold text-green-600">
                  {formatCurrency(member.total_value || 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Active Deals</span>
                <span className="text-sm font-semibold text-gray-900">{member.assigned_deals || 0}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Win Rate</span>
                <span className="text-sm font-semibold text-blue-600">{member.win_rate || 0}%</span>
              </div>

              {/* Win rate progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${member.win_rate || 0}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TeamDashboard;