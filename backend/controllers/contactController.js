const db = require("../config/db");

async function createMessage(req, res) {
  try {
    const { sender_name, sender_email, subject, message } = req.body;
    if (!sender_name || !sender_email || !subject || !message) {
      return res.status(400).json({ message: "All contact fields are required" });
    }
    const [result] = await db.execute(
      "INSERT INTO contact_messages (sender_name, sender_email, subject, message) VALUES (?, ?, ?, ?)",
      [sender_name.trim(), sender_email.trim().toLowerCase(), subject.trim(), message.trim()]
    );
    res.status(201).json({ message: "Your message has been received", message_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not save contact message" });
  }
}

module.exports = { createMessage };
