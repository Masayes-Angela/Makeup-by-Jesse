import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
}).promise()

// Add Genre
export async function addGenre(body){
    const [result] = await pool.query(`
    INSERT INTO tbl_genre
    (genre_name,status)
    VALUES (?,?)
    `,[body.genre_name,body.status])
    const id = result.insertId
    return getGenre(id);
}

//get single genre record
export async function getGenre(id){
    const [rows] = await pool.query(`
    SELECT *
    FROM tbl_genre
    WHERE id = ?  
    `,[id]);
    return rows[0]   
}
// get all genre
export async function getGenres(){
    const [rows] = await pool.query("SELECT * from tbl_genre");
    return rows   
}

// status Genre
export async function updateStatusGenre(body,id){
    const [result] = await pool.query(`
    UPDATE tbl_genre
    SET status = ?
    WHERE id = ?
    `,[body.status,id]);
    return result  
}
// Update Genre
export async function updateGenre(body,id){
    const [result] = await pool.query(`
    UPDATE tbl_genre
    SET genre_name = ?
    WHERE id = ?
    `,[body.genre_name,id]);
    return result  
}