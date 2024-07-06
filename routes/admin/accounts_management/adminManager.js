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

// rota new admin, display form, must be above the /:id ones
router.get('/new', (req, res)=>{
    res.render('admin/new', { admin: new Admin() })
})

// cria o admin
router.post('/', async (req, res)=>{
    const admin = new Admin({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
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
router.get('/:id', async (req, res) =>{
    try{
        const admin = await Admin.findById(req.params.id)
        res.render('admin/show', {
            admin: admin
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
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
    try {
        admin = await Admin.findById(req.params.id)

        admin.name = req.body.name
        admin.email = req.body.email
        admin.password = req.body.password

        await admin.save() //will populate newAdmin after saving admin
        res.redirect(`/admin/${admin.id}`)
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
router.delete('/:id', async (req, res) => {
    let admin
    try {
        admin = await Admin.findById(req.params.id)
        await admin.deleteOne() //will remove admin
        res.redirect('/admin')
    } catch {
        if (admin == null) {
            res.redirect('/')
        } else {
            res.redirect(`/admin/${admin.id}`)
        }
    }
})

module.exports = router