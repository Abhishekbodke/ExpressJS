
const express = require('express');
const connectDB = require('./db');
const Product = require('./models/Product');

const app = express();
const PORT = 3000;

app.use(express.json());

// Connect to MongoDB, then start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// POST: Add a product
app.post('/', async (req, res, next) => {
    try {
        const { productNo, productName, quantity, price } = req.body;

        if (
            productNo === undefined ||
            productName === undefined ||
            !String(productName).trim() ||
            quantity === undefined ||
            price === undefined ||
            !Number.isFinite(Number(productNo)) ||
            !Number.isFinite(Number(quantity)) ||
            !Number.isFinite(Number(price))
        ) {
            return res.status(400).json({
                error: 'All product fields are required and must be valid'
            });
        }

        const product = new Product({
            productNo: Number(productNo),
            productName: String(productName).trim(),
            quantity: Number(quantity),
            price: Number(price)
        });

        const savedProduct = await product.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        next(error);
    }
});

// GET: Retrieve all products
app.get('/allProducts', async (req, res, next) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
});

// 404 middleware
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

// General error-handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        error: 'Internal server error'
    });
});
