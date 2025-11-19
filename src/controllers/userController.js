const express = require('express');
const bcrypt = require('bcrypt');
const redisClient = require('../redis/redisClient');
const db = require('../DB/db'); // This should be your MySQL connection (mysql2/promise)


// Invalidate Redis cache
async function invalidateUsersCache(id) {
  await redisClient.del('users:all');
  if (id) await redisClient.del(`users:${id}`);
}


// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Check if user exists
    const [existingUser] = await db.query(
      'SELECT * FROM user WHERE email = ? LIMIT 1',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [insertResult] = await db.query(
      'INSERT INTO user (email, name, password) VALUES (?, ?, ?)',
      [email, name, hashedPassword]
    );

    await invalidateUsersCache();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: insertResult.insertId,
        email,
        name: name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET USERS
const getUsers = async (req, res) => {
  try {
    // Try getting from Redis first
    const cachedUsers = await redisClient.get('user:all');
    if (cachedUsers) {
      return res.json(JSON.parse(cachedUsers));
    }

    // Otherwise, query from MySQL
    const [rows] = await db.query('SELECT * FROM user ');

    // Cache result for 5 minutes
    await redisClient.setEx('user:all', 60 * 5, JSON.stringify(rows));

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getUsers, registerUser };
