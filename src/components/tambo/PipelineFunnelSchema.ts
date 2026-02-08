import { z } from "zod";

export const PipelineFunnelSchema = z.object({
  stages: z.array(z.object({
    stage: z.string(),
    name: z.string(),
    count: z.number(),
    value: z.number(),
    color: z.string(),
  })).optional(),
  showMetrics: z.boolean().optional().default(true),
  title: z.string().optional().default("Sales Pipeline Funnel"),
});

export type PipelineFunnelProps = z.infer<typeof PipelineFunnelSchema>;