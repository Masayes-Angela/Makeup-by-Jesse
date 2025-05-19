import db from "../../db.js";

// Save a new message from contact form
export const sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name, email, subject, message]
    );
    res.status(201).json({ message: "Message sent successfully!", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};