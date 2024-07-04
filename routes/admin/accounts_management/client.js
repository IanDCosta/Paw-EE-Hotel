const express = require('express')
const router = express.Router() //usa router do express
const Client = require('../../../models/client')

// rota all staff
router.get('/', async (req, res) => {
    /* let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i') //this way you can only type "mon" to find "monkey"
    }
    try {
        const staff = await Staff.find(searchOptions)
        res.render('admin/index', { 
            staff: staff, 
            searchOptions: req.query
         })
    } catch {
        res.redirect('/')
    } */
})

// rota new staff
router.get('/new', (req, res)=>{
/*     res.render('staff/new', { staff: new Staff() })
 */})

// cria o staff
router.post('/', async (req, res)=>{
    /* const staff = new Staff({
        name: req.body.name
    })
    try {
        const newStaff = await staff.save() 
        res.redirect('staff')
    } catch {
        res.render('staff/new', {
            staff: staff,
            errorMessage: 'Error creating staff'
        })
    } */
})

module.exports = router