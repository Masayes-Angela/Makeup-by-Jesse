import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306
}).promise();


// Add a new service
export async function addService(body) {
    const [result] = await pool.query(`
        INSERT INTO tb_services (service_name, description, price, duration, status)
        VALUES (?, ?, ?, ?, ?)`, 
        [body.service_name, body.description, body.price, body.duration, body.status]
    );
    const id = result.insertId;
    return getService(id);
}

// Get all services
export async function getServices() {
    const [rows] = await pool.query("SELECT * FROM tb_services");
    return rows;
}

// Get a single service by ID
export async function getService(id) {
    const [rows] = await pool.query(`
        SELECT *
        FROM tb_services
        WHERE id = ?`, [id]
    );
    return rows[0]; // Return the first (and only) result
}