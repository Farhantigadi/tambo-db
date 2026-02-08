import { z } from "zod";

export const DealPipelineSchema = z.object({
  deals: z.array(z.object({
    id: z.number(),
    title: z.string(),
    value: z.number(),
    probability: z.number(),
    stage: z.string(),
    contact_id: z.number().optional(),
    contact_name: z.string().optional(),
    expected_close_date: z.string().optional(),
    notes: z.string().optional(),
  })).optional().default([]),
  onDealMove: z.function().optional(),
});

export type DealPipelineProps = z.infer<typeof DealPipelineSchema>;