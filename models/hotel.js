const mongoose = require("mongoose");
const path = require("path");
const photoBasePath = "uploads/hotelPhotos";
const Room = require('./room')

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dailyPrice: {
    type: Number,
    required: true,
  },
  numberOfRooms: {
    type: Number,
    default: 1,
    required: true,
  },
  rooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  }],
  photoName: {
    type: String,
    required: true,
  },
});

hotelSchema.pre(/^find/, function (next) {
  this.populate({
    path: "rooms"
  });
  next();
});

hotelSchema.virtual("photoPath").get(function () {
  //not arrow function to use "this"
  if (this.photoName != null) {
    return path.join("/", photoBasePath, this.photoName);
  }
});

hotelSchema.statics.findHotelsWithVacantRooms = function() {
  return this.aggregate([
    {
      $lookup: {
        from: 'rooms',
        localField: 'rooms',
        foreignField: '_id',
        as: 'rooms'
      }
    },
    {
      $match: {
        'rooms.isVacant': true
      }
    }
  ]);
};

module.exports = mongoose.model("Hotel", hotelSchema);
module.exports.photoBasePath = photoBasePath;
