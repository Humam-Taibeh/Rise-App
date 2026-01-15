-- Migration: Add category and priority columns to tasks table
-- Purpose: Support task categorization and priority levels

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'other';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(user_id, category);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(user_id, priority);
