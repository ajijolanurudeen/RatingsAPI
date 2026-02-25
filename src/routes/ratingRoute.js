const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/jwt')
const{getAllRatings,getItemAverageRating,createRating,deleteRating}=require('../controllers/ratingController');

router.get('/',getAllRatings);
router.post('/',/**authMiddleware**/createRating);
router.get('/:product_id',getItemAverageRating);
router.delete('/:rating_id',authMiddleware,deleteRating)

module.exports = router