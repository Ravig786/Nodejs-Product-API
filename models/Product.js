const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    files: [Object],
}, {
    timestamps: true,
});

const Product = mongoose.model("product", ProductSchema);

module.exports = Product;