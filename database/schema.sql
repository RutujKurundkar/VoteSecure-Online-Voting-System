CREATE DATABASE IF NOT EXISTS votesecure;
USE votesecure;

CREATE TABLE IF NOT EXISTS users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  mobile VARCHAR(20) NOT NULL UNIQUE,
  date_of_birth DATE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('ADMIN','VOTER') NOT NULL DEFAULT 'VOTER',
  account_status ENUM('PENDING','ACTIVE','BLOCKED') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS elections (
  election_id INT PRIMARY KEY AUTO_INCREMENT,
  election_name VARCHAR(150) NOT NULL,
  description TEXT,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  election_status ENUM('SCHEDULED','ACTIVE','COMPLETED') NOT NULL DEFAULT 'SCHEDULED',
  results_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_elections_creator FOREIGN KEY (created_by) REFERENCES users(user_id),
  CONSTRAINT chk_election_dates CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS parties (
  party_id INT PRIMARY KEY AUTO_INCREMENT,
  party_name VARCHAR(100) NOT NULL UNIQUE,
  party_symbol VARCHAR(100),
  party_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS candidates (
  candidate_id INT PRIMARY KEY AUTO_INCREMENT,
  election_id INT NOT NULL,
  party_id INT NULL,
  candidate_name VARCHAR(100) NOT NULL,
  candidate_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_election_candidate (election_id, candidate_id),
  UNIQUE KEY uq_election_party (election_id, party_id),
  CONSTRAINT fk_candidates_election FOREIGN KEY (election_id) REFERENCES elections(election_id),
  CONSTRAINT fk_candidates_party FOREIGN KEY (party_id) REFERENCES parties(party_id)
);

CREATE TABLE IF NOT EXISTS election_eligibility (
  election_id INT NOT NULL,
  voter_id INT NOT NULL,
  eligibility_status ENUM('ELIGIBLE','SUSPENDED') NOT NULL DEFAULT 'ELIGIBLE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (election_id, voter_id),
  CONSTRAINT fk_eligibility_election FOREIGN KEY (election_id) REFERENCES elections(election_id),
  CONSTRAINT fk_eligibility_voter FOREIGN KEY (voter_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS votes (
  vote_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  election_id INT NOT NULL,
  voter_id INT NOT NULL,
  candidate_id INT NOT NULL,
  voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_one_vote_per_election (election_id, voter_id),
  CONSTRAINT fk_votes_eligibility FOREIGN KEY (election_id, voter_id)
    REFERENCES election_eligibility(election_id, voter_id),
  CONSTRAINT fk_votes_candidate FOREIGN KEY (election_id, candidate_id)
    REFERENCES candidates(election_id, candidate_id)
);

CREATE TABLE IF NOT EXISTS contact_messages (
  message_id INT PRIMARY KEY AUTO_INCREMENT,
  sender_name VARCHAR(100) NOT NULL,
  sender_email VARCHAR(150) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  message_status ENUM('NEW','READ','RESOLVED') NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidates_election ON candidates(election_id);
CREATE INDEX idx_votes_candidate ON votes(election_id, candidate_id);
CREATE INDEX idx_elections_status ON elections(election_status);
CREATE INDEX idx_users_role ON users(role);
