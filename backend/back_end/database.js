import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
}).promise()

// get all students records
export async function getStudents(){
    const [rows] = await pool.query("SELECT * from tb_students");
    return rows   
}
//get single student record
export async function getStudent(id){
    const [rows] = await pool.query(`
    SELECT *
    FROM tb_students
    WHERE id = ?  
    `,[id]);
    return rows[0]   
}

//add new student
export async function addStudent(body){
    const [result] = await pool.query(`
    INSERT INTO tb_students
    (firstname,lastname,status)
    VALUES (?,?,?)
    `,[body.firstname,body.lastname,body.status])
    const id = result.insertId
    return getStudent(id);
}

