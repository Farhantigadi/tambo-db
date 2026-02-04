/* eslint-disable */
import { z } from "zod";
import { 
  ContactList, 
  ContactCard, 
  TaskManager, 
  AnalyticsDashboard,
  ContactListPropsSchema,
  ContactCardSchema,
  TaskManagerSchema,
  AnalyticsDashboardSchema
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
];

export const tamboConfig = {
  components: tamboComponents,
  tools: tamboTools,
};
