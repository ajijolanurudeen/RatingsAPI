const express = require('express');
const router = express.Router();
const {getUsers,registerUser,getOneUser,updateUser,deleteUser} = require('../controllers/userController');
const {login} = require('../controllers/authController')
router.get('/',getUsers);
router.post('/register',registerUser);
router.get('/:id',getOneUser);
router.put('/:id',updateUser);
router.delete('/:id',deleteUser);
router.post('/login',login)

module.exports = router;