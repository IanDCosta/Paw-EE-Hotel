const express = require('express')
const router = express.Router() //usa router do express
const Reservation = require('../models/reservation')

router.get('/', async (req, res) => {
    let reservations

    try{
        reservations = await Reservation.find({ "state": "Pending" }).sort({ createdAt: 'desc' }).exec() //get the newest reservations first
    } catch {

    }
    res.render('index', { reservations: reservations }) //render a view index.ejs
})

module.exports = router