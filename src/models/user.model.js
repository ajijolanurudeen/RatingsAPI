const db = require("../DB/db");

/**
 * Find user by email
 */
const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  return rows[0];
};


/**
 * Register User
 */
const registerUser = async (name, email, password, role) => {
  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    name,
    email,
    password,
    role
  ]);

  const [rows] = await db.query(
    "SELECT * FROM users WHERE user_id = ?",
    [result.insertId]
  );

  return rows[0];
};


/**
 * Get users (pagination)
 */
const getUsers = async (limit, offset) => {
  const query = `
    SELECT *
    FROM users
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await db.query(query, [limit, offset]);
  return rows;
};


/**
 * Get one user by ID
 */
const getOneUser = async (user_id) => {
  const query = `
    SELECT *
    FROM users
    WHERE user_id = ?
  `;

  const [rows] = await db.query(query, [user_id]);
  return rows[0];
};


/**
 * Update user (dynamic fields)
 */
const updateUser = async (user_id, updatedFields) => {

  const setQuery = Object.keys(updatedFields)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = [...Object.values(updatedFields), user_id];

  const query = `
    UPDATE users
    SET ${setQuery}
    WHERE user_id = ?
  `;

  await db.query(query, values);

  // Return updated user
  const [rows] = await db.query(
    "SELECT * FROM users WHERE user_id = ?",
    [user_id]
  );

  return rows[0];
};


/**
 * Delete user
 */
const deleteUser = async (user_id) => {

  const [rows] = await db.query(
    "SELECT * FROM users WHERE user_id = ?",
    [user_id]
  );

  if (rows.length === 0) return null;

  await db.query(
    "DELETE FROM users WHERE user_id = ?",
    [user_id]
  );

  return rows[0]; // return deleted user
};


module.exports = {
  deleteUser,
  getOneUser,
  getUsers,
  registerUser,
  updateUser,
  findUserByEmail
};
