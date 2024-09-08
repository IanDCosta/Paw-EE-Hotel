const express = require("express");
const router = express.Router(); //usa router do express
const Admin = require("../../models/admin");
const bcrypt = require("bcrypt")

adminController = {};

// rota all admins
adminController.getAdmins = async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i"); //this way you can only type "mon" to find "monkey"
  }
  try {
    const admin = await Admin.find(searchOptions);

    res.render("admin/account_management/admin/index", {
      admin: admin,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
};

// rota new admin, display form, must be above the /:id ones
adminController.newAdminPage = (req, res) => {
  res.render("admin/account_management/admin/new", { admin: new Admin() });
};

// cria o admin
adminController.newAdmin = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const admin = new Admin({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const newAdmin = await admin.save(); //will populate newAdmin after saving admin
    res.redirect(`admin/${newAdmin.id}`);
  } catch {
    res.render("admin/account_management/admin/new", {
      admin: admin,
      errorMessage: "Error creating admin",
    });
  }
};

//see admin profile
adminController.viewAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.render("admin/account_management/admin/show", {
      admin: admin,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

//edit admin
adminController.editAdminPage = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.render("admin/account_management/admin/edit", { admin: admin });
  } catch {
    res.redirect("/admin");
  }
};

//admin edited
adminController.editAdmin = async (req, res) => {
  let admin;
  try {
    admin = await Admin.findById(req.params.id);

    admin.name = req.body.name;
    admin.email = req.body.email;
    admin.password = req.body.password;
    staff.state = req.body.state;

    await admin.save(); //will populate newAdmin after saving admin
    res.redirect(`${admin.id}`);
  } catch {
    if (admin == null) {
      res.redirect("/");
    } else {
      res.render("admin/account_management/admin/edit", {
        admin: admin,
        errorMessage: "Error updating admin",
      });
    }
  }
};

//delete admin
adminController.deleteAdmin = async (req, res) => {
  let admin;
  try {
    admin = await Admin.findById(req.params.id);
    //await admin.deleteOne(); //will remove admin //ACTUALLY need to mark user as "inactive" instead of simply deleting from database
    admin.state = "Inactive";
    await admin.save();
    res.redirect("/");
  } catch {
    if (admin == null) {
      res.redirect("/");
    } else {
      res.redirect(`/admin/${admin.id}`);
    }
  }
};

module.exports = adminController;
