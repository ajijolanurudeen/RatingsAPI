const productModel = require("../models/product.model")

//CREATE PRODUCT
const createProduct = async({product_name,product_description,product_price}) =>{
    if(!product_name||!product_description||!product_price){
        throw new Error("missing required fields")
    }
    const existingProduct = await productModel.getOneProduct(product_name)        
    if (existingProduct){
        throw new Error("This product already exists")
    }

    const newProduct = await productModel.createProduct(
        product_name,
        product_description,
        product_price
    )

    return{
        message: "product created succesfully",
        product: {
            id: newProduct.product_id,
            name: newProduct.product_name,
            price: newProduct.product_price
        }
    };
};

[]
//GET ALL PRODUCTS
const getAllProducts = async({page =1, limit = 10})=>{
    page = Number(page);
    limit = Number(limit);
    if (!Number.isInteger(page) || page < 1) page = 1;
    if (!Number.isInteger(limit) || limit < 1) limit = 10;
        const offset = (page -1)* limit;
            return await productModel.getAllProducts(limit,offset)
}

//GET ONE PRODUCT
const getOneProduct =  async(product_name)=>{
    if(!product_name){
        throw new Error("product name is required")
    }
    return await productModel.getOneProduct(product_name)
}

//GET PRODUCT BY ID
const getProductById = async(product_id) =>{
    if(!product_id){
        throw new Error("product id is required");
    }
    return await productModel.getProductById(product_id)
}

//UPDATE PRODUCT
const updateProduct = async(product_id, data)=>{
    const {product_name,product_price,product_description} = data;

    const existingProduct = await productModel.getProductById(product_id);
    if (!existingProduct){
        const error =new Error("product not found");
        error.status = 404;
        throw error;
    }
    const updatedFields = {};

    if (product_name) updatedFields.product_name = product_name;
    if (product_price) updatedFields.product_price = product_price;
    if (product_description) updatedFields.product_description = product_description;

    if (Object.keys(updatedFields).length === 0){
        const error = new Error("no fields to update");
        error.status = 400;
        throw error
    }
    await productModel.updateProduct(product_id,updatedFields);

    return{
        message: 'product updated succesfully',
        updated: Object.keys(updatedFields),
    }
}

//DELETE PRODUCT
const deleteProduct = async(product_id)=>{
    const deleted = await productModel.deleteProduct(product_id)
    if(!deleted){
        throw new Error("product not found or unauthorized");
    }
    return deleted
}

module.exports = {
    createProduct,
    getAllProducts,
    getOneProduct,
    getProductById,
    updateProduct,
    deleteProduct
}