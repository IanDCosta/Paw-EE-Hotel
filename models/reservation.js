const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    location: {
        //um hotel tem varios quartos?, faço a location ser o hotel + o numero do quarto?
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

module.exports = mongoose.model('Admin', adminSchema)