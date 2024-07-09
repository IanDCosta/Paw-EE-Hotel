const express = require('express')
const router = express.Router() //usa router do express
const Reservation = require('../../models/reservation')
const Hotel = require('../../models/hotel')
const Pet = require('../../models/pet')

// rota all reservations
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i') 
    }
    try {
        const reservation = await Reservation.find(searchOptions)
        res.render('reservation/index', { 
            reservation: reservation, 
            searchOptions: req.query
         })
    } catch {
        res.redirect('/')
    }
})

// rota new reservation, display form, must be above the /:id ones
router.get('/new', (req, res)=>{
    renderNewPage(res, new Reservation())
})

// cria o reservation
router.post('/', async (req, res)=>{
    const pet = req.body.pet
    const customer = Pet.findById(pet).owner
    
    const reservation = new Reservation({
        code: req.body.code,
        location: req.body.location,
        dateBegin: req.body.dateBegin,
        dateEnd: req.body.dateEnd,
        pet: pet,
        customer: customer
    })

    try {
        const newReservation = await reservation.save() //will populate newReservation after saving reservation
        res.redirect(`/reservation/${newReservation.id}`)
    } catch (err) {
        renderNewPage(res, reservation, true)
        console.log(err)
    }
})

async function renderNewPage(res, reservation, hasError = false) {
    try { 
        const hotels = await Hotel.find({})
        const pets = await Pet.find({})
        const params = {
            hotels: hotels,
            pets: pets,
            reservation: reservation
        }
        if (hasError) params.errorMessage = 'Error Creating Reservation'
        res.render('reservation/new', params)
    } catch {
        res.redirect('/reservation')
    }
}

//see reservation
router.get('/:id', async (req, res) =>{
    try{
        const reservation = await Reservation.findById(req.params.id)
        res.render('reservation/show', {
            reservation: reservation
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

//edit reservation
router.get('/:id/edit', async (req, res) => {
    try{
        const reservation = await Reservation.findById(req.params.id)
        res.render('reservation/edit', { reservation: reservation })    
    } catch {
        res.redirect('/reservation')
    }
    
})

//reservation edited
router.put('/:id', async (req, res) => {
    let reservation
    try {
        reservation = await Reservation.findById(req.params.id)

        reservation.name = req.body.name
        reservation.email = req.body.email
        reservation.password = req.body.password

        await reservation.save() //will populate newReservation after saving reservation
        res.redirect(`/reservation/${reservation.id}`)
    } catch {
        if (reservation == null) {
            res.redirect('/')
        } else {
            res.render('reservation/edit', {
                reservation: reservation,
                errorMessage: 'Error updating reservation'
            })
        }
    }
})

//delete reservation
router.delete('/:id', async (req, res) => {
    let reservation
    try {
        reservation = await Reservation.findById(req.params.id)
        await reservation.deleteOne() //will remove reservation
        res.redirect('/reservation')
    } catch {
        if (reservation == null) {
            res.redirect('/')
        } else {
            res.redirect(`/reservation/${reservation.id}`)
        }
    }
})

module.exports = router