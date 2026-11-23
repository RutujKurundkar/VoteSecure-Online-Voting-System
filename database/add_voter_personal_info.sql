USE votesecure;
ALTER TABLE users ADD COLUMN date_of_birth DATE NULL AFTER mobile;
-- Existing voters must have their correct date_of_birth entered before they can log in.
