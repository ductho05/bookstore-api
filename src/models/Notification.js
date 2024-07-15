const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Notification = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        url: { type: String, required: true },
        largeImage: String,
        linking: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Notification', Notification)
