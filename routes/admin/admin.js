const express = require('express')
const router = express.Router() //usa router do express
const Admin = require('../../models/admin')

// rota all admins
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i') //this way you can only type "mon" to find "monkey"
    }
    try {
        const admin = await Admin.find(searchOptions)
        res.render('admin/index', { 
            admin: admin, 
            searchOptions: req.query
         })
    } catch {
        res.redirect('/')
    }
})

// rota new admin, display form
router.get('/new', (req, res)=>{
    res.render('admin/new', { admin: new Admin() })
})

// cria o admin
router.post('/', async (req, res)=>{
    const admin = new Admin({
        name: req.body.name
    })
    try {
        const newAdmin = await admin.save() //will populate newAdmin after saving admin
        res.redirect('admin')
    } catch {
        res.render('admin/new', {
            admin: admin,
            errorMessage: 'Error creating admin'
        })
    }
})

module.exports = router