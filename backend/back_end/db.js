import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// console.log("Connecting with DB:", {
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   port: process.env.MYSQL_PORT
// });

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
        console.error("Database connection failed:", err);
    });

export default pool;