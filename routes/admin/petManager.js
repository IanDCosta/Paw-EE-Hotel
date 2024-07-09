const express = require('express')
const router = express.Router() //usa router do express
const multer = require('multer')
const Pet = require('../../models/pet')
const Customer = require('../../models/customer')
const fs = require('fs')
const path = require('path')
const uploadPath = path.join('public', Pet.photoBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'] //image types accepted
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// rota all pets
router.get('/', async (req, res) => {
    let query = Pet.find()
    if(req.query.name != null && req.query != ''){
        query = query.regex('name', new RegExp(req.query.name, 'i')) //regular expression
    }
    if(req.query.category != null && req.query != ''){
        query = query.regex('category', new RegExp(req.query.category, 'i')) //regular expression
    }
    try {
        const pet = await query.exec()
        res.render('pet/index', { 
            pet: pet, 
            searchOptions: req.query
         })
    } catch {
        res.redirect('/')
    }
})

// rota new pet, display form, must be above the /:id ones
router.get('/new', async (req, res)=>{
    renderNewPage(res, new Pet())
})

// cria o pet
router.post('/', upload.single('photo'), async (req, res)=>{
    const filename = req.file != null ? req.file.filename : null
    const pet = new Pet({
        name: req.body.name,
        category: req.body.category,
        race: req.body.race,
        vaccines: req.body.vaccines,
        specialCare: req.body.specialCare,
        owner: req.body.owner,
        photoName: filename
    })

    try{
        const newPet = await pet.save()
        res.reditect(`pet/${newPet.id}`)
        //res.redirect(`pet`)
    } catch {
        if (pet.photoName != null){
            removePhoto(pet.photoName)
        }
        renderNewPage(res, pet, true)
    }
})

function removePhoto(filename){
    fs.unlink(path.join(uploadPath, filename), err => {
        if(err) console.error(err)
    })
}

async function renderNewPage(res, pet, hasError = false) {
    try { 
        const owners = await Customer.find({})
        const categories = ["Cat","Dog","Hamster","Monkey","Equine"]
        const params = {
            owners: owners,
            pet: pet,
            categories: categories
        }
        if (hasError) params.errorMessage = 'Error Creating Pet'
        res.render('pet/new', params)
    } catch {
        res.redirect('/pet')
    }
}

//see pet profile
router.get('/:id', async (req, res) =>{
    try{
        const pet = await Pet.findById(req.params.id)
        res.render('pet/show', {
            pet: pet
        })
    } catch {
        res.redirect('/')
    }
})

//edit pet
router.get('/:id/edit', async (req, res) => {
    
    
})

//pet edited
router.put('/:id', async (req, res) => {
    
})

//delete pet
router.delete('/:id', async (req, res) => {
    let pet
    try {
        pet = await Pet.findById(req.params.id)
        await pet.deleteOne() //will remove pet
        res.redirect('/pet')
    } catch {
        if (pet == null) {
            res.redirect('/')
        } else {
            res.redirect(`/pet/${pet.id}`)
        }
    }
})

module.exports = router