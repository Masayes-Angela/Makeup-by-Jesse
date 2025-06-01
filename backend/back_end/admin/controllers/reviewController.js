//db table: reviews
import db from "../../db.js";

// Submit a new review (from public form)
export const submitReview = async (req, res) => {
  const { name, message, avatar_url } = req.body;
  if (!name || !message) return res.status(400).json({ error: "Name and message are required." });

  try {
    const [result] = await db.query(
      "INSERT INTO reviews (name, avatar_url, message, status) VALUES (?, ?, ?, 'PENDING')",
      [name, avatar_url || null, message]
    );
    res.status(201).json({ message: "Review submitted for approval", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get published reviews (for display)
export const getPublishedReviews = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM reviews WHERE status = 'PUBLISHED' ORDER BY submitted_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Optional: Admin view of all reviews
export const getAllReviews = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM reviews ORDER BY submitted_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Optional: Approve a review
export const publishReview = async (req, res) => {
  try {
    await db.query("UPDATE reviews SET status = 'PUBLISHED' WHERE id = ?", [req.params.id]);
    res.json({ message: "Review published" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Optional: Hide a review
export const hideReview = async (req, res) => {
  try {
    await db.query("UPDATE reviews SET status = 'HIDDEN' WHERE id = ?", [req.params.id]);
    res.json({ message: "Review hidden" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
