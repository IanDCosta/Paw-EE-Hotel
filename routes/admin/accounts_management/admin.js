const express = require('express')
const router = express.Router() //usa router do express
const Admin = require('../../../models/admin')

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
        res.redirect(`/admin/${newAdmin.id}`)
    } catch {
        res.render('admin/new', {
            admin: admin,
            errorMessage: 'Error creating admin'
        })
    }
})

//see admin profile
router.get('/:id', (req, res) =>{
    res.send('Show Admin ' + req.params.id)
})

//edit admin
router.get('/:id/edit', async (req, res) => {
    try{
        const admin = await Admin.findById(req.params.id)
        res.render('admin/edit', { admin: admin })    
    } catch {
        res.redirect('/admin')
    }
    
})

//admin edited
router.put('/:id', async (req, res) => {
    let admin
    console.log("1")
    try {
        console.log("2")
        admin = await Admin.findById(req.params.id)
        console.log("3")
        admin.name = req.body.name
        //await admin.save() //will populate newAdmin after saving admin
        console.log("4")
        res.redirect(`/admin/${admin.id}`)
        console.log("5")
    } catch {
        if (admin == null) {
            res.redirect('/')
        } else {
            res.render('admin/edit', {
                admin: admin,
                errorMessage: 'Error updating admin'
            })
        }
    }
})

//delete admin
router.delete('/:id', (req, res) => {
    res.send('Delete ' + req.params.id)
})

module.exports = router