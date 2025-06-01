//db table: about_me
import db from "../../db.js";

// Get about me info
export const getAboutMe = (req, res) => {
  const sql = "SELECT * FROM about_me LIMIT 1";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
};

// Update about me info
export const updateAboutMe = (req, res) => {
  const { full_name, title, bio, years_experience, photo_url } = req.body;
  const sql = `UPDATE about_me SET full_name=?, title=?, bio=?, years_experience=?, photo_url=? WHERE id=1`;

  db.query(sql, [full_name, title, bio, years_experience, photo_url], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: "About Me updated." });
  });
};
