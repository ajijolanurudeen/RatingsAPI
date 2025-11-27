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
    const { email, name, password,role} = req.body;

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
      'INSERT INTO user (email, name, password,role) VALUES (?, ?, ?,?)',
      [email, name, hashedPassword,role]
    );

    await invalidateUsersCache();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: insertResult.insertId,
        email,
        name: name,
        role
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

const getOneUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM user WHERE user_id = ?',
      [id]
    );

    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });

  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
  }


  const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Check if user exists
    const [rows] = await db.query(
      "SELECT * FROM user WHERE user_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only provided fields
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (password) updatedFields.password = password;

    // If nothing to update
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Build SQL dynamically
    const setQuery = Object.keys(updatedFields)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = [...Object.values(updatedFields), id];

    await db.query(
      `UPDATE user SET ${setQuery} WHERE user_id = ?`,
      values
    );

    return res.status(200).json({
      message: "User updated successfully",
      updated: updatedFields,
    });

  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};



const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [rows] = await db.query(
      "SELECT * FROM user WHERE user_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user
    await db.query(
      "DELETE FROM user WHERE user_id = ?",
      [id]
    );

    return res.status(200).json({
      message: "User deleted successfully",
      deleted_user_id: id
    });

  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};




module.exports = { getUsers, registerUser,getOneUser,updateUser,deleteUser};
