const express = require("express");
const router = express.Router(); //usa router do express
const Staff = require("../../../models/staff");
const bcrypt = require("bcrypt")

const staffController = require('../../../controllers/admin/staffManager')

// rota all staff
router.get("/", async (req, res) => {
  staffController.getStaffs(req,res)
});

// rota new staff
router.get("/new", (req, res) => {
  staffController.newStaffPage(req,res)
});

// cria o staff
router.post("/", async (req, res) => {
  staffController.newStaff(req,res)
});

//see staff profile
router.get("/:id", async (req, res) => {
  staffController.viewStaff(req,res)
});

//edit staff
router.get("/:id/edit", async (req, res) => {
  staffController.editStaffPage(req,res)
});

//staff edited
router.put("/:id", async (req, res) => {
  staffController.editStaff(req,res)
});

//delete staff
router.delete("/:id", async (req, res) => {
  staffController.deleteStaff(req,res)
});

module.exports = router;
