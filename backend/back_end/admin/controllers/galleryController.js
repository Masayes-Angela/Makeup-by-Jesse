import db from '../../db.js';

export const uploadImage = async (req, res) => {
  try {
    // Handle missing file
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    const { caption } = req.body;
    const path = req.file.path;
    const uploaded_by = 1; // Jesse's ID

    await db.query(
      "INSERT INTO gallery_images (image_path, caption, uploaded_by) VALUES (?, ?, ?)",
      [path, caption, uploaded_by]
    );

    res.json({ message: "Image uploaded." });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getAllImages = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM gallery_images ORDER BY uploaded_at DESC");
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM gallery_images WHERE id = ?", [id]);
    res.json({ message: "Image deleted." });
  } catch (err) {
    res.status(500).json(err);
  }
};
