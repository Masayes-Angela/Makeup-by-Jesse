
import express from 'express';
import { addService, getServices, updateService} from './back_end/services.js';
import cors from 'cors';

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Add a new service
app.post("/services", async (req, res) => {
    try {
        const service = await addService(req.body);
        res.status(201).json(service);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding service");
    }
});

// Example route for testing services
app.get("/services", async (req, res) => {
    try {
        const services = await getServices();
        res.status(200).json(services);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching services");
    }
});

app.put("/service/:id", async (req, res) => {
    const id = req.params.id;
    const results = await updateService(req.body, id);
    let message = {
        status: 1,
        message: "You successfully updated the service"
    };
    if (results.affectedRows === 1) {
        message = {
            status: 1,
            message: "You successfully updated the service"
        };
    } else {
        message = {
            status: 0,
            message: "Error updating the service"
        };
    }
    res.send(message);
});

// Detect possible error
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send('Lost connections')
})
// Detect if there is a connection
app.listen(8080,()=>{
    console.log("Server is running in port 8080");
})