const mongoose = require('mongoose');

// Item Schema
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
