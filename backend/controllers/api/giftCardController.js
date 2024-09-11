const GiftCard = require("../../models/giftCard");

var giftCardController = {};

giftCardController.getAllGiftCards = async (req, res, next) => {
  try {
    const giftCards = await GiftCard.find().exec();
    res.json(giftCards);
  } catch (err) {
    next(err);
  }
};

giftCardController.createGiftCard = async (req, res, next) => {
  const giftCard = new GiftCard({
    description: req.body.description,
    discount: req.body.discount
  });

  try {
    await giftCard.save();
    res.json(giftCard);
  } catch (error) {
    next(error);
  }
};

giftCardController.findGiftCard = async (req, res, next) => {
  try {
    const giftCard = await GiftCard.findById(req.params.id);

    if (!giftCard) {
      return res.status(404).json({ error: "GiftCard not found" });
    }
    res.status(200).json(giftCard);
  } catch (error) {
    next(error);
  }
};

giftCardController.updateGiftCard = async (req, res, next) => {
  try {
    const giftCard = await GiftCard.findByIdAndUpdate(req.params.id, {
      description: req.body.description,
      discount: req.body.discount,
    });

    await giftCard.save();
    res.json(giftCard);
  } catch (error) {
    next(error);
  }
};

giftCardController.deleteGiftCard = async (req, res, next) => {
  try {
    const giftCard = await GiftCard.findByIdAndDelete(req.params.id);

    if (!giftCard) {
      return res.status(404).json({ error: "GiftCard not found" });
    }

    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

module.exports = giftCardController;
