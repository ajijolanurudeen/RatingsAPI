const express = require('express');
const redisClient = require('../redis/redisClient');
const userService = require("../service/user.service")

// Invalidate Redis cache
async function invalidateUsersCache(id) {
  await redisClient.del('users:all');
  if (id) await redisClient.del(`users:${id}`);
}


// REGISTER USER
const registerUser = async (req, res, next) => {
try{
  const user = await userService.registerUser({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    role: req.body.role
  })
  res.status(201).json(user)
} catch(err){
  next(err)
}
};


// GET USERS
const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers({
      page: Number(req.query.page),
      limit: Number(req.query.limit)
    }) 
    res.status(200).json(users)
  } catch (err) {
    next(err)
  }
};

// GET ONE USER
const getOneUser = async (req, res, next) => {
  try {
    const user = await userService.getOneUser(
      req.params.user_id
    )
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
  };


  //UPDATE USER
const updateUser = async (req, res) => {
  try {
    const result = await userService.updateUser(
      req.params.user_id,
      req.body
    );

    return res.status(200).json(result);

  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  }
};


//DELETE USER
const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.user_id);

    return res.status(200).json(result);

  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Internal server error",
    });
  }
};




module.exports = { getUsers, registerUser,getOneUser,updateUser,deleteUser};
