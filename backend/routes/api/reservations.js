var express = require('express');
var router = express.Router();

const reservationController = require('../../controllers/api/reservationController.js')

router.get('/reservations', reservationController.getAllReservations)
router.post('/reservations', reservationController.createReservation)
router.get('/reservations/:id', reservationController.findReservation)
router.put('/reservations/:id', reservationController.updateReservation)
router.delete('/reservations/:id', reservationController.deleteReservation)

module.exports = router;