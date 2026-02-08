import { z } from "zod";

export const DealCardSchema = z.object({
  deal: z.object({
    id: z.number(),
    title: z.string(),
    value: z.number(),
    probability: z.number(),
    stage: z.string(),
    contact_id: z.number().optional(),
    contact_name: z.string().optional(),
    company: z.string().optional(),
    expected_close_date: z.string().optional(),
    notes: z.string().optional(),
    created_at: z.string().optional(),
  }),
  view: z.enum(["detail", "compact", "mini-chart"]).optional().default("detail"),
  onUpdate: z.function().optional(),
});

export type DealCardProps = z.infer<typeof DealCardSchema>;