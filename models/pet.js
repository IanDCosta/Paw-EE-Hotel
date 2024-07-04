const mongoose = require('mongoose')

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: {
            value: ["Cat","Dog","Rodent","Monkey","Equine"]
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
        required: true
    },
    specialCare: {
        type: String,
        required: false
    },
    ownerName: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Pet', clientSchema)