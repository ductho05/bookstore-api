const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Shipper = new Schema(
  {
    isManager: { type: Boolean, default: false },
    username: { type: String, require: true },
    password: { type: String, require: true },
    fullName: { type: String, default: "" },
    images: {
      type: String,
      default: "https://www.iconpacks.net/icons/1/free-user-icon-972-thumb.png",
    },
    gender: { type: String, default: "" },
    email: { type: String, require: true },
    city: { type: String, default: "" },
    phoneNumber: { type: String, required: false },
    // birth: { type: String, default: "" },
    isLock: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    money: {
      type: Number,
      default: 0,
    },
    bankName: { type: String, default: "" },
    bankNumber: { type: String, default: "" },
    bankUser: { type: String, default: "" },
    isDraw: { type: Boolean, default: false },
    drawingMoney: {
      type: Number,
      default: 0,
    },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Shipper", Shipper);
