const mongoose = require('mongoose')
const path = require('path')
const photoBasePath = 'uploads/petPhotos'

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
    specialCare: {
        type: String,
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    photoName: {
        type: String,
        required: true
    },
    vaccines: {
        type: String, 
        required: false
    }
})

//middleware:
//the owner attributes is not populated, only the id is passed, this function will populate only the name of the owner
petSchema.pre(/^find/, function (next) { // /^find/ is a RegEx and will apply to all mongoose methods starting with "find"
    this.populate({
      path: "owner",
      select: "name", 
    });
    next();
  });

//to show image on index
petSchema.virtual('photoPath').get(function() { //not arrow function to use "this"
    if(this.photoName != null){
        return path.join('/', photoBasePath, this.photoName)
    }
})

module.exports = mongoose.model('Pet', petSchema)
module.exports.photoBasePath = photoBasePath