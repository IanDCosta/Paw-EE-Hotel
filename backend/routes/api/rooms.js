var express = require('express');
var router = express.Router();

const roomController = require('../../controllers/api/roomController')

router.get('/rooms', roomController.getAllRooms)
router.post('/rooms', roomController.createRoom)
router.get('/rooms/:id', roomController.findRoom)
router.put('/rooms/:id', roomController.updateRoom)
router.delete('/rooms/:id', roomController.deleteRoom)

router.get('/rooms/images/:imageName',roomController.getImages)

module.exports = router;