const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true
    },
    isVacant: {
        type: boolean,
        default: false
    }
})

module.exports = mongoose.model('Room', roomSchema)