import { mysqlTable, varchar, int, text, mysqlEnum, date, timestamp, boolean } from "drizzle-orm/mysql-core";

export const contacts = mysqlTable("contacts", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  position: varchar("position", { length: 255 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["active", "inactive", "prospect", "customer"]).default("prospect"),
  lastContactDate: date("last_contact_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const tasks = mysqlTable("tasks", {
  id: int("id").primaryKey().autoincrement(),
  contactId: int("contact_id").references(() => contacts.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const interactions = mysqlTable("interactions", {
  id: int("id").primaryKey().autoincrement(),
  contactId: int("contact_id").references(() => contacts.id),
  type: mysqlEnum("type", ["call", "email", "meeting", "note"]).notNull(),
  description: text("description"),
  interactionDate: timestamp("interaction_date").defaultNow(),
});

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Interaction = typeof interactions.$inferSelect;
export type NewInteraction = typeof interactions.$inferInsert;
