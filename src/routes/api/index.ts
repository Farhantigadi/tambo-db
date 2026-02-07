import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '@/db';
import { deals, interactions, contacts, users } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

const api = new Hono();

// Validation schemas
const createDealSchema = z.object({
  contactId: z.number().min(1, 'Contact ID required'),
  title: z.string().min(3, 'Title must be at least 3 chars'),
  value: z.number().positive('Value must be positive'),
  stage: z.enum(['prospecting', 'qualification', 'negotiation', 'closed_won', 'closed_lost']),
  probability: z.number().min(0).max(100).default(0),
  expectedCloseDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

const updateDealSchema = z.object({
  title: z.string().min(3).optional(),
  value: z.number().positive().optional(),
  stage: z.enum(['prospecting', 'qualification', 'negotiation', 'closed_won', 'closed_lost']).optional(),
  probability: z.number().min(0).max(100).optional(),
  expectedCloseDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

const assignContactSchema = z.object({
  contactId: z.number().min(1),
  userId: z.number().min(1),
});

// POST /api/deals - Create new deal
api.post('/deals', async (c) => {
  try {
    const body = await c.req.json();
    const validated = createDealSchema.parse(body);

    // Verify contact exists
    const contact = await db.select().from(contacts).where(eq(contacts.id, validated.contactId)).limit(1);
    if (!contact.length) {
      return c.json({ error: 'Contact not found' }, 404);
    }

    const newDeal = await db.insert(deals).values({
      contactId: validated.contactId,
      title: validated.title,
      value: validated.value,
      stage: validated.stage,
      probability: validated.probability,
      expectedCloseDate: validated.expectedCloseDate ? new Date(validated.expectedCloseDate) : null,
      notes: validated.notes,
    });

    return c.json({ id: newDeal[0].insertId, ...validated }, 201);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return c.json({ error: err.errors[0].message }, 400);
    }
    return c.json({ error: 'Failed to create deal' }, 500);
  }
});

// GET /api/deals - List deals with optional filters
api.get('/deals', async (c) => {
  try {
    const stage = c.req.query('stage');
    const minValue = c.req.query('minValue');
    const maxValue = c.req.query('maxValue');

    let query = db.select({
      id: deals.id,
      title: deals.title,
      value: deals.value,
      stage: deals.stage,
      probability: deals.probability,
      expectedCloseDate: deals.expectedCloseDate,
      notes: deals.notes,
      contactId: deals.contactId,
      createdAt: deals.createdAt,
    }).from(deals);

    const conditions = [];
    if (stage) conditions.push(eq(deals.stage, stage));
    if (minValue) conditions.push(gte(deals.value, parseFloat(minValue)));
    if (maxValue) conditions.push(lte(deals.value, parseFloat(maxValue)));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query;
    return c.json(result);
  } catch {
    return c.json({ error: 'Failed to fetch deals' }, 500);
  }
});

// PUT /api/deals/:id - Update deal
api.put('/deals/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();
    const validated = updateDealSchema.parse(body);

    const existingDeal = await db.select().from(deals).where(eq(deals.id, id)).limit(1);
    if (!existingDeal.length) {
      return c.json({ error: 'Deal not found' }, 404);
    }

    await db.update(deals).set(validated).where(eq(deals.id, id));
    const updated = await db.select().from(deals).where(eq(deals.id, id)).limit(1);

    return c.json(updated[0]);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return c.json({ error: err.errors[0].message }, 400);
    }
    return c.json({ error: 'Failed to update deal' }, 500);
  }
});

// POST /api/assign-contact - Assign contact to user
api.post('/assign-contact', async (c) => {
  try {
    const body = await c.req.json();
    const validated = assignContactSchema.parse(body);

    const [contact, user] = await Promise.all([
      db.select().from(contacts).where(eq(contacts.id, validated.contactId)).limit(1),
      db.select().from(users).where(eq(users.id, validated.userId)).limit(1),
    ]);

    if (!contact.length) return c.json({ error: 'Contact not found' }, 404);
    if (!user.length) return c.json({ error: 'User not found' }, 404);

    // Create interaction record to track assignment
    await db.insert(interactions).values({
      contactId: validated.contactId,
      userId: validated.userId,
      type: 'note',
      description: `Contact assigned to ${user[0].name}`,
      outcome: 'neutral',
    });

    return c.json({ success: true, message: `Contact assigned to ${user[0].name}` });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return c.json({ error: err.errors[0].message }, 400);
    }
    return c.json({ error: 'Failed to assign contact' }, 500);
  }
});

// GET /api/advanced-analytics - Pipeline analytics & forecasting
api.get('/advanced-analytics', async (c) => {
  try {
    const allDeals = await db.select().from(deals);

    // Calculate metrics by stage
    const stageMetrics = {
      prospecting: { count: 0, value: 0, probability: 0 },
      qualification: { count: 0, value: 0, probability: 0 },
      negotiation: { count: 0, value: 0, probability: 0 },
      closed_won: { count: 0, value: 0, probability: 0 },
      closed_lost: { count: 0, value: 0, probability: 0 },
    };

    allDeals.forEach((deal) => {
      const stage = deal.stage;
      stageMetrics[stage].count += 1;
      stageMetrics[stage].value += parseFloat(deal.value.toString());
      stageMetrics[stage].probability += deal.probability || 0;
    });

    // Calculate win rate
    const closedWon = stageMetrics.closed_won.value;
    const closedTotal = stageMetrics.closed_won.value + stageMetrics.closed_lost.value;
    const winRate = closedTotal > 0 ? ((closedWon / closedTotal) * 100).toFixed(2) : 0;

    // Calculate weighted forecast (sum of value * probability for open deals)
    let forecast = 0;
    ['prospecting', 'qualification', 'negotiation'].forEach((stage) => {
      const avgProbability = stageMetrics[stage].count > 0 
        ? stageMetrics[stage].probability / stageMetrics[stage].count 
        : 0;
      forecast += stageMetrics[stage].value * (avgProbability / 100);
    });

    return c.json({
      stageMetrics,
      winRate: parseFloat(winRate),
      forecast: forecast.toFixed(2),
      totalPipeline: allDeals.reduce((sum, d) => sum + parseFloat(d.value.toString()), 0).toFixed(2),
    });
  } catch {
    return c.json({ error: 'Failed to calculate analytics' }, 500);
  }
});

export default api;