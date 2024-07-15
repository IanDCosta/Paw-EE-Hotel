const mongoose = require('mongoose')
const Pet = require('./pet')
const Reservation = require('./reservation')

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'customer'
    }
})

//run the method before remove customer
customerSchema.pre("deleteOne", async function (next) {
    try {
        const query = this.getFilter();
        const hasPet = await Pet.exists({ owner: query._id });
    
        if (hasPet) {
            next(new Error("This customer still has pets."));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Customer', customerSchema)