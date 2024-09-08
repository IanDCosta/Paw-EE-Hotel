var express = require('express');
var router = express.Router();
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const Admin = require('../models/admin')
const Staff = require('../models/staff')
const methodOverride = require('method-override')
const initializePassport = require('../passport-config')
const authController = require('../controllers/auth')
const config = require('../config')
const bcrypt = require("bcrypt")

router.use(flash())
router.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))

router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))


initializePassport(passport, async email => {
    const staff = await Staff.findOne({ email: email });
    const admin = await Admin.findOne({ email: email });

    return admin || staff;

}, async id => {

    const admin = await Admin.findOne({ _id: id });
    const staff = await Staff.findOne({ _id: id });


    return admin || staff;
});


router.get('/', (req, res) => {
    authController.login(req,res)
})

router.post('/', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res, next) => {
    authController.submittedLogin(req,res,next)
});

router.delete('/logout', (req, res) => {

    authController.logout(req,res)

});

router.get('/register', (req,res) => {
    res.render("register.ejs");
})

router.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (req.body.role == "Admin") {
    const admin = new Admin({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    try {
      await admin.save();
      res.redirect(`/admin/`);
    } catch {
      res.render("register.ejs"),
        {
          admin: admin,
          errorMessage: "Error creating user",
          user: req.userName,
        };
    }

  } else if (req.body.role == "Staff"){
    const staff = new Staff({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    try {
      await staff.save();
      res.redirect(`/staff/`);
    } catch (err) {
      if (
        err.code === 11000 &&
        err.keyPattern &&
        err.keyValue &&
        err.keyPattern.email === 1
      ) {
        // Duplicate key error for the email field
        res.render("register.ejs", {
          title: "Register Staff",
          staff: staff,
          errorMessage: "Email address is already in use.",
          user: req.userName,
        });
      } else {
        res.render("register.ejs", {
          title: "Register Staff",
          staff: staff,
          errorMessage: "Error creating user. Please try again later.",
          user: req.userName,
        });
      }
      console.log(err);
    }
  }
})

module.exports = router