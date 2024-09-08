const mongoose = require("mongoose");
/* const Hotel = require('./hotel')
const Room = require('./room')
 */

const reservationSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Room",
  },
  dateBegin: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
  },
  occupants: [
    {
      name: {
        type: String,
        required: false, //!
      },
      age: {
        type: Number,
        required: false, //!
      },
    },
  ],
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
    path: 'customer',
    select: 'name', // Only populate the 'name' field from the customer
  })
  .populate({
    path: 'room',
    select: {roomNumber: 1, photoName: 1}, // Optionally populate the room if needed
  });
  
  next();
});

/* reservationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "customer",
    select: { name: 1 },
  });
  next();
});

reservationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "room",
    select: { roomNumber: 1 },
  });
  next();
});
 */
reservationSchema.pre("deleteOne", async function (next) {
  try {
    const query = this.getFilter();

    const reservation = await this.model.findOne(query);

    if (reservation && reservation.state !== "Cancelled") {
      next(
        new Error("This reservation is not cancelled thus cannot be deleted.")
      );
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Reservation", reservationSchema);
