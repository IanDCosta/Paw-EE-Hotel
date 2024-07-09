const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({
    location: { //hotel + room
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    dateBegin: {
        type: Date,
        required: true
    },
    dateEnd: {
        type: Date,
        required: true
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Pet"
    },
    customerName: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        enum: {
            values: ["Pending","Confirmed","Paid","Cancelled"]
        }
    }
})

module.exports = mongoose.model('Reservation', reservationSchema)