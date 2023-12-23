const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema({
    title: { type: String, require: true },
    author: { type: String, require: true },
    published_date: { type: String },
    price: { type: Number, require: true },
    containprice: { type: Number, default: 1 }, // lưu trữ giá bán khi hết flashsale
    old_price: { type: Number, require: true },
    rate: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    desciption: { type: String, require: true },
    status: { type: String, require: true, default: "Còn hàng" },
    images: { type: String },
    list_Images: { type: String },
    status_sell: { type: Boolean, default: true },
    quantity: { type: Number },
    categoryId: { type: mongoose.Schema.Types.String, ref: "Category" },
});

module.exports = mongoose.model("Product", Product);
