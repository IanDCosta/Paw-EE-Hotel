const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  location: {
    //hotel + room
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Hotel",
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
    ref: "Customer"
  },
  dailyPrice: {
    type: Number
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
    select: "owner",
  });
  next();
});

reservationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "location",
    select: "dailyPrice",
  });
  next();
});

module.exports = mongoose.model("Reservation", reservationSchema);
