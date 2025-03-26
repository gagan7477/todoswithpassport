DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_database WHERE datname = 'todos_test'
    ) THEN
        CREATE DATABASE todos_test;
    END IF;
END
$$;
