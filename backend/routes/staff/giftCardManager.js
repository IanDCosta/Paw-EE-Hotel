const express = require("express");
const router = express.Router();
const GiftCard = require("../../models/giftCard");
const Customer = require("../../models/customer");

const giftCardController = require("../../controllers/staff/giftCardManager");

router.get("/", async (req, res) => {
  giftCardController.getGiftCards(req, res);
});

router.get("/new", async (req, res) => {
  giftCardController.newGiftCardPage(req, res);
});

router.post("/new/choose", async (req, res) => {
  giftCardController.newGiftCardChoseRoom(req, res);
});

router.post("/", async (req, res) => {
  giftCardController.newGiftCard(req, res);
});

router.get("/:id", async (req, res) => {
  giftCardController.viewGiftCard(req, res);
});
//here
router.get("/:id/choose-customer", async (req, res) => {
  giftCardController.chooseCustomerPage(req, res);
});

router.post("/:id/assign", async (req, res) => {
  giftCardController.assignGiftCardToCustomer(req, res);
});
//here
router.get("/:id/edit", async (req, res) => {
  giftCardController.editGiftCardPage(req, res);
});

router.put("/:id", async (req, res) => {
  giftCardController.editGiftCard(req, res);
});

router.delete("/:id", async (req, res) => {
  giftCardController.deleteGiftCard(req, res);
});

router.post("/:id/assign/:customerId", async (req, res) => {
  giftCardController.assignGiftCardToCustomer(req, res);
});

module.exports = router;
