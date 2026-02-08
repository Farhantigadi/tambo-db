import { z } from "zod";

export const ActivityTimelineSchema = z.object({
  activities: z.array(z.object({
    id: z.number(),
    contact_id: z.number().optional(),
    deal_id: z.number().optional(),
    user_id: z.number().optional(),
    type: z.enum(["call", "email", "meeting", "note"]),
    description: z.string(),
    outcome: z.enum(["positive", "neutral", "negative"]).optional(),
    interaction_date: z.string(),
    contact_name: z.string().optional(),
    deal_title: z.string().optional(),
    user_name: z.string().optional(),
  })).optional().default([]),
  showFilters: z.boolean().optional().default(false),
});

export type ActivityTimelineProps = z.infer<typeof ActivityTimelineSchema>;