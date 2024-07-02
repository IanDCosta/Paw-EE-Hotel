const express = require('express')
const router = express.Router() //usa router do express

router.get('/', (req, res) => {
    res.render('index') //render a view index.ejs
})

module.exports = router