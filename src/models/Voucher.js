const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Voucher = new Schema({
    code: { type: String, require: true },
    discount: { type: Number, require: true },
    status: { type: Boolean, default: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    expried: { type: String },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Voucher', Voucher)