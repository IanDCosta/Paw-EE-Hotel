const express = require("express");
const router = express.Router(); //usa router do express
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const Reservation = require("../models/reservation");
const Admin = require("../models/admin");
const Staff = require("../models/staff");

//authentication stuff

router.use(methodOverride("_method"));

const initializePassport = require("../passport-config");

initializePassport(
  passport,
  async (email) => {
    const admin = await Admin.findOne({ email: email });
    const staff = await Staff.findOne({ email: email });

    return admin || staff;
  },
  async (id) => {
    const admin = await Admin.findOne({ _id: id });
    const staff = await Staff.findOne({ _id: id });

    return admin || staff;
  }
);

router.use(express.urlencoded({ extended: false }));
router.use(flash());
router.use(
  session({
    secret: "macaquitos",
    resave: false,
    saveUninitialized: false,
  })
);
router.use(passport.initialize());
router.use(passport.session());

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  
  next();
}

//index route
router.get("/", checkAuthenticated, async (req, res) => {
  let reservations;
  res.locals.title = "Abel's Home Page";
  try {
    reservations = await Reservation.find({ state: "Pending" })
      .sort({ createdAt: "desc" })
      .exec(); //get the newest reservations first
  } catch {}
  res.render("index", { reservations: reservations, user: req.user}); //render a view index.ejs
});
//index route

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

router.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (req.body.role == "Admin") {
      const admin = new Admin({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      admin.save();
    } else {
      const staff = new Staff({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      staff.save();
    }

    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

router.delete("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }

    res.redirect("/login");
  });
});
//end of authentication stuff

module.exports = router;
