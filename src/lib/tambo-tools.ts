import { z } from 'zod';

export const tamboTools = [
  {
    name: 'add_deal',
    description: 'Create a new sales deal linked to a contact. Use after add_contact to build a complete sales pipeline.',
    inputSchema: z.object({
      contactId: z.number().describe('ID of the contact for this deal'),
      title: z.string().describe('Deal title (e.g., "Enterprise License")'),
      value: z.number().describe('Deal value in USD'),
      stage: z.enum(['prospecting', 'qualification', 'negotiation', 'closed_won', 'closed_lost']).describe('Current deal stage'),
      probability: z.number().min(0).max(100).optional().describe('Win probability (0-100)'),
      expectedCloseDate: z.string().optional().describe('Expected close date (YYYY-MM-DD)'),
      notes: z.string().optional().describe('Internal deal notes'),
    }),
  },
  {
    name: 'update_deal',
    description: 'Update an existing deal stage, value, or probability. Critical for pipeline management.',
    inputSchema: z.object({
      dealId: z.number().describe('ID of the deal to update'),
      stage: z.enum(['prospecting', 'qualification', 'negotiation', 'closed_won', 'closed_lost']).optional().describe('New stage'),
      probability: z.number().min(0).max(100).optional().describe('Updated win probability'),
      value: z.number().positive().optional().describe('Updated deal value'),
      notes: z.string().optional().describe('Add notes or update existing'),
    }),
  },
  {
    name: 'search_deals',
    description: 'Search and filter deals by stage or value range. Use to identify high-value opportunities or stalled deals.',
    inputSchema: z.object({
      stage: z.enum(['prospecting', 'qualification', 'negotiation', 'closed_won', 'closed_lost']).optional().describe('Filter by stage'),
      minValue: z.number().optional().describe('Minimum deal value'),
      maxValue: z.number().optional().describe('Maximum deal value'),
    }),
  },
  {
    name: 'assign_contact',
    description: 'Assign a contact to a sales rep or manager for follow-up. Creates audit trail.',
    inputSchema: z.object({
      contactId: z.number().describe('Contact ID to assign'),
      userId: z.number().describe('User ID of rep/manager to assign to'),
    }),
  },
  {
    name: 'get_pipeline_forecast',
    description: 'Get revenue forecast, win rates, and stage breakdowns. Analytics for leadership.',
    inputSchema: z.object({}).strict(),
  },
];
