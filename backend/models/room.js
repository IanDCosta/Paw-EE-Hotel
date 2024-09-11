const mongoose = require("mongoose");
const path = require("path");
const photoBasePath = "uploads/roomPhotos";

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
  },
  typology: {
    type: String,
    required: false,
  },
  dailyPrice: {
    type: Number,
    required: true,
  },
  isVacant: {
    type: Boolean,
    default: true,
  },
  capacity: {
    type: Number,
  },
  photoName: {
    type: String,
    required: true,
  },
});

roomSchema.virtual("photoPath").get(function () {
  //not arrow function to use "this"
  if (this.photoName != null) {
    return "/" + path.posix.join(photoBasePath, this.photoName);
  }
});

roomSchema.set("toObject", { virtuals: true });
roomSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Room", roomSchema);
module.exports.photoBasePath = photoBasePath;
