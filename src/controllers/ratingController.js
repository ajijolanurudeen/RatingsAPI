const db = require("../DB/db");

// CREATE RATING
const createRating = async (req, res) => {
  try {
    const { product_id, user_id, rating, comment } = req.body;

    // Basic validation
    if (!product_id || !user_id || !rating)
      return res
        .status(400)
        .json({ message: "product_id, user_id, and rating are required" });

    if (rating < 1 || rating > 5)
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });

    // Check if user already rated the item
    const [existing] = await db.query(
      "SELECT * FROM rating WHERE product_id = ? AND user_id = ?",
      [product_id, user_id]
    );

    if (existing.length > 0)
      return res
        .status(400)
        .json({ message: "User has already rated this item" });

    // Insert new rating
    const [insertResult] = await db.query(
      "INSERT INTO rating (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
      [product_id, user_id, rating, comment]
    );

    res.status(201).json({
      message: "Rating created successfully",
      data: {
        rating_id: insertResult.insertId,
        product_id,
        user_id,
        rating,
        comment,
      },
    });
  } catch (error) {
    console.error("Error creating rating:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET ALL RATINGS
const getAllRatings = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM rating ORDER BY created_at DESC");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET AVERAGE RATING FOR AN ITEM
const getItemAverageRating = async (req, res) => {
  try {
    const { id: product_id } = req.params;

    const [rows] = await db.query(
      "SELECT rating FROM rating WHERE product_id = ?",
      [product_id]
    );

    if (rows.length === 0)
      return res.status(200).json({
        product_id,
        average_rating: null,
        message: "No reviews yet",
      });

    const avg = rows.reduce((sum, r) => sum + r.rating, 0) / rows.length;

    res.status(200).json({
      product_id,
      average_rating: Number(avg.toFixed(2)),
      total_reviews: rows.length,
    });
  } catch (error) {
    console.error("Error fetching average rating:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE RATING
const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM rating WHERE rating_id = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Rating not found" });

    res.status(200).json({ message: "Rating deleted successfully" });
  } catch (error) {
    console.error("Error deleting rating:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRating,
  getAllRatings,
  getItemAverageRating,
  deleteRating,
};
