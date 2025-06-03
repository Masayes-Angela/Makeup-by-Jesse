//db table: packages
import db from "../../db.js"
import fs from "fs"
import path from "path"

const uploadsDir = "C:\\Users\\princ\\OneDrive\\AppData\\Desktop\\MakeUp by Jesse\\Makeup-by-Jesse\\backend\\uploads\\packages"

// CREATE
export const addPackage = async (req, res) => {
  try {
    const { name, description } = req.body
    const image = req.file ? `/uploads/packages/${req.file.filename}` : null

    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required" })
    }

    const [result] = await db.query(
      "INSERT INTO packages (name, description, image_url, status) VALUES (?, ?, ?, ?)",
      [name, description, image, "ACTIVE"]
    )

    res.status(201).json({
      message: "Package added successfully",
      id: result.insertId,
      package: {
        id: result.insertId,
        name,
        description,
        image_url: image,
        status: "ACTIVE",
      },
    })
  } catch (err) {
    console.error("Error creating package:", err)
    res.status(500).json({ error: err.message })
  }
}

// READ ALL
export const getPackages = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM packages")
    res.json(rows)
  } catch (err) {
    console.error("Error fetching packages:", err)
    res.status(500).json({ error: err.message })
  }
}

// READ ONE
export const getPackageById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM packages WHERE id = ?", [req.params.id])

    if (rows.length === 0) {
      return res.status(404).json({ message: "Package not found" })
    }

    res.json(rows[0])
  } catch (err) {
    console.error("Error fetching package:", err)
    res.status(500).json({ error: err.message })
  }
}

// UPDATE
export const updatePackage = async (req, res) => {
  try {
    const { name, description, status } = req.body
    const image = req.file ? `/uploads/packages/${req.file.filename}` : null

    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required" })
    }

    const [existingPackage] = await db.query("SELECT * FROM packages WHERE id = ?", [req.params.id])

    if (existingPackage.length === 0) {
      return res.status(404).json({ message: "Package not found" })
    }

    let sql = "UPDATE packages SET name = ?, description = ?, status = ?"
    const params = [name, description, status || existingPackage[0].status, req.params.id]

    if (image) {
      sql = "UPDATE packages SET name = ?, description = ?, image_url = ?, status = ? WHERE id = ?"
      params.splice(2, 0, image)
    } else {
      sql += " WHERE id = ?"
    }

    await db.query(sql, params)

    const [updatedPackage] = await db.query("SELECT * FROM packages WHERE id = ?", [req.params.id])

    res.json({
      message: "Package updated successfully",
      package: updatedPackage[0],
    })
  } catch (err) {
    console.error("Error updating package:", err)
    res.status(500).json({ error: err.message })
  }
}

// DELETE (Deactivate)
export const deletePackage = async (req, res) => {
  try {
    const [existingPackage] = await db.query("SELECT * FROM packages WHERE id = ?", [req.params.id])

    if (existingPackage.length === 0) {
      return res.status(404).json({ message: "Package not found" })
    }

    await db.query("UPDATE packages SET status = 'INACTIVE' WHERE id = ?", [req.params.id])

    res.json({
      message: "Package deactivated successfully",
      id: req.params.id,
    })
  } catch (err) {
    console.error("Error deactivating package:", err)
    res.status(500).json({ error: err.message })
  }
}

// REACTIVATE
export const reactivatePackage = async (req, res) => {
  try {
    const [existingPackage] = await db.query("SELECT * FROM packages WHERE id = ?", [req.params.id])

    if (existingPackage.length === 0) {
      return res.status(404).json({ message: "Package not found" })
    }

    await db.query("UPDATE packages SET status = 'ACTIVE' WHERE id = ?", [req.params.id])

    res.json({ message: "Package reactivated successfully" })
  } catch (err) {
    console.error("Error reactivating package:", err)
    res.status(500).json({ error: err.message })
  }
}