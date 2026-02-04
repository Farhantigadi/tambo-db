import { z } from "zod";

export const AnalyticsDashboardSchema = z.object({
  stats: z.object({
    totalContacts: z.number(),
    activeContacts: z.number(),
    prospects: z.number(),
    customers: z.number(),
    pendingTasks: z.number(),
    overdueTasks: z.number(),
  }),
  recentActivity: z.array(z.object({
    id: z.number(),
    type: z.string(),
    description: z.string(),
    date: z.string(),
  })).optional(),
  topCompanies: z.array(z.object({
    company: z.string(),
    count: z.number(),
  })).optional(),
});

export type AnalyticsDashboardProps = z.infer<typeof AnalyticsDashboardSchema>;