import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserPassword,
  deactivateUser,
  reactivateUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", registerUser);                    // Create user
router.post("/login", loginUser);                        // Login user
router.get("/users", getUsers);                          // Get all users
router.get("/users/:id", getUserById);                   // Get one user
router.put("/users/:id", updateUser);                    // Update user info
router.put("/users/:id/password", updateUserPassword);   // Update password
router.patch("/users/:id/deactivate", deactivateUser);   // Deactivate (soft delete)
router.patch("/users/:id/reactivate", reactivateUser);   // Reactivate

export default router;
