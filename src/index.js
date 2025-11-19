const express = require('express');
const dotenv = require('dotenv').config()
const db = require("./DB/db")
const bodyParser = require('body-parser')
const productRoutes = require('./routes/productRoute');
const ratingRoutes = require('./routes/ratingRoute');
const userRoutes = require('./routes/userRoute')
const app = express()
app.use(express.json())


app.use('/users',userRoutes)
app.use("/products",productRoutes)
app.use("/ratings",ratingRoutes)

const PORT = process.env.PORT || 5000

const start = async(req,res)=>{
    app.listen(PORT,()=>{
        console.log(`app is listening on Port ${PORT}`)
    })
};

start();