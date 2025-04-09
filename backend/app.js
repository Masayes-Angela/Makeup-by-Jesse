import express from 'express';
import { addService, getServices} from './back_end/services.js';
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

// Start the server
app.listen(8080, () => {
    console.log("Server running on port 8080");
});