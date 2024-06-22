const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    isManager: { type: Boolean, default: false },
    username: { type: String, require: true },
    password: { type: String, require: true },
    fullName: { type: String, default: "" },
    images: { type: String, default: "https://www.iconpacks.net/icons/1/free-user-icon-972-thumb.png" },
    gender: { type: String, default: "" },
    email: { type: String, require: true },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    phoneNumber: { type: String, required: false },
    birth: { type: String, default: "" },
    facebookId: { type: String, require: true },
    sw_id: { type: Object },
    socket_id: { type: String },
    device_token: { type: String },
    isLock: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', User)
