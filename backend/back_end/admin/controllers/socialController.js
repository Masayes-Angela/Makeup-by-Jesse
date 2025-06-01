//db table: social_links
import db from "../../db.js";

// GET all links
export const getSocialLinks = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM social_links WHERE status = 'ACTIVE'");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE or UPDATE
export const upsertSocialLink = async (req, res) => {
  const { platform, url } = req.body;
  try {
    await db.query(
      `INSERT INTO social_links (platform, url)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE url = VALUES(url), status = 'ACTIVE'`,
      [platform, url]
    );
    res.json({ message: "Social link saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DEACTIVATE
export const deactivateSocialLink = async (req, res) => {
  try {
    await db.query("UPDATE social_links SET status = 'INACTIVE' WHERE id = ?", [req.params.id]);
    res.json({ message: "Social link deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RESTORE
export const reactivateSocialLink = async (req, res) => {
  try {
    await db.query("UPDATE social_links SET status = 'ACTIVE' WHERE id = ?", [req.params.id]);
    res.json({ message: "Social link reactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};