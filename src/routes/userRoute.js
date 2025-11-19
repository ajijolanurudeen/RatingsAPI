const express = require('express');
const router = express.Router();
const {getUsers,registerUser} = require('../controllers/userController');

router.get('/',getUsers);
router.post('/',registerUser);

module.exports = router;