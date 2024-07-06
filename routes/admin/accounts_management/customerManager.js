const express = require('express')
const router = express.Router() //usa router do express
const Customer = require('../../../models/customer')
const Pet = require('../../../models/pet')

// rota all customers
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i') //this way you can only type "mon" to find "monkey"
    }
    try {
        const customer = await Customer.find(searchOptions)
        res.render('customer/index', { 
            customer: customer, 
            searchOptions: req.query
         })
    } catch {
        res.redirect('/')
    }
})

// rota new customer, display form
router.get('/new', (req, res)=>{
    res.render('customer/new', { customer: new Customer() })
})

// cria o customer
router.post('/', async (req, res)=>{
    const customer = new Customer({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        contact: req.body.contact,
        address: req.body.address
    })
    try {
        const newCustomer = await customer.save() //will populate newCustomer after saving customer
        res.redirect(`/customer/${newCustomer.id}`)
    } catch {
        res.render('customer/new', {
            customer: customer,
            errorMessage: 'Error creating customer'
        })
    }
})

//see customer profile
router.get('/:id', async (req, res) =>{
    try{
        const customer = await Customer.findById(req.params.id)
        const pets = await Pet.find({ owner: customer.id }).exec()
        res.render('customer/show', {
            customer: customer,
            petsByCustomer: pets
        })
    } catch {
        res.redirect('/')
    }
})

//edit customer
router.get('/:id/edit', async (req, res) => {
    try{
        const customer = await Customer.findById(req.params.id)
        res.render('customer/edit', { customer: customer })    
    } catch {
        res.redirect('/customer')
    }
    
})

//customer edited
router.put('/:id', async (req, res) => {
    let customer
    try {
        customer = await Customer.findById(req.params.id)

        customer.name = req.body.name
        customer.email = req.body.email
        customer.password = req.body.password
        customer.contact = req.body.contact
        customer.address = req.body.address

        await customer.save() 
        res.redirect(`/customer/${customer.id}`)
    } catch {
        if (customer == null) {
            res.redirect('/')
        } else {
            res.render('customer/edit', {
                customer: customer,
                errorMessage: 'Error updating customer'
            })
        }
    }
})

//delete customer
router.delete('/:id', async (req, res) => {
    let customer
    try {
        customer = await Customer.findById(req.params.id)
        await customer.deleteOne() //will remove customer
        res.redirect('/customer')
    } catch {
        if (customer == null) {
            res.redirect('/')
        } else {
            res.redirect(`/customer/${customer.id}`)
        }
    }
})

module.exports = router