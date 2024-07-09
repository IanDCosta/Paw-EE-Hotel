const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true
    },
    isVacant: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Room', roomSchema)