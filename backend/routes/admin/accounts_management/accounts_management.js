const express = require('express');
const router = express.Router();

const adminManagerRouter = require('./adminManager');
const staffManagerRouter = require('./staffManager');
const customerManagerRouter = require('./customerManager');

router.use('/admin', adminManagerRouter);
router.use('/staff', staffManagerRouter);
router.use('/customer', customerManagerRouter);

router.get('/', (req, res) => {
    res.render("register");
});

module.exports = router;