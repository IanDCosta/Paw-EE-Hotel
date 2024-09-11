const express = require('express')
const router = express.Router() //usa router do express
const Customer = require('../../../models/customer')
const bcrypt = require("bcrypt")

const customerController = require('../../../controllers/admin/customerManager')

// rota all customers
router.get('/', async (req, res) => {
    customerController.getCustomers(req,res)
})

// rota new customer, display form
router.get('/new', (req, res)=>{
    customerController.newCustomerPage(req,res)
})

// cria o customer
router.post('/', async (req, res)=>{
    customerController.newCustomer(req,res)
})

//see customer profile
router.get('/:id', async (req, res) =>{
    customerController.viewCustomer(req,res)
})

//edit customer
router.get('/:id/edit', async (req, res) => {
    customerController.editCustomerPage(req,res)
})

//customer edited
router.put('/:id', async (req, res) => {
    customerController.editCustomer(req,res)
})

//delete customer
router.delete('/:id', async (req, res) => {
    customerController.deleteCustomer(req,res)
})

module.exports = router