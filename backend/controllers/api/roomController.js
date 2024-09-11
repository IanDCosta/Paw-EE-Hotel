const Room = require("../../models/room");

const multer = require('multer');
const path = require('path')
const fs = require('fs')

const uploadPath = path.join('public', Room.photoBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg'); // Appending .jpg
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
      callback(null, imageMimeTypes.includes(file.mimetype));
  }
}).single('image');

var roomController = {};

roomController.getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find().exec();
    res.json(rooms);
  } catch (err) {
    next(err);
  }
};

roomController.createRoom = async (req, res, next) => {
  const filename = req.file != null ? req.file.filename : null;

  const room = new Room({
    roomNumber: req.body.roomNumber,
    typology: req.body.typology,
    dailyPrice: req.body.dailyPrice,
    capacity: req.body.capacity,
    photoName: filename,
  });

  try {
    await room.save();
    res.json(room);
  } catch (error) {
    next(error);
  }
};

roomController.findRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

roomController.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, {
      roomNumber: req.body.roomNumber,
      typology: req.body.typology,
      dailyPrice: req.body.dailyPrice,
      capacity: req.body.capacity,
      isVacant: req.body.isVacant
    });

    await room.save();
    res.json(room);
  } catch (error) {
    next(error);
  }
};

roomController.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

roomController.getImages = (req, res) => {
  const imageName = req.params.imageName;
  if (imageName) {
    const imagePath = path.join(uploadPath, imageName);

    // Check if the file exists
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        // File does not exist
        return res.status(404).send("Image not found");
      }

      // File exists, stream it to the response
      const imageStream = fs.createReadStream(imagePath);
      imageStream.on("error", (error) => {
        console.error("Error reading image file", error);
        res.status(500).send("Error reading image file");
      });
      imageStream.pipe(res);
    });
  } else {
    res.status(404).send("no name");
  }
};

module.exports = roomController;
