import { mysqlTable, int, varchar, text, timestamp, boolean, decimal, enum as mysqlEnum, date, json } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const contacts = mysqlTable('contacts', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 50 }),
  company: varchar({ length: 255 }),
  position: varchar({ length: 255 }),
  notes: text(),
  status: mysqlEnum('status', ['active', 'inactive', 'prospect', 'customer']).default('prospect'),
  lastContactDate: date('last_contact_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const users = mysqlTable('users', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: mysqlEnum('role', ['rep', 'manager', 'admin']).default('rep'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const deals = mysqlTable('deals', {
  id: int().primaryKey().autoincrement(),
  contactId: int('contact_id').notNull().references(() => contacts.id, { onDelete: 'cascade' }),
  title: varchar({ length: 255 }).notNull(),
  value: decimal({ precision: 10, scale: 2 }).notNull(),
  stage: mysqlEnum('stage', ['prospecting', 'qualification', 'negotiation', 'closed_won', 'closed_lost']).default('prospecting'),
  probability: int().default(0),
  expectedCloseDate: date('expected_close_date'),
  notes: text(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const tasks = mysqlTable('tasks', {
  id: int().primaryKey().autoincrement(),
  contactId: int('contact_id').references(() => contacts.id, { onDelete: 'cascade' }),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  dueDate: timestamp('due_date'),
  completed: boolean().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const interactions = mysqlTable('interactions', {
  id: int().primaryKey().autoincrement(),
  contactId: int('contact_id').notNull().references(() => contacts.id, { onDelete: 'cascade' }),
  dealId: int('deal_id').references(() => deals.id, { onDelete: 'set null' }),
  userId: int('user_id').references(() => users.id, { onDelete: 'set null' }),
  type: mysqlEnum('type', ['call', 'email', 'meeting', 'note']).notNull(),
  description: text(),
  outcome: mysqlEnum('outcome', ['positive', 'neutral', 'negative']),
  interactionDate: timestamp('interaction_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const contactsRelations = relations(contacts, ({ many }) => ({
  deals: many(deals),
  interactions: many(interactions),
  tasks: many(tasks),
}));

export const dealsRelations = relations(deals, ({ one, many }) => ({
  contact: one(contacts, { fields: [deals.contactId], references: [contacts.id] }),
  interactions: many(interactions),
}));

export const interactionsRelations = relations(interactions, ({ one }) => ({
  contact: one(contacts, { fields: [interactions.contactId], references: [contacts.id] }),
  deal: one(deals, { fields: [interactions.dealId], references: [deals.id] }),
  user: one(users, { fields: [interactions.userId], references: [users.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  interactions: many(interactions),
}));

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Interaction = typeof interactions.$inferSelect;
export type NewInteraction = typeof interactions.$inferInsert;
