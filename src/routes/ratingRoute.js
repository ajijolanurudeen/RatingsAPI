const express = require('express');
const router = express.Router();
const{getAllRatings,getItemAverageRating,createRating,deleteRating}=require('../controllers/ratingController');

router.get('/',getAllRatings);
router.post('/',createRating);
router.get('/:id',getItemAverageRating);
router.delete('/:id',deleteRating)

module.exports = router