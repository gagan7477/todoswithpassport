-- Drop the NOT NULL constraint from password_hash column
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Add a check constraint to ensure password is required for local auth
ALTER TABLE users ADD CONSTRAINT check_password_required 
CHECK (
    (auth_provider = 'local' AND password_hash IS NOT NULL) OR 
    (auth_provider != 'local')
);
