const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FlashSale = new Schema({
    product: { type: mongoose.Schema.Types.String, ref: "Product" },
    current_sale: { type: Number, require: true }, // giảm giá hiện tại
    date_sale: { type: String }, // Ngày sales
    point_sale: { type: Number, require: true }, // khung giờ sale trong ngày
    time_sale: { type: Number, require: true, default: 3 }, // Thời gian sale
    num_sale: { type: Number, require: true }, // số lượng bày bán
    sold_sale: { type: Number, require: true, default: 0}, // Số lượng đã bán
    is_loop: { type: Boolean, require: true, default: false }, // có lặp lại hay không    
});
    
module.exports = mongoose.model("FlashSale", FlashSale);
