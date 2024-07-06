const express = require('express')
const router = express.Router() //usa router do express
const Pet = require('../../models/pet')
const Customer = require('../../models/customer')

// rota all pets
router.get('/', async (req, res) => {
    res.send('rendering all')
})

// rota new pet, display form, must be above the /:id ones
router.get('/new', async (req, res)=>{
    try { 
        const owners = await Customer.find({})
        const pet = new Pet()
        res.render('/pet/new', {
            owners: owners,
            pet: pet
        })
    } catch {
        res.redirect('/pet')
    }
})

// cria o pet
router.post('/', async (req, res)=>{
    res.send('rendering create')
})

//see pet profile
router.get('/:id', async (req, res) =>{
    
})

//edit pet
router.get('/:id/edit', async (req, res) => {
    
    
})

//pet edited
router.put('/:id', async (req, res) => {
    
})

//delete pet
router.delete('/:id', async (req, res) => {
    
})

module.exports = router