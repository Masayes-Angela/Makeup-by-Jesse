import db from "../../db.js";

// CREATE
export const addPackage = async (req, res) => {
  const { name, price, description, status } = req.body;
  const image = req.file?.filename || null;

  try {
    const [result] = await db.query(
      "INSERT INTO packages (name, price, description, image_url, status) VALUES (?, ?, ?, ?, ?)",
      [name, price, description, image, status || "ACTIVE"]
    );
    res.status(201).json({ message: "Package added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL (OPTIONAL FILTER ACTIVE)
export const getPackages = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM packages");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
export const getPackageById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM packages WHERE id = ?", [req.params.id]);
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updatePackage = async (req, res) => {
  const { name, price, description, status } = req.body;
  const image = req.file?.filename;

  try {
    let sql = "UPDATE packages SET name = ?, price = ?, description = ?, status = ?";
    const params = [name, price, description, status, req.params.id];

    if (image) {
      sql = "UPDATE packages SET name = ?, price = ?, description = ?, image_url = ?, status = ? WHERE id = ?";
      params.splice(3, 0, image); // insert image in the 4th position
    } else {
      sql += " WHERE id = ?";
    }

    await db.query(sql, params);
    res.json({ message: "Package updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SOFT DELETE (Set status to INACTIVE)
export const deactivatePackage = async (req, res) => {
  try {
    await db.query("UPDATE packages SET status = 'INACTIVE' WHERE id = ?", [req.params.id]);
    res.json({ message: "Package deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RESTORE
export const reactivatePackage = async (req, res) => {
  try {
    await db.query("UPDATE packages SET status = 'ACTIVE' WHERE id = ?", [req.params.id]);
    res.json({ message: "Package reactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};