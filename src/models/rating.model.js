const db = require("../DB/db");

//Check if user already rated a product
const findUserRating = async (user_id, product_id) => {
  const query = `
    SELECT rating_id 
    FROM ratings
    WHERE user_id = ? AND product_id = ?
  `;

  const [rows] = await db.query(query, [user_id, product_id]);
  return rows[0];
};

// Create rating

const createRating = async (user_id, product_id, rating) => {
  const query = `
    INSERT INTO ratings (user_id, product_id, rating)
    VALUES (?, ?, ?)
  `;
  const [result] = await db.query(query, [user_id, product_id, rating]);

  const [rows] = await db.query(
    "SELECT * FROM ratings WHERE rating_id = ?",
    [result.insertId]
  );

  return rows[0];
};

//Get all ratings (pagination)
 
const getAllRatings = async (limit, offset) => {
  const query = `
    SELECT *
    FROM ratings
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await db.query(query, [limit, offset]);
  return rows;
};


// Get average rating for a product

const getItemAverageRating = async (product_id) => {
  const query = `
    SELECT ROUND(AVG(rating), 2) AS average_rating
    FROM ratings
    WHERE product_id = ?
  `;

  const [rows] = await db.query(query, [product_id]);

  return rows[0]; 
};


// Delete rating
 
const deleteRating = async (rating_id, user_id) => {

  const [rows] = await db.query(
    "SELECT * FROM ratings WHERE rating_id = ? AND user_id = ?",
    [rating_id, user_id]
  );

  if (rows.length === 0) return null;

  await db.query(
    "DELETE FROM ratings WHERE rating_id = ? AND user_id = ?",
    [rating_id, user_id]
  );

  return rows[0];
};


module.exports = {
  findUserRating,
  createRating,
  getAllRatings,
  getItemAverageRating,
  deleteRating
};
