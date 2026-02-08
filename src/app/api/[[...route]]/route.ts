export const runtime = "nodejs";

import { Hono } from "hono";
import { handle } from "hono/vercel";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { like, eq, sql, and, lt } from "drizzle-orm";
import { db, contacts, tasks, interactions, deals, users } from "../../../db";

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

const createDealSchema = z.object({
  contactId: z.number().min(1),
  title: z.string().min(1),
  value: z.number().positive(),
  stage: z.enum(["prospecting", "qualification", "negotiation", "closed_won", "closed_lost"]).optional(),
  probability: z.number().min(0).max(100).optional(),
  expectedCloseDate: z.string().optional(),
  notes: z.string().optional(),
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
    
    const whereConditions = [];
    
    if (query) {
      whereConditions.push(like(contacts.name, `%${query}%`));
    }
    if (company) {
      whereConditions.push(like(contacts.company, `%${company}%`));
    }
    if (status) {
      whereConditions.push(eq(contacts.status, status as "active" | "inactive" | "prospect" | "customer"));
    }
    if (inactive_days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(inactive_days));
      whereConditions.push(lt(contacts.lastContactDate, daysAgo));
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
      lastContactDate: new Date(),
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

// Deals endpoints
app.get("/deals", async (c) => {
  try {
    const allDeals = await db
      .select({
        id: deals.id,
        title: deals.title,
        value: deals.value,
        stage: deals.stage,
        probability: deals.probability,
        expectedCloseDate: deals.expectedCloseDate,
        notes: deals.notes,
        contactName: contacts.name,
        contactCompany: contacts.company,
        createdAt: deals.createdAt,
      })
      .from(deals)
      .leftJoin(contacts, eq(deals.contactId, contacts.id))
      .orderBy(deals.createdAt);

    return c.json(allDeals);
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to fetch deals" }, 500);
  }
});

app.post("/deals", zValidator("json", createDealSchema), async (c) => {
  try {
    const validatedData = c.req.valid("json");
    
    // Check if contact exists
    const contact = await db.select().from(contacts).where(eq(contacts.id, validatedData.contactId)).limit(1);
    if (!contact.length) {
      return c.json({ error: "Contact not found" }, 404);
    }

    await db.insert(deals).values({
      contactId: validatedData.contactId,
      title: validatedData.title,
      value: validatedData.value.toString(),
      stage: validatedData.stage || "prospecting",
      probability: validatedData.probability || 0,
      expectedCloseDate: validatedData.expectedCloseDate ? new Date(validatedData.expectedCloseDate) : null,
      notes: validatedData.notes,
    });

    return c.json({
      success: true,
      message: `Deal "${validatedData.title}" worth $${validatedData.value} has been created.`,
    }, 201);
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to create deal" }, 500);
  }
});

app.patch("/deals/:id", zValidator("json", createDealSchema.partial()), async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const validatedData = c.req.valid("json");

    const updateData: Record<string, string | number | Date | null | undefined> = {};
    if (validatedData.contactId !== undefined) updateData.contactId = validatedData.contactId;
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.value !== undefined) updateData.value = validatedData.value.toString();
    if (validatedData.stage !== undefined) updateData.stage = validatedData.stage;
    if (validatedData.probability !== undefined) updateData.probability = validatedData.probability;
    if (validatedData.expectedCloseDate !== undefined) updateData.expectedCloseDate = validatedData.expectedCloseDate ? new Date(validatedData.expectedCloseDate) : null;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes;

    await db.update(deals).set(updateData).where(eq(deals.id, id));

    return c.json({
      success: true,
      message: `Deal updated successfully.`,
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to update deal" }, 500);
  }
});

app.delete("/deals/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    await db.delete(deals).where(eq(deals.id, id));
    return c.json({ success: true, message: "Deal deleted successfully" });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to delete deal" }, 500);
  }
});

// Users endpoint
app.get("/users", async (c) => {
  try {
    const allUsers = await db.select().from(users);
    return c.json(allUsers);
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

app.post("/users", zValidator("json", z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["rep", "manager", "admin"]).optional(),
})), async (c) => {
  try {
    const validatedData = c.req.valid("json");
    await db.insert(users).values(validatedData);
    return c.json({ success: true, message: "User created successfully" }, 201);
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

app.patch("/users/:id", zValidator("json", z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  role: z.enum(["rep", "manager", "admin"]).optional(),
})), async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const validatedData = c.req.valid("json");
    await db.update(users).set(validatedData).where(eq(users.id, id));
    return c.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to update user" }, 500);
  }
});

app.delete("/users/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    await db.delete(users).where(eq(users.id, id));
    return c.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to delete user" }, 500);
  }
});

// Activities/Interactions endpoint
app.get("/activities", async (c) => {
  try {
    const activities = await db
      .select({
        id: interactions.id,
        type: interactions.type,
        description: interactions.description,
        outcome: interactions.outcome,
        interactionDate: interactions.interactionDate,
        contactName: contacts.name,
        contactCompany: contacts.company,
        userName: users.name,
      })
      .from(interactions)
      .leftJoin(contacts, eq(interactions.contactId, contacts.id))
      .leftJoin(users, eq(interactions.userId, users.id))
      .orderBy(interactions.interactionDate);

    return c.json(activities);
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to fetch activities" }, 500);
  }
});

app.post("/activities", zValidator("json", z.object({
  contactId: z.number().min(1),
  dealId: z.number().optional(),
  userId: z.number().optional(),
  type: z.enum(["call", "email", "meeting", "note"]),
  description: z.string().optional(),
  outcome: z.enum(["positive", "neutral", "negative"]).optional(),
})), async (c) => {
  try {
    const validatedData = c.req.valid("json");
    await db.insert(interactions).values(validatedData);
    return c.json({ success: true, message: "Activity created successfully" }, 201);
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to create activity" }, 500);
  }
});

app.patch("/activities/:id", zValidator("json", z.object({
  type: z.enum(["call", "email", "meeting", "note"]).optional(),
  description: z.string().optional(),
  outcome: z.enum(["positive", "neutral", "negative"]).optional(),
})), async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const validatedData = c.req.valid("json");
    await db.update(interactions).set(validatedData).where(eq(interactions.id, id));
    return c.json({ success: true, message: "Activity updated successfully" });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to update activity" }, 500);
  }
});

app.delete("/activities/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    await db.delete(interactions).where(eq(interactions.id, id));
    return c.json({ success: true, message: "Activity deleted successfully" });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to delete activity" }, 500);
  }
});
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

app.patch("/tasks/:id", zValidator("json", createTaskSchema.partial()), async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const validatedData = c.req.valid("json");

    await db.update(tasks).set(validatedData).where(eq(tasks.id, id));

    return c.json({
      success: true,
      message: `Task updated successfully.`,
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to update task" }, 500);
  }
});

app.delete("/tasks/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    await db.delete(tasks).where(eq(tasks.id, id));
    return c.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return c.json({ error: "Failed to delete task" }, 500);
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
export const PUT = handle(app);
