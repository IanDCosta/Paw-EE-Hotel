var express = require('express');
var router = express.Router();

const giftCardController = require('../../controllers/api/giftCardController.js')

router.get('/giftCards', giftCardController.getAllGiftCards)
router.post('/giftCards', giftCardController.createGiftCard)
router.get('/giftCards/:id', giftCardController.findGiftCard)
router.put('/giftCards/:id', giftCardController.updateGiftCard)
router.delete('/giftCards/:id', giftCardController.deleteGiftCard)

module.exports = router;