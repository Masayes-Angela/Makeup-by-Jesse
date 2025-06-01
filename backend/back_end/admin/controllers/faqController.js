//db table: faqs
import db from '../../db.js';

// Get active FAQs (for public)
export const getActiveFaqs = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM faqs WHERE status = 'ACTIVE' ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all FAQs (admin)
export const getAllFaqs = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM faqs ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new FAQ
export const addFaq = async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) return res.status(400).json({ error: "All fields are required" });

  try {
    const [result] = await db.query(
      "INSERT INTO faqs (question, answer, status) VALUES (?, ?, 'ACTIVE')",
      [question, answer]
    );
    res.status(201).json({ message: "FAQ added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update existing FAQ
export const updateFaq = async (req, res) => {
  const { id } = req.params;
  const { question, answer, status } = req.body;
  try {
    await db.query(
      "UPDATE faqs SET question = ?, answer = ?, status = ? WHERE id = ?",
      [question, answer, status, id]
    );
    res.json({ message: "FAQ updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deactivate FAQ
export const deactivateFaq = async (req, res) => {
  try {
    await db.query("UPDATE faqs SET status = 'INACTIVE' WHERE id = ?", [req.params.id]);
    res.json({ message: "FAQ deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
