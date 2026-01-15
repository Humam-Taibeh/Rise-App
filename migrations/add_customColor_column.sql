-- Migration: Add customColor column to user_settings table if it doesn't exist
-- This migration adds support for storing custom theme colors

-- Check if column exists and add it if not
ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS customColor TEXT DEFAULT '#dc2626';

-- Update existing records with default value if customColor is NULL
UPDATE user_settings 
SET customColor = '#dc2626' 
WHERE customColor IS NULL;
