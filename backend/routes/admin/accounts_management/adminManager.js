const express = require("express");
const router = express.Router(); //usa router do express
const Admin = require("../../../models/admin");
const bcrypt = require("bcrypt");

const adminController = require("../../../controllers/admin/adminManager");

// rota all admins
router.get("/", async function (req, res) {
  adminController.getAdmins(req, res);
});

// rota new admin, display form, must be above the /:id ones
router.get("/new", (req, res) => {
  adminController.newAdminPage(req, res);
});

// cria o admin
router.post("/", async (req, res) => {
  adminController.newAdmin(req, res);
});

//see admin profile
router.get("/:id", async (req, res) => {
  adminController.viewAdmin(req, res);
});

//edit admin
router.get("/:id/edit", async (req, res) => {
  adminController.editAdminPage(req, res);
});

//admin edited
router.put("/:id", async (req, res) => {
  adminController.editAdmin(req, res);
});

//delete admin
router.delete("/:id", async (req, res) => {
  adminController.deleteAdmin(req, res);
});

module.exports = router;
