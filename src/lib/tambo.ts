/* eslint-disable */
import { z } from "zod";
import { 
  ContactList, 
  ContactCard, 
  TaskManager, 
  AnalyticsDashboard,
  DealPipeline,
  DealCard,
  ActivityTimeline,
  TeamDashboard,
  PipelineFunnel,
  ContactListPropsSchema,
  ContactCardSchema,
  TaskManagerSchema,
  AnalyticsDashboardSchema,
  DealPipelineSchema,
  DealCardSchema,
  ActivityTimelineSchema,
  TeamDashboardSchema,
  PipelineFunnelSchema
} from "../components/tambo";

export const tamboComponents = [
  {
    name: "ContactList",
    description: "A clean, scannable list of multiple contacts with avatars, company badges, and email buttons. Use this when displaying search results or multiple contacts.",
    component: ContactList,
    propsSchema: ContactListPropsSchema,
  },
  {
    name: "ContactCard",
    description: "Display contacts in different view formats - card, table, or compact view. Choose based on user preference or data density needs.",
    component: ContactCard,
    propsSchema: ContactCardSchema,
  },
  {
    name: "TaskManager",
    description: "Show tasks and reminders with completion status. Use when user asks about tasks, reminders, or follow-ups.",
    component: TaskManager,
    propsSchema: TaskManagerSchema,
  },
  {
    name: "AnalyticsDashboard",
    description: "Display CRM analytics, statistics, and insights. Use when user asks for reports, analytics, or overview of their data.",
    component: AnalyticsDashboard,
    propsSchema: AnalyticsDashboardSchema,
  },
  {
    name: "DealPipeline",
    description: "Interactive Kanban board showing deals across sales stages. Use when user wants to see pipeline, move deals between stages, or manage sales workflow. Shows drag-and-drop interface.",
    component: DealPipeline,
    propsSchema: DealPipelineSchema,
  },
  {
    name: "DealCard",
    description: "Display individual deal details with editable fields and multiple view options (detail, compact, mini-chart). Use for showing specific deal information or when user wants to edit deal data.",
    component: DealCard,
    propsSchema: DealCardSchema,
  },
  {
    name: "ActivityTimeline",
    description: "Chronological feed of interactions, calls, meetings, and notes. Use when user asks about activity history, recent interactions, or wants to see communication timeline.",
    component: ActivityTimeline,
    propsSchema: ActivityTimelineSchema,
  },
  {
    name: "TeamDashboard",
    description: "Team performance metrics, leaderboard, and individual stats. Use when user asks about team performance, sales rep stats, or wants to see team rankings.",
    component: TeamDashboard,
    propsSchema: TeamDashboardSchema,
  },
  {
    name: "PipelineFunnel",
    description: "Visual funnel chart showing conversion rates between sales stages. Use when user asks for funnel analysis, conversion metrics, or stage drop-off insights.",
    component: PipelineFunnel,
    propsSchema: PipelineFunnelSchema,
  },
];

// Enhanced schemas
const addContactSchema = z.object({
  name: z.string().describe("The full name of the contact person"),
  email: z.string().email().describe("The professional email address of the contact"),
  phone: z.string().optional().describe("Phone number of the contact"),
  company: z.string().optional().describe("The company or organization the contact works for"),
  position: z.string().optional().describe("Job title or position of the contact"),
  notes: z.string().optional().describe("Additional notes or comments about the contact"),
  status: z.enum(["active", "inactive", "prospect", "customer"]).optional().describe("Contact status"),
});

const searchContactsSchema = z.object({
  query: z.string().optional().describe("Search term to find contacts by name"),
  company: z.string().optional().describe("Filter by company name"),
  status: z.string().optional().describe("Filter by contact status"),
  inactive_days: z.string().optional().describe("Find contacts not contacted in X days"),
});

const createTaskSchema = z.object({
  contactId: z.number().optional().describe("ID of related contact"),
  title: z.string().describe("Task title or description"),
  description: z.string().optional().describe("Detailed task description"),
  dueDate: z.string().optional().describe("Due date in YYYY-MM-DD format"),
});

const addDealSchema = z.object({
  contactId: z.number().describe("ID of the contact this deal is associated with"),
  title: z.string().describe("Deal title or name"),
  value: z.number().describe("Deal value in dollars"),
  stage: z.enum(["prospecting", "qualification", "negotiation", "closed_won", "closed_lost"]).optional().describe("Deal stage"),
  probability: z.number().min(0).max(100).optional().describe("Win probability percentage"),
  expectedCloseDate: z.string().optional().describe("Expected close date in YYYY-MM-DD format"),
  notes: z.string().optional().describe("Deal notes"),
});

const updateDealSchema = z.object({
  id: z.number().describe("Deal ID to update"),
  title: z.string().optional().describe("Deal title"),
  value: z.number().optional().describe("Deal value"),
  stage: z.enum(["prospecting", "qualification", "negotiation", "closed_won", "closed_lost"]).optional().describe("Deal stage"),
  probability: z.number().min(0).max(100).optional().describe("Win probability percentage"),
  expectedCloseDate: z.string().optional().describe("Expected close date"),
  notes: z.string().optional().describe("Deal notes"),
});

const searchDealsSchema = z.object({
  stage: z.string().optional().describe("Filter by deal stage"),
  contactId: z.number().optional().describe("Filter by contact ID"),
  minValue: z.number().optional().describe("Minimum deal value"),
  maxValue: z.number().optional().describe("Maximum deal value"),
});

const addInteractionSchema = z.object({
  contactId: z.number().describe("Contact ID for this interaction"),
  dealId: z.number().optional().describe("Deal ID if related to a deal"),
  type: z.enum(["call", "email", "meeting", "note"]).describe("Type of interaction"),
  description: z.string().describe("Description of the interaction"),
  outcome: z.enum(["positive", "neutral", "negative"]).optional().describe("Outcome of the interaction"),
});

const getTeamSchema = z.object({
  include_stats: z.boolean().optional().describe("Include performance statistics"),
});

export const tamboTools = [
  {
    name: "add_contact",
    description: "Saves a new person or business contact to the local database. Extract name, email, company, phone, and other details from the user's message.",
    tool: async (params: z.infer<typeof addContactSchema>) => {
      try {
        const response = await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });
        const result = await response.json();
        return { success: response.ok, ...result };
      } catch (error) {
        return { success: false, error: "Failed to save contact" };
      }
    },
    inputSchema: addContactSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string().optional(), error: z.string().optional() }),
  },
  {
    name: "search_contacts",
    description: "Search and filter contacts by name, company, status, or inactivity period. Use for finding specific contacts or groups.",
    tool: async (params: z.infer<typeof searchContactsSchema>) => {
      try {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
        
        const response = await fetch(`/api/contacts?${queryParams.toString()}`);
        const contacts = await response.json();
        return { success: response.ok, contacts };
      } catch (error) {
        return { success: false, error: "Failed to search contacts" };
      }
    },
    inputSchema: searchContactsSchema,
    outputSchema: z.object({ success: z.boolean(), contacts: z.array(z.any()).optional(), error: z.string().optional() }),
  },
  {
    name: "create_task",
    description: "Create a new task or reminder, optionally linked to a contact. Use when user wants to set reminders or create follow-up tasks.",
    tool: async (params: z.infer<typeof createTaskSchema>) => {
      try {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });
        const result = await response.json();
        return { success: response.ok, ...result };
      } catch (error) {
        return { success: false, error: "Failed to create task" };
      }
    },
    inputSchema: createTaskSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string().optional(), error: z.string().optional() }),
  },
  {
    name: "get_tasks",
    description: "Retrieve all tasks and reminders with their completion status. Use when user asks about tasks, reminders, or what they need to do.",
    tool: async () => {
      try {
        const response = await fetch("/api/tasks");
        const tasks = await response.json();
        return { success: response.ok, tasks };
      } catch (error) {
        return { success: false, error: "Failed to fetch tasks" };
      }
    },
    inputSchema: z.object({}),
    outputSchema: z.object({ success: z.boolean(), tasks: z.array(z.any()).optional(), error: z.string().optional() }),
  },
  {
    name: "get_analytics",
    description: "Get CRM analytics including contact counts, task statistics, and top companies. Use when user asks for reports, statistics, or overview.",
    tool: async () => {
      try {
        const response = await fetch("/api/analytics");
        const analytics = await response.json();
        return { success: response.ok, ...analytics };
      } catch (error) {
        return { success: false, error: "Failed to fetch analytics" };
      }
    },
    inputSchema: z.object({}),
    outputSchema: z.object({ 
      success: z.boolean(), 
      stats: z.object({
        totalContacts: z.number(),
        activeContacts: z.number(),
        prospects: z.number(),
        customers: z.number(),
        pendingTasks: z.number(),
        overdueTasks: z.number(),
      }).optional(),
      topCompanies: z.array(z.object({ company: z.string(), count: z.number() })).optional(),
      error: z.string().optional() 
    }),
  },
  {
    name: "add_deal",
    description: "Create a new sales deal associated with a contact. Use when user wants to add a new opportunity or deal to the pipeline.",
    tool: async (params: z.infer<typeof addDealSchema>) => {
      try {
        const response = await fetch("/api/deals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });
        const result = await response.json();
        return { success: response.ok, ...result };
      } catch (error) {
        return { success: false, error: "Failed to create deal" };
      }
    },
    inputSchema: addDealSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string().optional(), error: z.string().optional() }),
  },
  {
    name: "update_deal",
    description: "Update an existing deal's information including stage, value, probability, or notes. Use when user wants to move deals between stages or edit deal details.",
    tool: async (params: z.infer<typeof updateDealSchema>) => {
      try {
        const { id, ...updateData } = params;
        const response = await fetch(`/api/deals/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });
        const result = await response.json();
        return { success: response.ok, ...result };
      } catch (error) {
        return { success: false, error: "Failed to update deal" };
      }
    },
    inputSchema: updateDealSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string().optional(), error: z.string().optional() }),
  },
  {
    name: "search_deals",
    description: "Search and filter deals by stage, contact, value range, or other criteria. Use when user asks about deals, pipeline, or specific opportunities.",
    tool: async (params: z.infer<typeof searchDealsSchema>) => {
      try {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) queryParams.append(key, value.toString());
        });
        
        const response = await fetch(`/api/deals?${queryParams.toString()}`);
        const deals = await response.json();
        return { success: response.ok, deals };
      } catch (error) {
        return { success: false, error: "Failed to search deals" };
      }
    },
    inputSchema: searchDealsSchema,
    outputSchema: z.object({ success: z.boolean(), deals: z.array(z.any()).optional(), error: z.string().optional() }),
  },
  {
    name: "add_interaction",
    description: "Log a new interaction (call, email, meeting, note) with a contact. Use when user wants to record communication or activity.",
    tool: async (params: z.infer<typeof addInteractionSchema>) => {
      try {
        const response = await fetch("/api/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });
        const result = await response.json();
        return { success: response.ok, ...result };
      } catch (error) {
        return { success: false, error: "Failed to add interaction" };
      }
    },
    inputSchema: addInteractionSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string().optional(), error: z.string().optional() }),
  },
  {
    name: "get_activities",
    description: "Get recent activities and interactions timeline. Use when user asks about recent activity, interaction history, or communication timeline.",
    tool: async () => {
      try {
        const response = await fetch(`/api/activities`);
        const activities = await response.json();
        return { success: response.ok, activities };
      } catch (error) {
        return { success: false, error: "Failed to fetch activities" };
      }
    },
    inputSchema: z.object({}),
    outputSchema: z.object({ success: z.boolean(), activities: z.array(z.any()).optional(), error: z.string().optional() }),
  },
  {
    name: "get_team",
    description: "Get team members and their performance statistics. Use when user asks about team, sales reps, performance, or leaderboard.",
    tool: async (params: z.infer<typeof getTeamSchema>) => {
      try {
        const queryParams = new URLSearchParams();
        if (params.include_stats) queryParams.append('include_stats', 'true');
        
        const response = await fetch(`/api/users?${queryParams.toString()}`);
        const team = await response.json();
        return { success: response.ok, team };
      } catch (error) {
        return { success: false, error: "Failed to fetch team data" };
      }
    },
    inputSchema: getTeamSchema,
    outputSchema: z.object({ success: z.boolean(), team: z.array(z.any()).optional(), error: z.string().optional() }),
  },
  {
    name: "get_pipeline_funnel",
    description: "Get pipeline funnel data showing conversion rates between stages. Use when user asks for funnel analysis, conversion metrics, or stage performance.",
    tool: async () => {
      try {
        const response = await fetch("/api/pipeline-funnel");
        const funnel = await response.json();
        return { success: response.ok, ...funnel };
      } catch (error) {
        return { success: false, error: "Failed to fetch pipeline funnel" };
      }
    },
    inputSchema: z.object({}),
    outputSchema: z.object({ success: z.boolean(), stages: z.array(z.any()).optional(), error: z.string().optional() }),
  },
];

export const tamboConfig = {
  components: tamboComponents,
  tools: tamboTools,
};
