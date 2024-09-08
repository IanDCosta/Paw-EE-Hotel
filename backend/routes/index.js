const express = require("express");
const router = express.Router(); //usa router do express
const Reservation = require("../models/reservation");

//index route
router.get("/", async (req, res) => {
  let reservations;
  //res.locals.title = "Abel's Home Page";
  try {
    reservations = await Reservation.find({ state: "Pending" })
      .sort({ createdAt: "desc" })
      .exec(); //get the newest reservations first
  } catch {}
  res.render("index", { reservations: reservations, user: req.user}); //render a view index.ejs
});
//index route

module.exports = router;
