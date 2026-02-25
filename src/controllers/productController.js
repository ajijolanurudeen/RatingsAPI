const express = require('express');
const productService = require("../service/product.service")

// CREATE PRODUCT
const createProduct = async (req, res,next) => {
  try {
    const product = await productService.createProduct({
      product_name: req.body.product_name,
      product_description: req.body.product_description,
      product_price: req.body.product_price
    })
    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
};

// GET ALL PRODUCTS WITH RATINGS SUMMARY
const getAllProducts = async (req, res,next) => {
  try {
    const products = await productService.getAllProducts({
      page: Number(req.query.page),
      limit: Number(req.query.limit)
    })
      res.json(products)
  } catch (err) {
    next(err)
  }
};


// GET ONE PRODUCT
const getProductById = async (req, res,next) => {
  try {
    const product = await productService.getProductById(
      req.params.product_id
    )
    res.json(product)
  } catch (err) {
    next(err)
  }  
};

// UPDATE PRODUCT
const updateProduct = async (req, res,next) => {
 try {
  const result =await productService.updateProduct(
    req.params.product_id,
    req.body
  )
  return res.status(200).json(result)
 } catch (error) {
  return res.status(error.status || 500).json({
    message: error.message || "Intrnal server errorr",
  })
 }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
try {
  const result = await productService.deleteProduct(req.params.product_id)

  return res.status(200).json(result);
} catch (error) {
  return res.status(error.status || 500).json({
    message: error.message || "internal server error"
  })
}
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
