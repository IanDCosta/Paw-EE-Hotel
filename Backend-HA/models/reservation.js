const mongoose = require("mongoose");
/* const Hotel = require('./hotel')
const Room = require('./room')
 */

const reservationSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  location: {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Hotel",
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Room",
    },
  },
  dateBegin: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Pet",
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  dailyPrice: {
    type: Number,
  },
  state: {
    type: String,
    enum: {
      values: ["Pending", "Confirmed", "Paid", "Cancelled"],
    },
    default: "Pending",
  },
});

reservationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "pet",
    select: { owner: 1, name: 1 },
  });
  next();
});

reservationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "customer",
    select: "name",
  });
  next();
});

reservationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "location",
    populate: [
      {
        path: "hotel",
        select: { name: 1, address: 1 },
      },
      {
        path: "room",
        select: { roomNumber: 1 }
      },
    ],
  });
  next();
});

module.exports = mongoose.model("Reservation", reservationSchema);
