import db from "../../db.js";

// CREATE
export const createService = async (req, res) => {
  const { name } = req.body;
  const image = req.file?.filename;

  try {
    const [result] = await db.query(
      "INSERT INTO services (name, image_url, status) VALUES (?, ?, ?)",
      [name, image, "ACTIVE"]
    );
    res.status(201).json({ message: "Service added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
export const fetchAllServices = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM services");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
export const fetchServiceById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM services WHERE id = ?", [req.params.id]);
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const modifyService = async (req, res) => {
  const { name, status } = req.body;
  const image = req.file?.filename;

  try {
    let sql = "UPDATE services SET name = ?, status = ?";
    const params = [name, status, req.params.id];

    if (image) {
      sql = "UPDATE services SET name = ?, image_url = ?, status = ? WHERE id = ?";
      params.splice(1, 0, image); // Insert image
    } else {
      sql += " WHERE id = ?";
    }

    await db.query(sql, params);
    res.json({ message: "Service updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DEACTIVATE
export const deactivateService = async (req, res) => {
  try {
    await db.query("UPDATE services SET status = 'INACTIVE' WHERE id = ?", [req.params.id]);
    res.json({ message: "Service deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REACTIVATE
export const reactivateService = async (req, res) => {
  try {
    await db.query("UPDATE services SET status = 'ACTIVE' WHERE id = ?", [req.params.id]);
    res.json({ message: "Service reactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};