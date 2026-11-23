-- Run only for the trusted account you want to make an administrator.
-- First register that account normally, then replace the email below.
UPDATE users
SET role = 'ADMIN'
WHERE email = 'admin@votesecure.com';

-- Verify the role was changed:
SELECT user_id, full_name, email, role
FROM users
WHERE email = 'admin@votesecure.com';
