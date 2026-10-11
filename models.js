
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productNo: {
        type: Number,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);
