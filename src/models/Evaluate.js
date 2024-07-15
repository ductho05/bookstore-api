const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Evaluate = new Schema({
    rate: { type: Number },
    comment: { type: String },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ]
}, {
    timestamps: true,
})

module.exports = mongoose.model('Evaluate', Evaluate)