const express = require("express");
const router = express.Router(); //usa router do express
const Reservation = require("../../models/reservation");
const Hotel = require("../../models/hotel");
const Pet = require("../../models/pet");
const Room = require("../../models/room");

// rota all reservations
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const reservation = await Reservation.find(searchOptions);
    res.render("reservation/index", {
      reservation: reservation,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// rota new reservation, display form, must be above the /:id ones
router.get("/new", (req, res) => {
  renderNewPage(res, new Reservation());
});

// cria o reservation
router.post("/", async (req, res) => {
  //console.log('daq ' + req.body.location + ' ate ' + ' aq')

  const reservation = new Reservation({
    code: req.body.code,
    location: {
      hotel: req.body.location,
    },
    dateBegin: new Date(req.body.dateBegin),
    dateEnd: new Date(req.body.dateEnd),
    pet: req.body.pet,
  });

  try {
    const pet = await Pet.findById(req.body.pet);
    const hotel = await Hotel.findById(req.body.location);
    //let room = hotel.rooms.find(room => room.isVacant === true)
    const room = await Room.findOneAndUpdate(
      { hotel: hotel.id, isVacant: true },
      { isVacant: false }
    );
    room.save();

    reservation.location.room = room;
    reservation.dailyPrice = hotel.dailyPrice;
    reservation.customer = pet.owner;

    const newReservation = await reservation.save(); //will populate newReservation after saving reservation
    res.redirect(`/reservation/${newReservation.id}`);
  } catch (err) {
    renderNewPage(res, reservation, true);
    console.log(err);
  }
});

async function renderNewPage(res, reservation, hasError = false) {
  try {
    const hotels = await Hotel.findHotelsWithVacantRooms({});
    //const hotels = await Hotel.find({})
    const pets = await Pet.find({});
    console.log(hotels);
    const params = {
      hotels: hotels,
      pets: pets,
      reservation: reservation,
    };
    if (hasError) params.errorMessage = "Error Creating Reservation";
    res.render("reservation/new", params);
  } catch {
    res.redirect("/reservation");
  }
}

//see reservation
router.get("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    res.render("reservation/show", {
      reservation: reservation,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

//edit reservation
router.get("/:id/edit", async (req, res) => {
  try {
    renderEditPage(res, await Reservation.findById(req.params.id), false);
    /* 
    res.render("reservation/edit", { 
      reservation: reservation, 
      hotels: hotels,
      pets: pets
    }); */
  } catch {
    res.redirect("/reservation");
  }
});

//reservation edited
router.put("/:id", async (req, res) => {
  let reservation;
  try {
    reservation = await Reservation.findById(req.params.id);

    /* reservation.code = req.body.code
    reservation.location = {
      hotel: req.body.location
    }
    reservation.dateBegin = new Date(req.body.dateBegin)
    reservation.dateEnd = new Date(req.body.dateEnd)
    reservation.pet = req.body.pet */

    reservation.code = req.body.code;

    await reservation.save(); //will populate newReservation after saving reservation
    res.redirect(`/reservation/${reservation.id}`);
  } catch {
    if (reservation == null) {
      res.redirect("/");
    } else {
      res.render("reservation/edit", {
        reservation: reservation,
        errorMessage: "Error updating reservation",
      });
    }
  }
});

async function renderEditPage(res, reservation, hasError = false) {
  try {
    /* const hotels = await Hotel.findHotelsWithVacantRooms({});
    const pets = await Pet.find({}); */
    const states = ["Pending", "Confirmed", "Paid", "Cancelled"]
    const params = {
      /* hotels: hotels,
      pets: pets, */
      states: states
    }
    //const reservation = await Reservation.findById(req.params.id);

    if(hasError) params.errorMessage = 'Error Updating Reservation'
    res.render('reservation/edit', params)
  } catch {
    res.redirect('/reservation')
  }
}

//delete reservation
router.delete("/:id", async (req, res) => {
  let reservation;
  try {
    reservation = await Reservation.findById(req.params.id);
    //const room = await Room.findOneAndUpdate({ id: reservation.location.room.id },{ isVacant: true })
    const room = await Room.findById(reservation.location.room.id);
    room.isVacant = true;
    //console.log(room + " " + reservation.location.room.id);
    room.save();

    await reservation.deleteOne(); //will remove reservation
    res.redirect("/reservation");
  } catch (err) {
    if (reservation == null) {
      res.redirect("/");
    } else {
      res.redirect(`/reservation/${reservation.id}`);
    }
    console.log(err);
  }
});

module.exports = router;
