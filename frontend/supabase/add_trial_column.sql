-- Run this SQL in your Supabase SQL Editor to update the schema

-- Add the trial_end_date column to the subscriptions table
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS trial_end_date date;

-- Update the comment/documentation for status to include 'trial'
COMMENT ON COLUMN subscriptions.status IS 'Status of the subscription: active, cancelled, or trial';

