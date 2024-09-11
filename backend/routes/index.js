const express = require("express");
const router = express.Router(); //usa router do express
const Reservation = require("../models/reservation");

//index route
router.get("/", async (req, res) => {
  let reservations;
  try {
    reservations = await Reservation.find({ state: "Pending" })
      .sort({ createdAt: "desc" })
      .exec();
  } catch {}
  res.render("index", { reservations: reservations, user: req.user});
});

module.exports = router;
