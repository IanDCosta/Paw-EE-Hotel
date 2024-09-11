const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  observations: {
    type: String,
    required: false,
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
        required: false,
      },
      age: {
        type: Number,
        required: false,
      },
    },
  ],
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  giftCard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GiftCard",
    required: false
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
    select: 'name',
  })
  .populate({
    path: 'room',
    select: {roomNumber: 1, photoName: 1},
  })
  .populate({
    path: 'giftCard',
    select: {description: 1, discount: 1}
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
