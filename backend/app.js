// backend/app.js
import express from 'express';
import cors from 'cors';
import { getServices, getService, addService, updateService } from './back_end/services.js';


const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // For handling image uploads


// GET all services
app.get('/services', async (req, res) => {
  try {
    const services = await getServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET a single service
app.get('/services/:id', async (req, res) => {
  try {
    const service = await getService(req.params.id);
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// POST a new service
app.post('/services', async (req, res) => {
  try {
    const newService = await addService(req.body);
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// PUT/update a service
app.put('/services/:id', async (req, res) => {
  try {
    const result = await updateService(req.body, req.params.id);
    if (result.affectedRows) {
      const updatedService = await getService(req.params.id);
      res.json(updatedService);
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
