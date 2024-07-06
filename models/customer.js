const mongoose = require('mongoose')
const Pet = require('./pet')

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
    }
})

//run the method before remove customer
customerSchema.pre('remove', function(next) {
    Pet.find({ owner: this.customer.id }, (err, pet) => {
        if(err){
            next(err)
        } else if (pet.length > 0) {
            next(new Error('This customer has pets'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Customer', customerSchema)