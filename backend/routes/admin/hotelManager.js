const express = require('express')
const router = express.Router() //usa router do express
const multer = require('multer')
const Hotel = require('../../models/hotel')
const Room = require('../../models/room')
const fs = require('fs')
const path = require('path')
const uploadPath = path.join('public', Hotel.photoBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'] //image types accepted
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// rota all hotels
router.get('/', async (req, res) => {
    let query = Hotel.find()
    if(req.query.name != null && req.query != ''){
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    if(req.query.address != null && req.query != ''){
        query = query.regex('address', new RegExp(req.query.address, 'i')) //regular expression
    }
    if (req.query.dailyPriceMin != null && req.query.dailyPriceMin != '') {
        query = query.gte('dailyPrice', req.query.dailyPriceMin)
    }
    if (req.query.dailyPriceMax != null && req.query.dailyPriceMax != '') {
        query = query.lte('dailyPrice', req.query.dailyPriceMax)
    }
    //has vacant rooms search parameter
    try {
        const hotel = await query.exec()
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
    res.render('hotel/new', { 
        hotel: new Hotel(),
        isEditing: false
    })
})

// cria o hotel
router.post('/', upload.single('photo'), async (req, res)=>{
    const filename = req.file != null ? req.file.filename : null

    const hotel = new Hotel({
        name: req.body.name,
        address: req.body.address,
        dailyPrice: req.body.dailyPrice,
        numberOfRooms: req.body.numberOfRooms,
        photoName: filename
    })

    const rooms = []
    for(let i = 0; i < req.body.numberOfRooms; i++){
        let room = new Room({
            roomNumber: i + 1,
            isVacant: true,
            hotel: hotel.id
        })
        await room.save()
        rooms.push(room._id)
    };

    hotel.rooms = rooms;

    try {
        const newHotel = await hotel.save() //will populate newHotel after saving hotel
        
        res.redirect(`/hotel/${newHotel.id}`)
    } catch {
        if (hotel.photoName != null){
            removePhoto(hotel.photoName)
        }
        res.render('hotel/new', {
            hotel: hotel,
            isEditing: false,
            errorMessage: 'Error creating hotel'
        })
    }
})

function removePhoto(filename){
    fs.unlink(path.join(uploadPath, filename), err => {
        if(err) console.error(err)
    })
}

//see hotel profile
router.get('/:id', async (req, res) =>{
    try{
        const hotel = await Hotel.findById(req.params.id)
        res.render('hotel/show', {
            hotel: hotel
        })
    } catch {
        res.redirect('/')
    }
})

//edit hotel
router.get('/:id/edit', async (req, res) => {
    try{
        const hotel = await Hotel.findById(req.params.id)
        res.render('hotel/edit', { 
            hotel: hotel,
            isEditing: true
        })    
    } catch {
        res.redirect('/hotel')
    }
    
})

//hotel edited
router.put('/:id', upload.single('photo'), async (req, res) => {
    const filename = req.file != null ? req.file.filename : null
    let hotel
    try {
        hotel = await Hotel.findById(req.params.id)

        removePhoto(hotel.photoName)

        hotel.name = req.body.name
        hotel.address = req.body.address
        hotel.dailyPrice = req.body.dailyPrice
        hotel.photoName = filename

        await hotel.save() 
        res.redirect(`/hotel/${hotel.id}`)
    } catch (err) {
        console.log(err)
        if (hotel == null) {
            res.redirect('/')
        } else {
            res.render('hotel/edit', {
                hotel: hotel,
                isEditing: true,
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

        hotel.rooms.forEach(async room =>{
            await Room.findByIdAndDelete(room)
        })

        if (hotel.photoName != null){
            removePhoto(hotel.photoName)
        }

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