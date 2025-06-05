import db from "../../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register new user
export const registerUser = async (req, res) => {
  const { full_name, email, contact_number, password } = req.body;

  try {
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      "INSERT INTO users (full_name, email, contact_number, password_hash) VALUES (?, ?, ?, ?)",
      [full_name, email, contact_number, password_hash]
    );

    res.status(201).json({ message: "User registered", userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Log in user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, full_name, email, contact_number, role, status FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one user by ID
export const getUserById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, full_name, email, contact_number, role, status FROM users WHERE id = ?",
      [req.params.id]
    );
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user info
export const updateUser = async (req, res) => {
  const { full_name, contact_number, role, status } = req.body;
  try {
    await db.query(
      "UPDATE users SET full_name = ?, contact_number = ?, role = ?, status = ? WHERE id = ?",
      [full_name, contact_number, role, status, req.params.id]
    );
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user password
export const updateUserPassword = async (req, res) => {
  const { password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    await db.query("UPDATE users SET password_hash = ? WHERE id = ?", [password_hash, req.params.id]);
    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deactivate user
export const deactivateUser = async (req, res) => {
  try {
    await db.query("UPDATE users SET status = 'INACTIVE' WHERE id = ?", [req.params.id]);
    res.json({ message: "User deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reactivate user
export const reactivateUser = async (req, res) => {
  try {
    await db.query("UPDATE users SET status = 'ACTIVE' WHERE id = ?", [req.params.id]);
    res.json({ message: "User reactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};