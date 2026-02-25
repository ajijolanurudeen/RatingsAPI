const ratingService = require("../service/rating.service");

const createRating = async (req, res, next) => {
  try {
    const rating = await ratingService.createRating({
      user_id: req.body.user_id, // from auth middleware
      product_id: req.body.product_id,
      rating: req.body.rating
    });
    res.status(201).json(rating);
  } catch (err) {
    next(err);
  }
};

const getAllRatings = async (req, res, next) => {
  try {
    const ratings = await ratingService.getAllRatings({
      page: Number(req.query.page),
      limit: Number(req.query.limit)
    });
    res.json(ratings);
  } catch (err) {
    next(err);
  }
};

const getItemAverageRating = async (req, res, next) => {
  try {
    const avg = await ratingService.getItemAverageRating(
      req.params.product_id
    );
    res.json(avg);
  } catch (err) {
    next(err);
  }
};

const deleteRating = async (req, res, next) => {
  try {
    await ratingService.deleteRating({
      rating_id: req.params.rating_id,
      user_id: req.user.user_id
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRating,
  getAllRatings,
  getItemAverageRating,
  deleteRating
};
