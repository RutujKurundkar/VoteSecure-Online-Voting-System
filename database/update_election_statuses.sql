USE votesecure;
-- Remove Draft and Cancelled. Election status will be calculated from start_time/end_time.
UPDATE elections
SET election_status = CASE
  WHEN NOW() < start_time THEN 'SCHEDULED'
  WHEN NOW() >= end_time THEN 'COMPLETED'
  ELSE 'ACTIVE'
END;
ALTER TABLE elections
  MODIFY election_status ENUM('SCHEDULED','ACTIVE','COMPLETED') NOT NULL DEFAULT 'SCHEDULED';
