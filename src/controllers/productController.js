const express = require('express');
const db = require('../DB/db'); // MySQL connection pool

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const { product_name, product_description, product_price } = req.body;

    if (!product_name || !product_price)
      return res.status(400).json({ message: 'Name and price are required' });

    const [rows] = await db.query(
      `INSERT INTO product (product_name, product_description, Product_price)
       VALUES (?, ?, ?)`,
      [product_name, product_description, product_price]
    );

    res.status(201).json({
      message: 'Product created successfully',
      data: {
        id: rows.insertId,
        product_name: product_name,
        product_description: product_description,
        product_price: product_price,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ALL PRODUCTS WITH RATINGS SUMMARY
const getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query(`SELECT * FROM product `);

    const productWithRatings = await Promise.all(
      products.map(async (product) => {
        const [ratings] = await db.query(
          'SELECT rating FROM rating WHERE product_id = ?',
          [product.product_id]
        );

        const avg =
          ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : null;

        return {
          ...product,
          average_rating: avg ? Number(avg.toFixed(1)) : null,
          total_reviews: ratings.length,
          message: ratings.length === 0 ? 'No reviews yet' : null,
        };
      })
    );

    res.status(200).json({
      message: 'Products fetched successfully',
      data: productWithRatings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Get the product
    const [productRows] = await db.query(
      'SELECT * FROM product WHERE product_id = ?',
      [id]
    );
    const product = productRows[0];

    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    // 2️⃣ Get all reviews for that product
    const [reviews] = await db.query(
      `
      SELECT 
        r.product_id, 
        r.rating, 
        r.comment,
        u.user_id AS user_id, 
        u.name AS user_name, 
        u.email AS user_email
      FROM rating r
      JOIN \`user\` u ON r.user_id = u.user_id
      WHERE r.product_id = ?;
      `,
      [id]
    );

    // 3️⃣ Compute average rating
    const total_reviews = reviews.length;
    const avg_rating =
      total_reviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / total_reviews
        : null;

    // 4️⃣ Send response
    res.status(200).json({
      message: 'Product fetched successfully',
      data: {
        ...product,
        average_rating: avg_rating ? Number(avg_rating.toFixed(1)) : null,
        total_reviews,
        message: total_reviews === 0 ? 'No reviews yet' : null,
        reviews,
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const [result] = await db.query(
      `UPDATE product
       SET product_name = ?, product_description = ?, product_price = ?
       WHERE product_id = ?`,
      [name, description, price, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({
      message: 'Product updated successfully',
      data: { id, name, description, price },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM product WHERE product_id = ?', [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
