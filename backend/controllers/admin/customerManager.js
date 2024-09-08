const express = require('express')
const router = express.Router() //usa router do express
const Customer = require('../../models/customer')
const Reservation = require('../../models/reservation')
const bcrypt = require("bcrypt")

customerController = {}

// rota all customers
customerController.getCustomers = async (req, res) => {
    let searchOptions = {}
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
    }
}

// rota new customer, display form
customerController.newCustomerPage = (req, res)=>{
    res.render('admin/account_management/customer/new', { customer: new Customer() })
}

// cria o customer
customerController.newCustomer = async (req, res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
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
    }
}

//see customer profile
customerController.viewCustomer = async (req, res) =>{
    try{
        const customer = await Customer.findById(req.params.id)
        const reservations = await Reservation.find({ customer: customer.id }).exec()
        res.render('admin/account_management/customer/show', {
            customer: customer,
            reservationsByCustomer: reservations
        })
    } catch {
        res.redirect('/')
    }
}

//edit customer
customerController.editCustomerPage = async (req, res) => {
    try{
        const customer = await Customer.findById(req.params.id)
        res.render('admin/account_management/customer/edit', { customer: customer })    
    } catch {
        res.redirect('/customer')
    }
}

//customer edited
customerController.editCustomer = async (req, res) => {
    let customer
    try {
        customer = await Customer.findById(req.params.id)

        customer.name = req.body.name
        customer.email = req.body.email
        customer.password = req.body.password
        customer.contact = req.body.contact
        customer.address = req.body.address
        customer.state = req.body.state

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
    }
}

//delete customer
customerController.deleteCustomer = async (req, res) => {
    let customer
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
    }
}

module.exports = customerController;