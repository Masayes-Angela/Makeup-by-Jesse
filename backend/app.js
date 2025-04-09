import express from 'express'
import { getStudent,getStudents,addStudent } from './back_end/database.js';
import { addPenalty, getPenalties,updatePenalty } from './back_end/penalty.js';
import { addGenre,getGenre,getGenres,updateStatusGenre,updateGenre } from './back_end/genre.js';
import { addBook,getBooks } from './back_end/book.js';
import cors from 'cors'
const app = express();

app.use(cors({origin:'http://localhost:3000'}));
app.use(express.json())

// get all students record
app.get("/students",async (req,res)=>{
    const students = await getStudents();
    res.send(students);
})

// get single student info
app.get("/student/:id",async (req,res)=>{
    const id = req.params.id;
    const student = await getStudent(id);
    res.send(student);
})

// add new student
app.post("/student",async (req,res)=>{
    const student = await addStudent(req.body);
    res.status(201).send(student);
})

// Add Penalty
app.post("/penalty",async (req,res)=>{
    const results = await addPenalty(req.body);
    res.status(201).send(results);
})
// get all penalty record
app.get("/penalty",async (req,res)=>{
    const students = await getPenalties();
    res.send(students);
})
// update penalty record
app.put("/penalty/:id",async (req,res)=>{
    const id = req.params.id;
    const results = await updatePenalty(req.body,id);
    let message={
        status:1,
        message:"You successfully update penalty information"
    }
    if(results.affectedRows==1){
        message={
            status:1,
            message:"You successfully update penalty information"
        }
    }else{
       message={
            status:0,
            message:"Update penalty information error"
        }
    }
    res.send(message);

    // const students = await getPenalties();
    // res.send(students);
})

// Genre
// Add Genre
app.post("/genre",async (req,res)=>{
    const results = await addGenre(req.body);
    res.status(201).send(results);
})

// get all genre record
app.get("/genre",async (req,res)=>{
    const results = await getGenres();
    res.send(results);
})

// get single genre info
app.get("/genre/:id",async (req,res)=>{
    const id = req.params.id;
    const genre = await getGenre(id);
    res.send(genre);
})



// update genre record
app.put("/genre/:id",async (req,res)=>{
    
    const id = req.params.id;
    const results = await updateGenre(req.body,id);
    let message={
        status:1,
        message:"You successfully update genre information"
    }
    if(results.affectedRows==1){
        message={
            status:1,
            message:"You successfully update genre information"
        }
    }else{
       message={
            status:0,
            message:"Update genre information error"
        }
    }
    res.send(message);

})

// Update status
app.put("/genre-status/:id",async (req,res)=>{
    const id = req.params.id;
    const results = await updateStatusGenre(req.body,id);
    res.send(results);
})

// Add book API
app.post("/book",async (req,res)=>{
    const results = await addBook(req.body);
    res.status(201).send(results);
})
// get book API
app.get("/book",async (req,res)=>{
    const results = await getBooks();
    res.send(results);
})


// Detect possible error
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send('Lost connections')
})
// Detect if there is a connection
app.listen(8080,()=>{
    console.log("Server is running in port 8080");
})