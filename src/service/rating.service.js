const ratingModel = require("../models/rating.model");

const createRating = async ({ user_id, product_id, rating }) => {
  if (!user_id || !product_id || !rating) {
    throw new Error("Missing required fields");
  }

  const existingRating = await ratingModel.findUserRating(user_id, product_id);
  if (existingRating) {
    throw new Error("User has already rated this product");
  }

  return await ratingModel.createRating(user_id, product_id, rating);
};

const getAllRatings = async ({ page = 1, limit = 10 }) => {
    page = Number(page);
    limit = Number(limit);
    if (!Number.isInteger(page) || page < 1) page = 1;
    if (!Number.isInteger(limit) || limit < 1) limit = 10;
  const offset = (page - 1) * limit;
  return await ratingModel.getAllRatings(limit, offset);
};

/**
 * Get average rating for a product
 */
const getItemAverageRating = async (product_id) => {
  if (!product_id) {
    throw new Error("Product ID is required");
  }

  return await ratingModel.getItemAverageRating(product_id);
};

/**
 * Delete rating
 */
const deleteRating = async ({ rating_id, user_id }) => {
  const deleted = await ratingModel.deleteRating(rating_id, user_id);
  if (!deleted) {
    throw new Error("Rating not found or unauthorized");
  }
  return deleted;
};
module.exports = {
  createRating,
  getAllRatings,
  getItemAverageRating,
  deleteRating
};
