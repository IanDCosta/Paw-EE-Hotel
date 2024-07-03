const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {

    },
    rooms: [mongoose.Schema.Types.ObjectId]
})

module.exports = mongoose.model('Hotel', hotelSchema)