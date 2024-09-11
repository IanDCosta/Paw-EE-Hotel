const mongoose = require("mongoose");
const Reservation = require("./reservation");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  giftCards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GiftCard",
      required: false
    },
  ],
  role: {
    type: String,
    required: true,
    default: "customer",
  },
  state: {
    type: String,
    enum: {
      values: ["Active", "Inactive"],
    },
    default: "Active",
  },
});

customerSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'giftCards', 
    select: { description: 1, discount: 1 },
  });
  next();
});

//run the method before remove customer
customerSchema.pre("deleteOne", async function (next) {
  try {
    const query = this.getFilter();
    const hasReservation = await Reservation.exists({ customer: query._id });

    if (hasReservation) {
      next(new Error("This customer still has reservations."));
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

customerSchema.pre("save", async function (next) {
  if (this.isModified("state") && this.state === "Inactive") {
    try {
      // Check if the customer has any reservations
      const hasReservations = await Reservation.exists({ customer: this._id });

      if (hasReservations) {
        // Prevent state change if reservations exist
        return next(
          new Error(
            "Cannot change state to 'Inactive' because the customer has reservations."
          )
        );
      }
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("Customer", customerSchema);
