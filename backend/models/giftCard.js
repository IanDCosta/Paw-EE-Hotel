const mongoose = require("mongoose");

const giftCardSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("GiftCard", giftCardSchema);