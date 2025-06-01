//db table: tb_services
import db from "../../db.js"

// CREATE
export const createService = async (req, res) => {
  try {
    const { name, image } = req.body

    if (!name) {
      return res.status(400).json({ error: "Service name is required" })
    }

    const [result] = await db.query("INSERT INTO tb_services (service_name, inspo, status) VALUES (?, ?, ?)", [
      name,
      image,
      "ACTIVE",
    ])

    res.status(201).json({
      message: "Service added successfully",
      id: result.insertId,
      service: {
        id: result.insertId,
        service_name: name,
        inspo: image,
        status: "ACTIVE",
      },
    })
  } catch (err) {
    console.error("Error creating service:", err)
    res.status(500).json({ error: err.message })
  }
}

// READ ALL
export const fetchAllServices = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tb_services")
    res.json(rows)
  } catch (err) {
    console.error("Error fetching services:", err)
    res.status(500).json({ error: err.message })
  }
}

// READ ONE
export const fetchServiceById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tb_services WHERE id = ?", [req.params.id])

    if (rows.length === 0) {
      return res.status(404).json({ message: "Service not found" })
    }

    res.json(rows[0])
  } catch (err) {
    console.error("Error fetching service:", err)
    res.status(500).json({ error: err.message })
  }
}

// UPDATE
export const modifyService = async (req, res) => {
  try {
    const { name, image, status } = req.body

    if (!name) {
      return res.status(400).json({ error: "Service name is required" })
    }

    // Check if service exists
    const [existingService] = await db.query("SELECT * FROM tb_services WHERE id = ?", [req.params.id])

    if (existingService.length === 0) {
      return res.status(404).json({ message: "Service not found" })
    }

    let sql = "UPDATE tb_services SET service_name = ?, status = ?"
    const params = [name, status || existingService[0].status, req.params.id]

    if (image) {
      sql = "UPDATE tb_services SET service_name = ?, inspo = ?, status = ? WHERE id = ?"
      params.splice(1, 0, image)
    } else {
      sql += " WHERE id = ?"
    }

    await db.query(sql, params)

    // Get updated service
    const [updatedService] = await db.query("SELECT * FROM tb_services WHERE id = ?", [req.params.id])

    res.json({
      message: "Service updated successfully",
      service: updatedService[0],
    })
  } catch (err) {
    console.error("Error updating service:", err)
    res.status(500).json({ error: err.message })
  }
}

// DELETE (Deactivate)
export const deleteService = async (req, res) => {
  try {
    // Check if service exists
    const [existingService] = await db.query("SELECT * FROM tb_services WHERE id = ?", [req.params.id])

    if (existingService.length === 0) {
      return res.status(404).json({ message: "Service not found" })
    }

    // Instead of deleting, update status to INACTIVE
    await db.query("UPDATE tb_services SET status = 'INACTIVE' WHERE id = ?", [req.params.id])

    res.json({
      message: "Service deactivated successfully",
      id: req.params.id,
    })
  } catch (err) {
    console.error("Error deactivating service:", err)
    res.status(500).json({ error: err.message })
  }
}
