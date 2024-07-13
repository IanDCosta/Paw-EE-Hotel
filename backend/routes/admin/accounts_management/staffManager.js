const express = require('express')
const router = express.Router() //usa router do express
const Staff = require('../../../models/staff')

// rota all staff
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i') //this way you can only type "mon" to find "monkey"
    }
    try {
        const staff = await Staff.find(searchOptions)
        res.render('staff/index', { 
            staff: staff, 
            searchOptions: req.query
         })
    } catch {
        res.redirect('/')
    }
})

// rota new staff
router.get('/new', (req, res)=>{
    res.render('staff/new', { staff: new Staff() })
})

// cria o staff
router.post('/', async (req, res)=>{
    const staff = new Staff({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    try {
        const newStaff = await staff.save() 
        res.redirect(`/staff/${newStaff.id}`)
    } catch {
        res.render('staff/new', {
            staff: staff,
            errorMessage: 'Error creating staff'
        })
    }
})

//see staff profile
router.get('/:id', async (req, res) =>{
    try{
        const staff = await Staff.findById(req.params.id)
        res.render('staff/show', {
            staff: staff
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

//edit staff
router.get('/:id/edit', async (req, res) => {
    try{
        const staff = await Staff.findById(req.params.id)
        res.render('staff/edit', { staff: staff })    
    } catch {
        res.redirect('/staff')
    }
    
})

//staff edited
router.put('/:id', async (req, res) => {
    let staff
    try {
        staff = await Staff.findById(req.params.id)

        staff.name = req.body.name
        staff.email = req.body.email
        staff.password = req.body.password

        await staff.save() //will populate newAdmin after saving admin
        res.redirect(`/admin/${staff.id}`)
    } catch {
        if (staff == null) {
            res.redirect('/')
        } else {
            res.render('admin/edit', {
                staff: staff,
                errorMessage: 'Error updating admin'
            })
        }
    }
})

//delete staff
router.delete('/:id', async (req, res) => {
    let staff
    try {
        staff = await Staff.findById(req.params.id)
        await staff.deleteOne() //staff.remove() is deprecated, using this instead. Will remove the staff
        res.redirect('/staff')
    } catch {
        if (staff == null) {
            res.redirect('/')
        } else {
            res.redirect(`/staff/${staff.id}`)
        }
    }
})

module.exports = router