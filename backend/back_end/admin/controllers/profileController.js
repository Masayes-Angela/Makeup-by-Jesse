//db table: admin_profile
import * as fs from "fs";

// GET /profile/:id
export const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("SELECT * FROM admin_profile WHERE id = ?", [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: "Admin not found." });
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json(err);
  }
};

// POST /profile/:id/upload
export const updateProfile = async (req, res) => {
  const { id } = req.params;

  if (!req.body) {
    return res.status(400).json({ error: "Missing form data." });
  }

  const { name, title, description } = req.body;
  const image = req.file ? req.file.path : null;

  let query = "UPDATE admin_profile SET name=?, title=?, description=?";
  let values = [name, title, description];

  if (image) {
    query += ", profile_image=?";
    values.push(image);
  }

  query += " WHERE id=?";
  values.push(id);

  try {
    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Admin not found or no change made." });
    }
    res.json({ message: "Profile updated." });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createProfile = async (req, res) => {
  try {
    const { name, title, description } = req.body;
    const image = req.file ? req.file.path : null;

    const [result] = await db.query(
      "INSERT INTO admin_profile (name, title, description, profile_image) VALUES (?, ?, ?, ?)",
      [name, title, description, image]
    );

    res.status(201).json({
      message: "Admin profile created.",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
