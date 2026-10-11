
const express = require('express');
const morgan = require('morgan');
const winston = require('winston');

const app = express();
const PORT = 3000;

// Winston logger: logs to console and file
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
    ]
});

// Parse incoming JSON requests
app.use(express.json());

// Morgan: HTTP request logging
app.use(morgan('tiny'));
app.use(morgan('combined'));

// Custom middleware: log method, URL and timestamp
app.use((req, res, next) => {
    logger.info(
        `Incoming ${req.method} request at ${req.url}`,
        { timestamp: new Date().toISOString() }
    );
    next();
});

// In-memory orders
let orders = [
    { customer: 'Alice', item: 'Laptop', quantity: 2 },
    { customer: 'Bob', item: 'Banana', quantity: 3 }
];

// GET: Fetch all orders
app.get('/orders', (req, res) => {
    logger.info('Fetched all orders');
    res.status(200).json(orders);
});

// POST: Add a new order
app.post('/orders', (req, res) => {
    const { customer, item, quantity } = req.body;

    if (
        !customer ||
        !item ||
        quantity === undefined ||
        quantity === null ||
        quantity === '' ||
        !Number.isInteger(Number(quantity)) ||
        Number(quantity) <= 0
    ) {
        logger.error('Invalid order: Missing or invalid fields');
        return res.status(400).json({
            error: 'Invalid order: Missing fields.'
        });
    }

    const newOrder = {
        customer,
        item,
        quantity: Number(quantity),
        createdAt: new Date().toISOString()
    };

    orders.push(newOrder);

    logger.info(
        `New order placed by ${customer} for ${quantity} ${item}.`
    );

    res.status(201).json({
        message: 'Order placed successfully',
        order: newOrder
    });
});

// Handle unknown routes
app.use((req, res) => {
    logger.warn(`Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Route not found' });
});

// Error-handling middleware
app.use((err, req, res, next) => {
    logger.error(`Server error: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    logger.info(`Order management server running on port ${PORT}`);
});
