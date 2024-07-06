const mongoose = require('mongoose')

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: {
            values: ["Cat","Dog","Rodent","Monkey","Equine"]
        }
    },
    race: {
        type: String,
        required: false
    },
    photoName: {
        type: String,
        required: true
    },
    vaccines: {
        type: Number,
        required: false
    },
    specialCare: {
        type: String,
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    }
})

module.exports = mongoose.model('Pet', petSchema)