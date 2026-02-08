import { z } from "zod";

export const TeamDashboardSchema = z.object({
  team: z.array(z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    role: z.enum(["rep", "manager", "admin"]),
    assigned_deals: z.number().optional(),
    closed_deals: z.number().optional(),
    win_rate: z.number().optional(),
    total_value: z.number().optional(),
    this_month_deals: z.number().optional(),
    avatar: z.string().optional(),
  })).optional().default([]),
  currentUserId: z.number().optional(),
  showLeaderboard: z.boolean().optional().default(true),
});

export type TeamDashboardProps = z.infer<typeof TeamDashboardSchema>;