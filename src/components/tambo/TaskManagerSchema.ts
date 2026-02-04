import { z } from "zod";

export const TaskManagerSchema = z.object({
  tasks: z.array(z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    completed: z.boolean(),
    contactName: z.string().optional(),
  })),
  showCompleted: z.boolean().default(false),
});

export type TaskManagerProps = z.infer<typeof TaskManagerSchema>;