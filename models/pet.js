const mongoose = require('mongoose')

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Client"
    }
})

module.exports = mongoose.model('Pet', clientSchema)