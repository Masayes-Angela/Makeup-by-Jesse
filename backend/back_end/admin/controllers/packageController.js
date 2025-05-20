import db from "../../db.js"

// CREATE
export const addPackage = async (req, res) => {
  try {
    const { name, price, description, image } = req.body

    if (!name || !price || !description) {
      return res.status(400).json({ error: "Name, price, and description are required" })
    }

    console.log("Adding package:", { name, price, description, imageProvided: !!image })

    const [result] = await db.query(
      "INSERT INTO packages (name, price, description, image_url, status) VALUES (?, ?, ?, ?, ?)",
      [name, price, description, image, "ACTIVE"],
    )

    console.log("Package added with ID:", result.insertId)

    res.status(201).json({
      message: "Package added successfully",
      id: result.insertId,
      package: {
        id: result.insertId,
        name,
        price,
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
    console.log("Fetching all packages")
    const [rows] = await db.query("SELECT * FROM packages")
    console.log(`Found ${rows.length} packages`)
    res.json(rows)
  } catch (err) {
    console.error("Error fetching packages:", err)
    res.status(500).json({ error: err.message })
  }
}

// READ ONE
export const getPackageById = async (req, res) => {
  try {
    console.log("Fetching package with ID:", req.params.id)
    const [rows] = await db.query("SELECT * FROM packages WHERE id = ?", [req.params.id])

    if (rows.length === 0) {
      console.log("Package not found with ID:", req.params.id)
      return res.status(404).json({ message: "Package not found" })
    }

    console.log("Found package:", rows[0])
    res.json(rows[0])
  } catch (err) {
    console.error("Error fetching package:", err)
    res.status(500).json({ error: err.message })
  }
}

// UPDATE
export const updatePackage = async (req, res) => {
  try {
    const { name, price, description, image, status } = req.body

    if (!name || !price || !description) {
      return res.status(400).json({ error: "Name, price, and description are required" })
    }

    console.log("Updating package with ID:", req.params.id, { imageProvided: !!image })

    // Check if package exists
    const [existingPackage] = await db.query("SELECT * FROM packages WHERE id = ?", [req.params.id])

    if (existingPackage.length === 0) {
      console.log("Package not found with ID:", req.params.id)
      return res.status(404).json({ message: "Package not found" })
    }

    let sql = "UPDATE packages SET name = ?, price = ?, description = ?, status = ?"
    const params = [name, price, description, status || existingPackage[0].status, req.params.id]

    if (image) {
      sql = "UPDATE packages SET name = ?, price = ?, description = ?, image_url = ?, status = ? WHERE id = ?"
      params.splice(3, 0, image)
    } else {
      sql += " WHERE id = ?"
    }

    console.log("Executing SQL update")
    await db.query(sql, params)

    // Get updated package
    const [updatedPackage] = await db.query("SELECT * FROM packages WHERE id = ?", [req.params.id])
    console.log("Package updated successfully")

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
    console.log("Deactivating package with ID:", req.params.id)

    // Check if package exists
    const [existingPackage] = await db.query("SELECT * FROM packages WHERE id = ?", [req.params.id])

    if (existingPackage.length === 0) {
      console.log("Package not found with ID:", req.params.id)
      return res.status(404).json({ message: "Package not found" })
    }

    // Instead of deleting, update status to INACTIVE
    await db.query("UPDATE packages SET status = 'INACTIVE' WHERE id = ?", [req.params.id])
    console.log("Package deactivated successfully with ID:", req.params.id)

    res.json({
      message: "Package deactivated successfully",
      id: req.params.id,
    })
  } catch (err) {
    console.error("Error deactivating package:", err)
    res.status(500).json({ error: err.message })
  }
}

// DEACTIVATE
export const deactivatePackage = async (req, res) => {
  try {
    console.log("Deactivating package with ID:", req.params.id)

    // Check if package exists
    const [existingPackage] = await db.query("SELECT * FROM packages WHERE id = ?", [req.params.id])

    if (existingPackage.length === 0) {
      console.log("Package not found with ID:", req.params.id)
      return res.status(404).json({ message: "Package not found" })
    }

    await db.query("UPDATE packages SET status = 'INACTIVE' WHERE id = ?", [req.params.id])
    console.log("Package deactivated successfully with ID:", req.params.id)

    res.json({ message: "Package deactivated successfully" })
  } catch (err) {
    console.error("Error deactivating package:", err)
    res.status(500).json({ error: err.message })
  }
}

// REACTIVATE
export const reactivatePackage = async (req, res) => {
  try {
    console.log("Reactivating package with ID:", req.params.id)

    // Check if package exists
    const [existingPackage] = await db.query("SELECT * FROM packages WHERE id = ?", [req.params.id])

    if (existingPackage.length === 0) {
      console.log("Package not found with ID:", req.params.id)
      return res.status(404).json({ message: "Package not found" })
    }

    await db.query("UPDATE packages SET status = 'ACTIVE' WHERE id = ?", [req.params.id])
    console.log("Package reactivated successfully with ID:", req.params.id)

    res.json({ message: "Package reactivated successfully" })
  } catch (err) {
    console.error("Error reactivating package:", err)
    res.status(500).json({ error: err.message })
  }
}
