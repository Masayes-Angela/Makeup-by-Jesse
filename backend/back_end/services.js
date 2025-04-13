import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
console.log("MySQL User:", process.env.MYSQL_USER);

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306
}).promise();

// Test the MySQL connection
pool.getConnection()
    .then(() => {
        console.log("Database connected successfully!");
    })
    .catch(err => {
        console.error("Database connection failed: ", err);
    });

// Add a new service
export async function addService(body) {
    const [result] = await pool.query(`
        INSERT INTO tb_services (service_name, inspo)
        VALUES (?, ?)`, 
        [body.service_name, body.image]
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

// Update a service
export async function updateService(body, id) {
    const [result] = await pool.query(`
        UPDATE tb_services
        SET service_name = ?, inspo = ?
        WHERE id = ?`, 
        [body.service_name, body.image, id]
    );
    return result;
}