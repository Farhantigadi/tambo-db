import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";

const poolConnection = mysql.createPool({
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "tambo_crm",
  port: parseInt(process.env.DATABASE_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(poolConnection, { schema, mode: "default" });

// Initialize database with schema
export async function initDb() {
  const conn = await poolConnection.getConnection();
  try {
    // Create contacts table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        position VARCHAR(255),
        notes TEXT,
        status ENUM('active', 'inactive', 'prospect', 'customer') DEFAULT 'prospect',
        last_contact_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create tasks table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        contact_id INT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date TIMESTAMP NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL
      )
    `);

    // Create deals table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS deals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        contact_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        value DECIMAL(10,2) NOT NULL,
        stage ENUM('prospecting', 'qualification', 'negotiation', 'closed_won', 'closed_lost') DEFAULT 'prospecting',
        probability INT DEFAULT 0,
        expected_close_date DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
      )
    `);

    // Create interactions table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS interactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        contact_id INT NOT NULL,
        deal_id INT,
        user_id INT,
        type ENUM('call', 'email', 'meeting', 'note') NOT NULL,
        description TEXT,
        outcome ENUM('positive', 'neutral', 'negative'),
        interaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
        FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE SET NULL
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    conn.release();
  }
}

// Auto-initialize on import
initDb().catch(console.error);

export { contacts, tasks, interactions, deals, users } from "./schema";
export type { Contact, NewContact, Task, NewTask, Interaction, NewInteraction } from "./schema";
