import { z } from "zod";

export const ContactCardSchema = z.object({
  contacts: z.array(z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    phone: z.string().optional(),
    company: z.string().optional(),
    position: z.string().optional(),
    status: z.enum(["active", "inactive", "prospect", "customer"]).optional(),
    lastContactDate: z.string().optional(),
  })),
  viewType: z.enum(["card", "table", "compact"]).default("card"),
});

export type ContactCardProps = z.infer<typeof ContactCardSchema>;