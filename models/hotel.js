const mongoose = require('mongoose')
const path = require('path')
const photoBasePath = 'uploads/hotelPhotos'

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    dailyPrice: {
        type: Number,
        required: true
    },
    numberOfRooms: {
        type: Number,
        default: 1,
        required: true
    },
    rooms: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Room'
    },
    photoName: {
        type: String,
        required: true
    }
})

hotelSchema.virtual('photoPath').get(function() { //not arrow function to use "this"
    if(this.photoName != null){
        return path.join('/', photoBasePath, this.photoName)
    }
})

module.exports = mongoose.model('Hotel', hotelSchema)
module.exports.photoBasePath = photoBasePath