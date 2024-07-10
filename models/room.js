const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true
    },
    isVacant: {
        type: Boolean,
        default: true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Hotel"
    }
})

module.exports = mongoose.model('Room', roomSchema)