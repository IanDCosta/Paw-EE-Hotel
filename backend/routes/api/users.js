var express = require('express');
var router = express.Router();

const customerController = require('../../controllers/api/users/customerController')
const adminController = require('../../controllers/api/users/adminController')
const staffController = require('../../controllers/api/users/staffController')
const authController = require ('../../controllers/api/auth')

router.get('/customers', customerController.getAllCustomers)
router.post('/customers', customerController.createCustomer, authController.registerCustomer)
router.get('/customers/:id', customerController.findCustomer)
router.put('/customers/:id', customerController.updateCustomer) //resets password 
router.delete('/customers/:id', customerController.deleteCustomer)


router.get('/admins', adminController.getAllAdmins)
router.post('/admins', adminController.createAdmin)
router.get('/admins/:id', adminController.findAdmin)
router.put('/admins/:id', adminController.updateAdmin)
router.delete('/admins/:id', adminController.deleteAdmin)


router.get('/staff', staffController.getAllStaff)
router.post('/staff', staffController.createStaff)
router.get('/staff/:id', staffController.findStaff)
router.put('/staff/:id', staffController.updateStaff)
router.delete('/staff/:id', staffController.deleteStaff)

module.exports = router;