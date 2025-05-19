import express from "express";
import { sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", sendMessage); // POST /api/message

export default router;