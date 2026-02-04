export const runtime = "nodejs";

import { Hono } from "hono";
import { handle } from "hono/vercel";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { like, eq, sql, and, lt } from "drizzle-orm";
import { db, contacts, tasks, interactions } from "../../../db";

const app = new Hono().basePath("/api");

const createContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["active", "inactive", "prospect", "customer"]).optional(),
});

const createTaskSchema = z.object({
  contactId: z.number().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(),
});

// Enhanced contacts endpoint
app.get("/contacts", zValidator("query", z.object({
  query: z.string().optional(),
  company: z.string().optional(),
  status: z.string().optional(),
  inactive_days: z.string().optional(),
})), async (c) => {
  try {
    const { query, company, status, inactive_days } = c.req.valid("query");
    
    let whereConditions = [];
    
    if (query) {
      whereConditions.push(like(contacts.name, `%${query}%`));
    }
    if (company) {
      whereConditions.push(like(contacts.company, `%${company}%`));
    }
    if (status) {
      whereConditions.push(eq(contacts.status, status as any));
    }
    if (inactive_days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(inactive_days));
      whereConditions.push(lt(contacts.lastContactDate, daysAgo.toISOString().split('T')[0]));
    }
    
    const allContacts = whereConditions.length > 0 
      ? await db.select().from(contacts).where(and(...whereConditions))
      : await db.select().from(contacts);

    return c.json(allContacts);
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to fetch contacts" }, 500);
  }
});

app.post("/contacts", zValidator("json", createContactSchema), async (c) => {
  try {
    const validatedData = c.req.valid("json");
    
    await db.insert(contacts).values({
      ...validatedData,
      lastContactDate: new Date().toISOString().split('T')[0],
    });

    return c.json({
      success: true,
      message: `Contact ${validatedData.name} has been successfully saved.`,
    }, 201);
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to create contact" }, 500);
  }
});

// Tasks endpoints
app.get("/tasks", async (c) => {
  try {
    const allTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        dueDate: tasks.dueDate,
        completed: tasks.completed,
        contactName: contacts.name,
      })
      .from(tasks)
      .leftJoin(contacts, eq(tasks.contactId, contacts.id));

    return c.json(allTasks);
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to fetch tasks" }, 500);
  }
});

app.post("/tasks", zValidator("json", createTaskSchema), async (c) => {
  try {
    const validatedData = c.req.valid("json");
    
    await db.insert(tasks).values({
      ...validatedData,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
    });

    return c.json({
      success: true,
      message: `Task "${validatedData.title}" has been created.`,
    }, 201);
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to create task" }, 500);
  }
});

// Analytics endpoint
app.get("/analytics", async (c) => {
  try {
    const [contactStats] = await db
      .select({
        totalContacts: sql<number>`COUNT(*)`,
        activeContacts: sql<number>`SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END)`,
        prospects: sql<number>`SUM(CASE WHEN status = 'prospect' THEN 1 ELSE 0 END)`,
        customers: sql<number>`SUM(CASE WHEN status = 'customer' THEN 1 ELSE 0 END)`,
      })
      .from(contacts);

    const [taskStats] = await db
      .select({
        pendingTasks: sql<number>`SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END)`,
        overdueTasks: sql<number>`SUM(CASE WHEN completed = 0 AND due_date < NOW() THEN 1 ELSE 0 END)`,
      })
      .from(tasks);

    const topCompanies = await db
      .select({
        company: contacts.company,
        count: sql<number>`COUNT(*)`,
      })
      .from(contacts)
      .where(sql`company IS NOT NULL AND company != ''`)
      .groupBy(contacts.company)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(5);

    return c.json({
      stats: {
        ...contactStats,
        ...taskStats,
      },
      topCompanies,
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to fetch analytics" }, 500);
  }
});

app.patch("/contacts/:id", zValidator("json", createContactSchema.partial()), async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const validatedData = c.req.valid("json");

    await db.update(contacts).set(validatedData).where(eq(contacts.id, id));

    return c.json({
      success: true,
      message: `Contact updated successfully.`,
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to update contact" }, 500);
  }
});

app.delete("/contacts/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    await db.delete(contacts).where(eq(contacts.id, id));
    return c.json({ success: true });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to delete contact" }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
