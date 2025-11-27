const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/jwt')
const{getAllRatings,getItemAverageRating,createRating,deleteRating}=require('../controllers/ratingController');

router.get('/',getAllRatings);
router.post('/',authMiddleware,createRating);
router.get('/:id',getItemAverageRating);
router.delete('/:id',authMiddleware,deleteRating)

module.exports = router