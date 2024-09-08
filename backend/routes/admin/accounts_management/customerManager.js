const express = require('express')
const router = express.Router() //usa router do express
const Customer = require('../../../models/customer')
const bcrypt = require("bcrypt")

const customerController = require('../../../controllers/admin/customerManager')

// rota all customers
router.get('/', async (req, res) => {
    customerController.getCustomers(req,res)
    /*     let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i') //this way you can only type "mon" to find "monkey"
    }
    try {
        const customer = await Customer.find(searchOptions)
        res.render('admin/account_management/customer/index', { 
            customer: customer, 
            searchOptions: req.query
         })
    } catch {
        res.redirect('/')
    }*/
})

// rota new customer, display form
router.get('/new', (req, res)=>{
    customerController.newCustomerPage(req,res)
    //res.render('admin/account_management/customer/new', { customer: new Customer() })
})

// cria o customer
router.post('/', async (req, res)=>{
    customerController.newCustomer(req,res)
    /* const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const customer = new Customer({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        contact: req.body.contact,
        address: req.body.address
    })
    try {
        const newCustomer = await customer.save() //will populate newCustomer after saving customer
        res.redirect(`customer/${newCustomer.id}`)
    } catch {
        res.render('admin/account_management/customer/new', {
            customer: customer,
            errorMessage: 'Error creating customer'
        })
    } */
})

//see customer profile
router.get('/:id', async (req, res) =>{
    customerController.viewCustomer(req,res)
    /* try{
        const customer = await Customer.findById(req.params.id)
        const pets = await Pet.find({ owner: customer.id }).exec()
        res.render('admin/account_management/customer/show', {
            customer: customer,
            petsByCustomer: pets
        })
    } catch {
        res.redirect('/')
    } */
})

//edit customer
router.get('/:id/edit', async (req, res) => {
    customerController.editCustomerPage(req,res)
    /* try{
        const customer = await Customer.findById(req.params.id)
        res.render('admin/account_management/customer/edit', { customer: customer })    
    } catch {
        res.redirect('/customer')
    } */
})

//customer edited
router.put('/:id', async (req, res) => {
    customerController.editCustomer(req,res)
    /* let customer
    try {
        customer = await Customer.findById(req.params.id)

        customer.name = req.body.name
        customer.email = req.body.email
        customer.password = req.body.password
        customer.contact = req.body.contact
        customer.address = req.body.address

        await customer.save() 
        res.redirect(`${customer.id}`)
    } catch {
        if (customer == null) {
            res.redirect('/')
        } else {
            res.render('admin/account_management/customer/edit', {
                customer: customer,
                errorMessage: 'Error updating customer'
            })
        }
    } */
})

//delete customer
router.delete('/:id', async (req, res) => {
    customerController.deleteCustomer(req,res)
    /* let customer
    try {
        customer = await Customer.findById(req.params.id)
        //await customer.deleteOne() //will remove customer
        customer.state = "Inactive";
        await customer.save();
        res.redirect('/')
    } catch (err) {
        console.log(err)
        if (customer == null) {
            res.redirect('/')
        } else {
            res.redirect(`${customer.id}`)
        }
    } */
})

module.exports = router