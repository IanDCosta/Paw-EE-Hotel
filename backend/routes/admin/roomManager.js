const express = require("express");
const router = express.Router(); //usa router do express
const multer = require("multer");
const Room = require("../../models/room");

const roomController = require("../../controllers/admin/roomManager");

//photo stuff
const fs = require("fs");
const path = require("path");
const uploadPath = path.join("public", Room.photoBasePath);
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"]; //image types accepted

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // extract the file extension
    cb(null, file.fieldname + "-" + Date.now() + ext); // ensure extension is included
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    const isValidMimeType = imageMimeTypes.includes(file.mimetype);
    callback(null, isValidMimeType);
  },
});
//photo stuff end

// rota all room
router.get("/", async (req, res) => {
  roomController.getRooms(req, res);
});

// rota new room, display form
router.get("/new", (req, res) => {
  roomController.newRoomPage(req, res);
});

// cria o room
router.post("/", upload.single("photo"), async (req, res) => {
  roomController.newRoom(req, res);
});

//see room profile
router.get("/:id", async (req, res) => {
  roomController.viewRoom(req, res);
});

//edit room
router.get("/:id/edit", async (req, res) => {
  roomController.editRoomPage(req, res);
});

//room edited
router.put("/:id", ...roomController.editRoom); 

//delete room
router.delete("/:id", async (req, res) => {
  roomController.deleteRoom(req, res);
});

module.exports = router;
