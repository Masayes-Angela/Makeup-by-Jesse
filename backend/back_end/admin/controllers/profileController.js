// db table: admin_profile
import db from "../../db.js";
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

// POST /profile
export const createProfile = async (req, res) => {
  try {
    const { name, title, description, email_address, contact_number, address, user_role, password } = req.body;
    const image = req.file ? req.file.path : null;

    const [result] = await db.query(
      `INSERT INTO admin_profile (name, title, description, profile_image, email_address, contact_number, address, user_role, password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, title, description, image, email_address, contact_number, address, user_role, password]
    );

    res.status(201).json({ message: "Admin profile created.", id: result.insertId });
  } catch (err) {
    res.status(500).json(err);
  }
};

// POST /profile/:id/upload
export const updateProfile = async (req, res) => {
  const { id } = req.params;
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

// PUT /profile/:id/settings
export const updateAdminSettings = async (req, res) => {
  const { id } = req.params;
  const {
    email_address,
    contact_number,
    address,
    user_role,
    email_notification,
    booking_confirmation,
    booking_status_changed
  } = req.body;

  try {
    await db.query(
      `UPDATE admin_profile SET 
        email_address = ?, 
        contact_number = ?, 
        address = ?, 
        user_role = ?, 
        email_notification = ?, 
        booking_confirmation = ?, 
        booking_status_changed = ? 
      WHERE id = ?`,
      [
        email_address,
        contact_number,
        address,
        user_role,
        email_notification,
        booking_confirmation,
        booking_status_changed,
        id
      ]
    );

    res.json({ message: "Admin settings updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /profile/:id/password
export const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const [admin] = await db.query("SELECT password FROM admin_profile WHERE id = ?", [id]);
    if (admin.length === 0) return res.status(404).json({ error: "Admin not found." });

    if (currentPassword !== admin[0].password) {
      return res.status(400).json({ error: "Incorrect current password." });
    }

    await db.query("UPDATE admin_profile SET password = ? WHERE id = ?", [newPassword, id]);

    res.json({ message: "Password updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
