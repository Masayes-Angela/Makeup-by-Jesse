import db from "../../db.js";

// Get contact info (public)
export const getContactInfo = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM contact_info LIMIT 1");
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update contact info (admin)
export const updateContactInfo = async (req, res) => {
  const { phone, email, location, message } = req.body;
  try {
    await db.query(
      "UPDATE contact_info SET phone = ?, email = ?, location = ? WHERE id = 1",
      [phone, email, location]
    );
    res.json({ message: "Contact info updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Add contact info (admin)
export const addContactInfo = async (req, res) => {
  const { phone, email, location, message } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO contact_info (phone, email, location) VALUES (?, ?, ?)",
      [phone, email, location]
    );
    res.status(201).json({ message: "Contact info added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};