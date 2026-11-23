# VoteSecure — Online Voting Management System (expanded mini-project)

Stack: React + Vite, Node.js + Express, MySQL. This is an educational demo project, not a legally valid election system.

## Features implemented in this version
- Voter registration and login with bcrypt password hashing and JWT.
- Role-based admin API access.
- Admin dashboard: create elections, change election status, create parties, add candidates, list voters/elections, assign all active registered voters as eligible, and publish results after marking an election COMPLETED.
- Voter dashboard: list currently active elections, check eligibility, load candidates, cast one vote per election, and view voting history.
- Server-side checks: election must be active and within its start/end times; voter must be eligible; candidate must belong to the selected election; unique database constraint prevents a second vote.
- Public active elections and published results pages; contact messages.

## 1. MySQL setup
1. Open MySQL Workbench and run `database/schema.sql`.
2. Optionally run `database/sample_data.sql` to add demo parties.
3. Confirm `USE votesecure; SHOW TABLES;` lists all tables.

## 2. Backend setup
```bash
cd backend
npm install
```
Copy `.env.example` to `.env`, then set the actual MySQL password and a long random JWT secret. Do not commit `.env` or share your password.
```bash
npm run dev
```
Check `http://localhost:5000/api/health`; it should return `{ "ok": true, ... }` if the database connection works.

## 3. Frontend setup
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL, normally `http://localhost:5173`.

## 4. Create an admin account (important)
Registration intentionally creates VOTER accounts only. First register a normal account using the website. In MySQL Workbench, promote that account to admin using its email:
```sql
USE votesecure;
UPDATE users SET role='ADMIN' WHERE email='your-own-email@example.com';
SELECT user_id, full_name, email, role FROM users;
```
Then log out and log back in so the new JWT includes the ADMIN role. Never let public registration choose its own ADMIN role.

## 5. Demo workflow
1. Log in as ADMIN.
2. Create an election with start time in the past and end time in the future (for an immediate local demo).
3. Add at least two parties if desired, then add at least two candidates to that election.
4. In Election Management, set status to `ACTIVE`.
5. Click **Make all active voters eligible** for that election.
6. Log out, register/log in as a VOTER, and open Dashboard. The election should show as eligible.
7. Cast a vote. Try voting again; the backend should reject the duplicate.
8. As ADMIN, change status to `COMPLETED`, then click **Publish results**. The Results page should display candidate vote counts.

## Important notes / limitations
- The app is a student mini-project and has not undergone a formal security audit.
- This demo stores the voter-to-candidate association in `votes`; it does not provide a secret/anonymous ballot architecture.
- Status and timestamps both matter: an election is voteable only when its status is ACTIVE and current time is between start and end.
- Before a real deployment, add stronger admin controls, audit logging, rate limiting, CSRF/session considerations as applicable, backup/recovery, accessibility checks, automated tests, and independent security review.

## Team split suggestion
- Member 1: React pages, responsive UI, API integration and test screenshots.
- Member 2: Auth, role middleware, election/candidate/eligibility APIs.
- Member 3: MySQL schema, voting transaction tests, result publication, README/demo test plan.

## Basic CRUD added
- Election: Add and View were already available. Admin can now Edit the election name/description and Delete an election if it has no votes.
- Candidate: Add and View were already available. Admin can now Edit or Delete a candidate if that candidate has no votes.
- Candidate Edit/Delete: Open Admin Dashboard > an election > `Edit/Delete Candidate`, then enter the candidate ID shown in the list and choose E or D.
- Election Edit/Delete: Use the buttons on each election card.
- These are intentionally simple prompt-based controls to keep the project beginner-friendly.

Run backend and frontend using the existing instructions above. No database schema change is required.


## Voter personal information and age rule
- Voter registration now requires a 10-digit mobile number and date of birth.
- Voters under 18 are blocked during registration and login. The backend also checks age when a vote is submitted.
- Logged-in voters can open **My Profile** to update their name, mobile number and date of birth. Email is read-only.
- For an existing database, run `database/add_voter_personal_info.sql` once in MySQL. Existing voter rows will have a NULL date of birth; update each existing voter's date_of_birth and mobile before they can log in.


## Separate Admin and Voter Login
- Login page now has separate **Voter Login** and **Admin Login** choices.
- The selected login type is checked by the backend against the account role in MySQL. Choosing Admin Login does not make a voter an admin.
- Public registration always creates a `VOTER` account. There is no public Admin Registration.
- To create an admin: first register the trusted account normally, then edit `database/make_existing_user_admin.sql` and set the exact registered email. Run that SQL once in MySQL.
- Admin APIs are also protected by backend authentication and the `ADMIN` role middleware.

**Security note:** Use a strong password for the admin account and do not share its credentials.
