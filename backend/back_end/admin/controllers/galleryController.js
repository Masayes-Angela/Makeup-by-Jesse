import db from "../../db.js";

// Add new gallery photo
export const addGalleryPhoto = async (req, res) => {
  try {
    const { image_url, caption, status } = req.body;
    const [result] = await db.query(
      "INSERT INTO gallery (image_url, caption, status) VALUES (?, ?, ?)",
      [image_url, caption, status || 'ACTIVE']
    );
    res.status(201).json({ message: "Photo added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get active photos for carousel
export const getActivePhotos = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM gallery WHERE status = 'ACTIVE' ORDER BY uploaded_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all photos (admin view)
export const getAllGalleryPhotos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM gallery ORDER BY uploaded_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deactivate photo (soft delete)
export const deactivateGalleryPhoto = async (req, res) => {
  try {
    await db.query("UPDATE gallery SET status = 'INACTIVE' WHERE id = ?", [req.params.id]);
    res.json({ message: "Photo deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Restore photo
export const reactivateGalleryPhoto = async (req, res) => {
  try {
    await db.query("UPDATE gallery SET status = 'ACTIVE' WHERE id = ?", [req.params.id]);
    res.json({ message: "Photo reactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};