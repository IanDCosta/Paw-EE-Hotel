const express = require('express')
const router = express.Router() //usa router do express
const multer = require('multer')
const Room = require('../../models/room')
//const RoomOld = require('../../models/room')

const roomController = require('../../controllers/admin/roomManager')

//photo stuff
const fs = require('fs')
const path = require('path')
const uploadPath = path.join('public', Room.photoBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'] //image types accepted
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})
//photo stuff end

// rota all room
router.get('/', async (req, res) => {
    roomController.getRooms(req,res)
    /* let query = Room.find()
    if(req.query.roomNumber != null && req.query.roomNumber != ''){
        query = query.where('roomNumber').equals(req.query.roomNumber)
    }
    if(req.query.capacity != null && req.query.capacity != ''){
        query = query.where('capacity').equals(req.query.capacity) //regular expression
    }
    if (req.query.dailyPriceMin != null && req.query.dailyPriceMin != '') {
        query = query.gte('dailyPrice', req.query.dailyPriceMin)
    }
    if (req.query.dailyPriceMax != null && req.query.dailyPriceMax != '') {
        query = query.lte('dailyPrice', req.query.dailyPriceMax)
    }
    //has vacant rooms search parameter
    try {
        const room = await query.exec()
        res.render('admin/room/index', { 
            room: room, 
            searchOptions: req.query
         })
    } catch (err){
        console.log(err);
        
        res.redirect('/admin')
    } */
})

// rota new room, display form
router.get('/new', (req, res)=>{
    roomController.newRoomPage(req,res)
    /* res.render('admin/room/new', { 
        room: new Room(),
        isEditing: false
    }) */
})

// cria o room
router.post('/', upload.single('photo'), async (req, res)=>{
    roomController.newRoom(req,res)
    /* const filename = req.file != null ? req.file.filename : null

    const room = new Room({
        roomNumber: req.body.roomNumber,
        dailyPrice: req.body.dailyPrice,
        capacity: req.body.capacity,
        photoName: filename
    })

    try {
        const newRoom = await room.save() //will populate newRoom after saving room
        
        res.redirect(`manage-rooms/${newRoom.id}`)
    } catch {
        if (room.photoName != null){
            removePhoto(room.photoName)
        }
        res.render('admin/room/new', {
            room: room,
            isEditing: false,
            errorMessage: 'Error creating room'
        })
    } */
})

/* function removePhoto(filename){
    fs.unlink(path.join(uploadPath, filename), err => {
        if(err) console.error(err)
    })
} */

//see room profile
router.get('/:id', async (req, res) =>{
    roomController.viewRoom(req,res)
    /* try{
        const room = await Room.findById(req.params.id)
        res.render('admin/room/show', {
            room: room
        })
    } catch {
        res.redirect('/')
    } */
})

//edit room
router.get('/:id/edit', async (req, res) => {
    roomController.editRoomPage(req,res)
    /* try{
        const room = await Room.findById(req.params.id)
        res.render('admin/room/edit', { 
            room: room,
            isEditing: true
        })    
    } catch {
        res.redirect('/room')
    } */
})

//room edited
router.put('/:id', upload.single('photo'), async (req, res) => {
    roomController.editRoom(req,res)
    /* const filename = req.file != null ? req.file.filename : null
    let room
    try {
        room = await Room.findById(req.params.id)

        removePhoto(room.photoName)

        room.roomNumber = req.body.roomNumber
        room.dailyPrice = req.body.dailyPrice
        room.capacity = req.body.capacity
        room.photoName = filename

        await room.save() 
        res.redirect(`${room.id}`)
    } catch (err) {
        console.log(err)
        if (room == null) {
            res.redirect('/')
        } else {
            res.render('admin/room/edit', {
                room: room,
                isEditing: true,
                errorMessage: 'Error updating room'
            })
        }
    } */
})

//delete room
router.delete('/:id', async (req, res) => {
    roomController.deleteRoom(req,res)
    /* let room
    try {
        room = await Room.findById(req.params.id)

        if (room.photoName != null){
            removePhoto(room.photoName)
        }

        await room.deleteOne() //will remove room
        
        res.redirect('/admin/')
    } catch {
        if (room == null) {
            res.redirect('/')
        } else {
            res.redirect(`manage-rooms/${room.id}`)
        }
    } */
})

module.exports = router