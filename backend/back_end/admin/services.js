import pool from "../db.js"

// Add a new service
export async function addService(body) {
  const [result] = await pool.query(
    `
      INSERT INTO tb_services (service_name, inspo, status)
      VALUES (?, ?, ?)`,
    [body.service_name, body.image, "ACTIVE"]
  )
  const id = result.insertId
  return getService(id)
}

// Get all ACTIVE services
export async function getServices() {
  const [rows] = await pool.query(
    `SELECT * FROM tb_services WHERE status = 'ACTIVE'`
  )
  return rows
}

// Get all services including INACTIVE (for admin)
export async function getAllServices() {
  const [rows] = await pool.query("SELECT * FROM tb_services")
  return rows
}

// Get a single service by ID
export async function getService(id) {
  const [rows] = await pool.query(
    `
      SELECT *
      FROM tb_services
      WHERE id = ?`,
    [id]
  )
  return rows[0]
}

// Update a service
export async function updateService(body, id) {
  const [result] = await pool.query(
    `
      UPDATE tb_services
      SET service_name = ?, inspo = ?, status = ?
      WHERE id = ?`,
    [body.service_name, body.image, body.status || "ACTIVE", id]
  )
  return result
}

// Soft delete a service (set status to INACTIVE)
export async function deleteService(id) {
  console.log(`Soft deleting service with ID: ${id}`)
  try {
    const [result] = await pool.query(
      `
        UPDATE tb_services
        SET status = 'INACTIVE'
        WHERE id = ?`,
      [id]
    )
    console.log("Soft delete result:", result)
    return result
  } catch (error) {
    console.error(`Error soft deleting service with ID ${id}:`, error)
    throw error
  }
}

// Restore a soft-deleted service (optional utility)
export async function restoreService(id) {
  try {
    const [result] = await pool.query(
      `
        UPDATE tb_services
        SET status = 'ACTIVE'
        WHERE id = ?`,
      [id]
    )
    console.log("Service restored:", result)
    return result
  } catch (error) {
    console.error(`Error restoring service with ID ${id}:`, error)
    throw error
  }
}
