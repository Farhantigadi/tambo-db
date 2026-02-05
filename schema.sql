CREATE DATABASE IF NOT EXISTS root1;
USE root1;

-- Enhanced contacts table
CREATE TABLE contacts (
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
);

-- New users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role ENUM('rep', 'manager', 'admin') DEFAULT 'rep',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- New deals table
CREATE TABLE deals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contact_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  stage ENUM('prospecting', 'qualification', 'negotiation', 'closed_won', 'closed_lost') DEFAULT 'prospecting',
  probability INT DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

-- Tasks/reminders table
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contact_id INT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATETIME,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

-- Enhanced interactions table
CREATE TABLE interactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contact_id INT NOT NULL,
  deal_id INT,
  user_id INT,
  type ENUM('call', 'email', 'meeting', 'note') NOT NULL,
  description TEXT,
  outcome ENUM('positive', 'neutral', 'negative'),
  interaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Sample data
INSERT INTO contacts (name, email, phone, company, position, status, last_contact_date) VALUES
('John Doe', 'john@microsoft.com', '+1-555-0101', 'Microsoft', 'Senior Developer', 'customer', '2024-01-15'),
('Jane Smith', 'jane@tesla.com', '+1-555-0102', 'Tesla', 'Product Manager', 'prospect', '2024-01-20'),
('Bob Wilson', 'bob@google.com', '+1-555-0103', 'Google', 'Engineering Lead', 'active', '2024-02-01'),
('Alice Brown', 'alice@apple.com', '+1-555-0104', 'Apple', 'Designer', 'prospect', '2023-12-10');

INSERT INTO users (name, email, role) VALUES
('Sarah Johnson', 'sarah@crm.local', 'rep'),
('Mike Rodriguez', 'mike@crm.local', 'manager');

INSERT INTO deals (contact_id, title, value, stage, probability, expected_close_date, notes) VALUES
(1, 'Enterprise SaaS License', 50000.00, 'negotiation', 75, '2024-02-28', 'Multi-year deal, awaiting legal review'),
(2, 'Product Integration Pilot', 12500.00, 'qualification', 40, '2024-03-15', 'Initial scoping call completed'),
(3, 'Consulting Services Contract', 35000.00, 'prospecting', 25, '2024-04-01', 'First contact made'),
(4, 'Platform Migration Project', 75000.00, 'closed_won', 100, '2024-01-20', 'Signed contract');

INSERT INTO tasks (contact_id, title, due_date) VALUES
(1, 'Follow up on project proposal', '2024-02-10 10:00:00'),
(2, 'Schedule product demo', '2024-02-08 14:00:00');

INSERT INTO interactions (contact_id, deal_id, user_id, type, description, outcome, interaction_date) VALUES
(1, 1, 1, 'call', 'Discussed licensing terms and pricing', 'positive', '2024-02-05 14:30:00'),
(2, 2, 1, 'email', 'Sent product overview and use case examples', 'neutral', '2024-02-04 10:00:00'),
(3, 3, 2, 'meeting', 'Initial discovery meeting scheduled', 'positive', '2024-02-03 11:00:00');
