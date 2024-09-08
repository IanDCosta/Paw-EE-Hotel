const express = require("express");
const router = express.Router();

const Room = require('../../models/room');

const accountsManagementRouter = require("./accounts_management/accounts_management");
const roomManagementRouter = require("./roomManager");

router.use("/manage-accounts", accountsManagementRouter);
router.use("/manage-rooms", roomManagementRouter);

router.get("/", async (req, res) => {
    res.redirect('/admin/manage-rooms');
});

module.exports = router;
