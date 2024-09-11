const express = require("express");
const router = express.Router(); //usa router do express
const Reservation = require("../../models/reservation");
const Customer = require("../../models/customer");
const Room = require("../../models/room");

const reservationController = require('../../controllers/staff/reservationManager')

// rota all reservations
router.get("/", async (req, res) => {
  reservationController.getReservations(req,res)
});

// rota new reservation, display form, must be above the /:id ones
router.get("/new", async (req, res) => {
  reservationController.newReservationPage(req,res)
});

router.post("/new/choose", async (req, res) => {
  reservationController.newReservationChoseRoom(req,res)
});

// cria o reservation
router.post("/", async (req, res) => {
  reservationController.newReservation(req,res)
});

//see reservation
router.get("/:id", async (req, res) => {
  reservationController.viewReservation(req,res)
});

//edit reservation
router.get("/:id/edit", async (req, res) => {
  reservationController.editReservationPage(req,res)
});

//reservation edited
router.put("/:id", async (req, res) => {
  reservationController.editReservation(req,res)
});

//delete reservation
router.delete("/:id", async (req, res) => {
  reservationController.deleteReservation(req,res)
});

module.exports = router;
