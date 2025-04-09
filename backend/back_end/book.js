import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
}).promise()


// Add Book
export async function addBook(body){
    const [result] = await pool.query(`
    INSERT INTO tbl_book
    (genre_id,book_name,status)
    VALUES (?,?,?)
    `,[body.genre_id,body.book_name,body.status])
    const id = result.insertId
    console.log(id);
    // return getGenre(id);
}
// get all books
export async function getBooks(){
    const [rows] = await pool.query(`SELECT 
        tbl_book.id,tbl_genre.genre_name,tbl_book.book_name,tbl_book.status 
        from tbl_book
        INNER JOIN tbl_genre on tbl_genre.id=tbl_book.genre_id`);
    return rows   
}


