const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema({
    _id: { type: String, unique: true, required: true },
    name: { type: String, require: true },
    status: { type: Boolean, default: true },
    field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field' }
})

module.exports = mongoose.model("Category", Category)
