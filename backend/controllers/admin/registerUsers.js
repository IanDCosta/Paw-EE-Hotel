const Admin = require("../../models/admin");
const Customer = require("../../models/customer");
const Staff = require("../../models/staff");

const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const { title } = require("process");

registerController = {};

registerController.registerForm = (req, res) => {
  res.render("register.ejs");
};

registerController.register = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (req.body.role == "Admin") {
    const admin = new Admin({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    try {
      await admin.save();
      res.redirect(`/admin/manage-accounts/view/admins/`);
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
      res.redirect(`/admin/manage-accounts/view/staff-members/`);
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
};

module.exports = registerController;
