const express = require('express')
const router = express.Router() //usa router do express
const Hotel = require('../../../models/hotel')

// rota all hotels
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i') //this way you can only type "mon" to find "monkey"
    }
    try {
        const hotel = await Hotel.find(searchOptions)
        res.render('hotel/index', { 
            hotel: hotel, 
            searchOptions: req.query
         })
    } catch {
        res.redirect('/')
    }
})

// rota new hotel, display form
router.get('/new', (req, res)=>{
    res.render('hotel/new', { hotel: new Hotel() })
})

// cria o hotel
router.post('/', async (req, res)=>{
    const hotel = new Hotel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    try {
        const newHotel = await hotel.save() //will populate newHotel after saving hotel
        res.redirect(`/hotel/${newHotel.id}`)
    } catch {
        res.render('hotel/new', {
            hotel: hotel,
            errorMessage: 'Error creating hotel'
        })
    }
})

//see hotel profile
router.get('/:id', (req, res) =>{
    res.send('Show Hotel ' + req.params.id)
})

//edit hotel
router.get('/:id/edit', async (req, res) => {
    try{
        const hotel = await Hotel.findById(req.params.id)
        res.render('hotel/edit', { hotel: hotel })    
    } catch {
        res.redirect('/hotel')
    }
    
})

//hotel edited
router.put('/:id', async (req, res) => {
    let hotel
    try {
        hotel = await Hotel.findById(req.params.id)

        hotel.name = req.body.name
        hotel.email = req.body.email
        hotel.password = req.body.password

        await hotel.save() //will populate newHotel after saving hotel
        res.redirect(`/hotel/${hotel.id}`)
    } catch {
        if (hotel == null) {
            res.redirect('/')
        } else {
            res.render('hotel/edit', {
                hotel: hotel,
                errorMessage: 'Error updating hotel'
            })
        }
    }
})

//delete hotel
router.delete('/:id', async (req, res) => {
    let hotel
    try {
        hotel = await Hotel.findById(req.params.id)
        await hotel.deleteOne() //will remove hotel
        res.redirect('/hotel')
    } catch {
        if (hotel == null) {
            res.redirect('/')
        } else {
            res.redirect(`/hotel/${hotel.id}`)
        }
    }
})
module.exports = router