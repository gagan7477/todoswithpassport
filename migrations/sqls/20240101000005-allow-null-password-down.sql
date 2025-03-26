-- Remove the check constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS check_password_required;

-- Add back the NOT NULL constraint
ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;
