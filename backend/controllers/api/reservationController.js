const Reservation = require("../../models/reservation");
const Customer = require("../../models/customer")

var reservationController = {};

reservationController.getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find().exec();
    res.json(reservations);
  } catch (err) {
    next(err);
  }
};

reservationController.createReservation = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.body.customer).populate('giftCards');
    const giftCardId = req.body.giftCard;
    let appliedGiftCard = null;

    if (giftCardId) {
      appliedGiftCard = customer.giftCards.find(card => card._id.toString() === giftCardId);
      if (!appliedGiftCard) {
        return res.status(400).json({ error: "Invalid gift card selection." });
      }
    }

    let dailyPrice = req.body.dailyPrice;
    if (appliedGiftCard) {
      dailyPrice -= dailyPrice * (appliedGiftCard.discount / 100);
    }

    const reservation = new Reservation({
      observations: req.body.observations,
      room: req.body.room,
      dateBegin: new Date(req.body.dateBegin),
      dateEnd: new Date(req.body.dateEnd),
      occupants: req.body.occupants,
      customer: req.body.customer,
      dailyPrice: dailyPrice,
      state: req.body.state,
    });

    await reservation.save();

    if (appliedGiftCard) {
      const giftCardIndex = customer.giftCards.findIndex(card => card._id.toString() === giftCardId);
      if (giftCardIndex !== -1) {
        customer.giftCards.splice(giftCardIndex, 1);
        await customer.save();
      }
    }

    res.json(reservation);
  } catch (error) {
    next(error);
  }
};

reservationController.findReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    next(error);
  }
};

reservationController.updateReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, {
      observations: req.body.observations,
      room: req.body.room,
      dateBegin: req.body.dateBegin,
      dateEnd: req.body.dateEnd,
      occupants: req.body.occupants,
      customer: req.body.customer,
      dailyPrice: req.body.dailyPrice,
      state: req.body.state,
    });

    await reservation.save();
    res.json(reservation);
  } catch (error) {
    next(error);
  }
};

reservationController.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

module.exports = reservationController;
