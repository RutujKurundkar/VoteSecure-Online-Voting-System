const db = require("../config/db");
async function findByEmail(email) {
  const [rows] = await db.execute("SELECT user_id, full_name, email, mobile, date_of_birth, password_hash, role, account_status FROM users WHERE email = ?", [email]);
  return rows[0] || null;
}
async function createUser({ full_name, email, mobile, date_of_birth, password_hash }) {
  const [result] = await db.execute("INSERT INTO users (full_name, email, mobile, date_of_birth, password_hash, role) VALUES (?, ?, ?, ?, ?, 'VOTER')", [full_name, email, mobile, date_of_birth, password_hash]);
  return result.insertId;
}
async function getProfile(userId) {
  const [rows] = await db.execute("SELECT user_id, full_name, email, mobile, DATE_FORMAT(date_of_birth, '%Y-%m-%d') AS date_of_birth FROM users WHERE user_id=? AND role='VOTER'", [userId]);
  return rows[0] || null;
}
async function updateProfile(userId, { full_name, mobile, date_of_birth }) {
  await db.execute("UPDATE users SET full_name=?, mobile=?, date_of_birth=? WHERE user_id=? AND role='VOTER'", [full_name, mobile, date_of_birth, userId]);
  return getProfile(userId);
}
module.exports = { findByEmail, createUser, getProfile, updateProfile };
