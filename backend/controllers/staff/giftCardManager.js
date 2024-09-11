const express = require("express");
const router = express.Router();
const GiftCard = require("../../models/giftCard");
const Customer = require("../../models/customer")

giftCardController = {};

giftCardController.getGiftCards = async (req, res) => {
  let query = GiftCard.find();
  if (req.query.discount != null && req.query.discount != "") {
    query = query.where("discount").equals(req.query.discount);
  }
  if (req.query.description != null && req.query.description !== "") {
    searchOptions.description = new RegExp(req.query.description, "i");
  }

  try {
    const giftCards = await query.exec();
    res.render("staff/giftCard/index", {
      giftCards: giftCards,
      searchOptions: req.query,
    });
  } catch (err) {
    console.log(err);

    res.redirect("/staff");
  }
};

// rota new giftCard, display form
giftCardController.newGiftCardPage = (req, res) => {
  res.render("staff/giftCard/new", {
    giftCard: new GiftCard(),
    isEditing: false,
  });
};

// cria o giftCard
giftCardController.newGiftCard = async (req, res) => {
  const giftCard = new GiftCard({
    description: req.body.description,
    discount: req.body.discount,
  });

  try {
    const newGiftCard = await giftCard.save(); //will populate newGiftCard after saving giftCard
    res.redirect(`manage-giftCards/${newGiftCard.id}`);
  } catch {
    res.render("staff/giftCard/new", {
      giftCard: giftCard,
      errorMessage: "Error creating giftCard",
    });
  }
};

//see giftCard profile
giftCardController.viewGiftCard = async (req, res) => {
  try {
    const giftCard = await GiftCard.findById(req.params.id);
    res.render("staff/giftCard/show", {
      giftCard: giftCard,
    });
  } catch {
    res.redirect("/");
  }
};

giftCardController.chooseCustomerPage = async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.render("staff/giftCard/chooseCustomer", {
      customers: customers,
      giftCardId: req.params.id,
    });
  } catch (err) {
    console.log(err);
    res.redirect(`/staff/manage-giftCards/${req.params.id}`);
  }
};

giftCardController.assignGiftCardToCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

    customer.giftCards.push(req.body.giftCardId);
    await customer.save();

    res.redirect(`/staff/manage-giftCards/${req.body.giftCardId}`);
  } catch (err) {
    console.log(err);
    res.redirect(`/staff/manage-giftCards/${req.body.giftCardId}`);
  }
};

//edit giftCard
giftCardController.editGiftCardPage = async (req, res) => {
  try {
    const giftCard = await GiftCard.findById(req.params.id);
    res.render("staff/giftCard/edit", {
      giftCard: giftCard
    });
  } catch {
    res.redirect("/giftCard");
  }
};

//giftCard edited
giftCardController.editGiftCard = async (req, res) => {
    let giftCard;
    try {
      giftCard = await GiftCard.findById(req.params.id);

      giftCard.description = req.body.description;
      giftCard.discount = req.body.discount;

      await giftCard.save();
      res.redirect(`${giftCard.id}`);
    } catch (err) {
      console.log(err);
      if (giftCard == null) {
        res.redirect("/");
      } else {
        res.render("staff/giftCard/edit", {
          giftCard: giftCard,
          errorMessage: "Error updating giftCard",
        });
      }
    }
  };

//delete giftCard
giftCardController.deleteGiftCard = async (req, res) => {
  let giftCard;
  try {
    giftCard = await GiftCard.findById(req.params.id);

    await giftCard.deleteOne(); //will remove giftCard

    res.redirect("/staff/");
  } catch {
    if (giftCard == null) {
      res.redirect("/");
    } else {
      res.redirect(`${giftCard.id}`);
    }
  }
};

module.exports = giftCardController;