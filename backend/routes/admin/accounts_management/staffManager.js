const express = require("express");
const router = express.Router(); //usa router do express
const Staff = require("../../../models/staff");
const bcrypt = require("bcrypt")

const staffController = require('../../../controllers/admin/staffManager')

// rota all staff
router.get("/", async (req, res) => {
  staffController.getStaffs(req,res)
  /* let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i"); //this way you can type only "mon" to find "monkey"
  }
  try {
    const staff = await Staff.find(searchOptions);

    res.render("admin/account_management/staff/index", {
      staff: staff,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  } */
});

// rota new staff
router.get("/new", (req, res) => {
  staffController.newStaffPage(req,res)
  //res.render("admin/account_management/staff/new", { staff: new Staff() });
});

// cria o staff
router.post("/", async (req, res) => {
  staffController.newStaff(req,res)
  /* const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const staff = new Staff({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const newStaff = await staff.save();
    res.redirect(`staff/${newStaff.id}`);
  } catch {
    res.render("admin/account_management/staff/new", {
      staff: staff,
      errorMessage: "Error creating staff",
    });
  } */
});

//see staff profile
router.get("/:id", async (req, res) => {
  staffController.viewStaff(req,res)
  /* try {
    const staff = await Staff.findById(req.params.id);
    res.render("admin/account_management/staff/show", {
      staff: staff,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  } */
});

//edit staff
router.get("/:id/edit", async (req, res) => {
  staffController.editStaffPage(req,res)
  /* try {
    const staff = await Staff.findById(req.params.id);
    res.render("admin/account_management/staff/edit", { staff: staff });
  } catch {
    res.redirect("/staff");
  } */
});

//staff edited
router.put("/:id", async (req, res) => {
  staffController.editStaff(req,res)
  /* let staff;
  try {
    staff = await Staff.findById(req.params.id);

    staff.name = req.body.name;
    staff.email = req.body.email;
    staff.password = req.body.password;

    await staff.save(); 
    res.redirect(`${staff.id}`);
  } catch {
    if (staff == null) {
      res.redirect("/");
    } else {
      res.render("admin/account_management/staff/edit", {
        staff: staff,
        errorMessage: "Error updating admin",
      });
    }
  } */
});

//delete staff
router.delete("/:id", async (req, res) => {
  staffController.deleteStaff(req,res)
  /* let staff;
  try {
    staff = await Staff.findById(req.params.id);
    //await staff.deleteOne(); //staff.remove() is deprecated, using this instead. Will remove the staff
    staff.state = "Inactive";
    await staff.save();
    res.redirect("/");
  } catch (err) {
    if (staff == null) {
      res.redirect("/");
    } else {
      res.redirect(`${staff.id}`);
    }
  } */
});

module.exports = router;
