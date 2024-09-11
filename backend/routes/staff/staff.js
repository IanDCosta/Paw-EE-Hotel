const express = require("express");
const router = express.Router();

const Reservation = require("../../models/reservation");

const reservationManagementRouter = require("./reservationManager");
const giftCardManagementRouter = require("./giftCardManager");

router.use("/manage-reservations", reservationManagementRouter);
router.use("/manage-giftCards", giftCardManagementRouter);

router.get("/", async (req, res) => {
  res.redirect('/staff/manage-reservations');
});

module.exports = router;
