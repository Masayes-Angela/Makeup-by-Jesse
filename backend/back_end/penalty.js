import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
}).promise()


export async function addPenalty(body){
    const [result] = await pool.query(`
    INSERT INTO tbl_penalty
    (cost,date_added,date_removed,status)
    VALUES (?,?,?,?)
    `,[body.cost,body.date_added,body.date_removed,body.status])
    const id = result.insertId
    return getPenalty(id);
}

//get single penalty record
export async function getPenalty(id){
    const [rows] = await pool.query(`
    SELECT *
    FROM tbl_penalty
    WHERE id = ?  
    `,[id]);
    return rows[0]   
}
// get all penalties
export async function getPenalties(){
    const [rows] = await pool.query("SELECT * from tbl_penalty");
    return rows   
}

// Update penalties
export async function updatePenalty(body,id){
    const [result] = await pool.query(`
    UPDATE tbl_penalty
    SET cost = ?
    WHERE id = ?
    `,[body.cost,id]);
    return result  
}
