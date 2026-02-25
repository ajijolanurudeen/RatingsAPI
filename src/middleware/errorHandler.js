const ratingService = require("../services/rating.service");

const createRating = async (req, res, next) => {
  try {
    const rating = await ratingService.createRating({
      userId: req.body.user_id,
      productId: req.body.product_id,
      rating: req.body.rating
    });

    res.status(201).json(rating);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRating
};
