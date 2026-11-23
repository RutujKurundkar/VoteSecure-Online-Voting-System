# VoteSecure — Online Voting Management System

## Overview

**VoteSecure** is a full-stack web-based Online Voting Management System built using **React (Vite)**, **Node.js (Express)**, and **MySQL**. It provides a secure, role-separated digital election platform featuring dedicated **Voter** and **Admin** authentication, age-eligibility verification (18+), real-time election lifecycle management, single-vote enforcement, and automated result publication.

This project demonstrates end-to-end full-stack engineering, RESTful API design, JWT-based role authorization, and relational database integrity constraints for academic and educational applications.

---

## Features

- **Separate Voter & Admin Login:** Dedicated login interfaces validated against backend MySQL user roles (`VOTER` / `ADMIN`).
- **Secure Authentication:** Password hashing with **bcrypt** and stateless session management using **JSON Web Tokens (JWT)**.
- **Age & Eligibility Enforcement:** Blocks underage users (< 18 years) during registration, login, and vote submission; restricts voting strictly to admin-approved eligible voters.
- **One-Vote-Per-Election Integrity:** Enforced via both server-side validation and unique database constraints to prevent duplicate voting.
- **Complete Admin Dashboard:**
  - Create, edit, and delete elections (protected against deletion if votes exist).
  - Manage election lifecycle states (`UPCOMING` → `ACTIVE` → `COMPLETED`).
  - Create political parties and add, edit, or remove candidates.
  - Bulk-assign all active registered voters as eligible for an election.
  - Publish official election results upon completion.
- **Voter Dashboard & Profile Management:** View eligible active elections, cast votes securely, inspect voting history, and update personal profile details (name, 10-digit mobile number, date of birth).
- **Public Transparency & Contact:** Publicly accessible active election listings, published results portal, and contact inquiry module.

---

## Technologies Used

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, CSS3 | Responsive user interface, dashboards, and client-side routing |
| **Backend** | Node.js, Express.js | RESTful APIs, business logic, and role-based middleware |
| **Database** | MySQL | Relational data storage, foreign keys, and unique vote constraints |
| **Security** | bcrypt, JSON Web Tokens (JWT) | Password encryption and role-verified API authentication |

---

## Working Principle & System Workflow

1. **Registration & Age Verification:** Users register as `VOTER` accounts with a valid 10-digit mobile number and date of birth; users under 18 are automatically rejected.
2. **Role-Separated Authentication:** Users sign in via either **Voter Login** or **Admin Login**, where the backend verifies credentials and issues a role-scoped JWT.
3. **Election Configuration (Admin):** The administrator creates an election window, registers parties/candidates, sets the status to `ACTIVE`, and grants eligibility to active voters.
4. **Ballot Casting (Voter):** Eligible voters view active elections within the valid start/end timestamps and submit a single ballot; database unique constraints block repeat attempts.
5. **Result Publication (Admin):** Once the voting window closes, the administrator marks the election `COMPLETED` and publishes verified candidate vote counts to the public results page.

---

## Installation and Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **MySQL Server & MySQL Workbench**
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com
cd VoteSecure-Online-Voting-System
```

### 2. MySQL Database Setup
1. Open **MySQL Workbench** and execute `database/schema.sql` to create the `votesecure` database and tables.
2. *(Optional)* Execute `database/sample_data.sql` to populate demo parties.
3. *(If upgrading an older database)* Run `database/add_voter_personal_info.sql` once.
4. Verify the setup:
   ```sql
   USE votesecure;
   SHOW TABLES;
   ```

### 3. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file inside `backend/` (using `.env.example` as a template) with your MySQL credentials and a strong random `JWT_SECRET`, then start the server:
```bash
npm run dev
```
Verify the API health endpoint at `http://localhost:5000/api/health` — it should return `{ "ok": true, ... }`.

### 4. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open the application in your browser at `http://localhost:5173`.

---

## Creating an Admin Account

Public registration intentionally creates `VOTER` accounts only to prevent privilege escalation. To configure an administrator:

1. Register a standard account through the website's registration page.
2. Open **MySQL Workbench** and run `database/make_existing_user_admin.sql` (or execute the query below using your registered email):
   ```sql
   USE votesecure;
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-own-email@example.com';
   SELECT user_id, full_name, email, role FROM users;
   ```
3. Log out and sign back in via **Admin Login** so the updated JWT includes the `ADMIN` role.

---

## Project Structure

```text
VoteSecure-Online-Voting-System/
│
├── frontend/          # React + Vite client application (pages, components, API services)
├── backend/           # Node.js + Express REST API, auth/role middleware, database models
├── database/          # MySQL schema, sample seed data, and admin/migration SQL scripts
└── README.md          # Project documentation and setup instructions
```

---

## Applications

- University student council and departmental elections.
- Organizational, club, or housing society internal polls.
- Academic demonstration of Role-Based Access Control (RBAC) and transactional database integrity.

---

## Challenges Faced

- Enforcing strict multi-layer age (18+) and election time-window validation across both frontend forms and backend APIs.
- Preventing duplicate vote submissions under concurrent requests using relational unique constraints.
- Designing clean role separation so public users cannot self-assign administrative privileges.
- Synchronizing election lifecycle states (`UPCOMING`, `ACTIVE`, `COMPLETED`) with real-time timestamps.

---

## Limitations

- Developed as an educational mini-project; not certified or audited for legally binding government elections.
- Stores voter-to-candidate mapping in the `votes` table for audit demonstration rather than cryptographic zero-knowledge ballot anonymity.
- Production deployment would require rate limiting, CSRF protection, automated test suites, and comprehensive audit logging.

---

## Future Improvements

- Cryptographic blind-signature or homomorphic ballot anonymization for secret voting.
- OTP-based email/SMS two-factor authentication (2FA) for voter verification.
- Exportable election audit reports in PDF and CSV formats.
- Real-time live turnout analytics dashboard with WebSockets.
- Automated unit and integration testing suite for voting transactions.

---

## Author

**Rutuj Kurundkar**  
GitHub: [@RutujKurundkar](https://github.com)

---

## License

This project is developed for academic and educational purposes.
