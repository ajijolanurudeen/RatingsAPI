const express = require('express');
const db = require('../DB/db');

// Create Product
 
const createProduct = async (product_name, product_description, product_price) => {
  const query = `
    INSERT INTO products (product_name, product_description, product_price)
    VALUES (?, ?, ?)
  `;

  const [result] = await db.query(query, [
    product_name,
    product_description,
    product_price,
  ]);

  const [rows] = await db.query(
    "SELECT * FROM products WHERE product_id = ?",
    [result.insertId]
  );

  return rows[0];
};


//GET ALL PRODUCTS
const getAllProducts = async (limit, offset) => {
  const query = `
    SELECT *
    FROM products
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await db.query(query, [limit, offset]);
  return rows;
};


//GET ONE PRODUCT
const getOneProduct = async (product_name) => {
  const query = `
    SELECT *
    FROM products
    WHERE product_name = ?
  `;

  const [rows] = await db.query(query, [product_name]);
  return rows[0];
};


//GET PRODUCT BY ID
const getProductById = async (product_id) => {
  const query = `
    SELECT 
      p.*,
      r.rating,
      r.comment,
      u.user_id,
      u.name AS user_name,
      u.email AS user_email
    FROM products p
    LEFT JOIN ratings r ON p.product_id = r.product_id
    LEFT JOIN users u ON r.user_id = u.user_id
    WHERE p.product_id = ?
  `;

  const [rows] = await db.query(query, [product_id]);
  return rows;
};

//UPDATE PRODUCT
const updateProduct = async (product_id, updatedFields) => {

  const setQuery = Object.keys(updatedFields)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = [...Object.values(updatedFields), product_id];

  const query = `
    UPDATE products
    SET ${setQuery}
    WHERE product_id = ?
  `;

  await db.query(query, values);

  // Return updated product
  const [rows] = await db.query(
    "SELECT * FROM products WHERE product_id = ?",
    [product_id]
  );

  return rows[0];
};


//DELETE PRODUCT
const deleteProduct = async (product_id) => {
  const [rows] = await db.query(
    "SELECT * FROM products WHERE product_id = ?",
    [product_id]
  );

  if (rows.length === 0) return null;

  await db.query(
    "DELETE FROM products WHERE product_id = ?",
    [product_id]
  );

  return rows[0]; // return deleted product info
};



module.exports = {
    createProduct,
    getAllProducts,
    getOneProduct,
    getProductById,
    updateProduct,
    deleteProduct
}