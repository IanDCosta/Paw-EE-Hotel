const express = require("express");
const router = express.Router(); //usa router do express
const Reservation = require("../../models/reservation");
const Customer = require("../../models/customer");
const Room = require("../../models/room");

reservationController = {}

// rota all reservations
reservationController.getReservations = async (req, res) => {
  let searchOptions = {};
  if (req.query.code != null && req.query.code !== "") {
    searchOptions.code = new RegExp(req.query.code, "i");
  }
  try {
    const reservations = await Reservation.find({});
    res.render("staff/reservation/index", {
      reservations: reservations,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
};

// rota new reservation, display form, must be above the /:id ones
reservationController.newReservationPage = async (req, res) => {
  try {
    const vacantRooms = await Room.find({ isVacant: true });
    res.render("staff/reservation/chooseRoom", { room: vacantRooms });
  } catch (err) {
    console.log(err);
    res.redirect("/reservation");
  }
};

reservationController.newReservationChoseRoom = async (req, res) => {
  try {
    /* const roomId = req.body.roomId;
    const room = await Room.findById(roomId); */
    const reservation = new Reservation(); // or however you create a new reservation
    const customers = await Customer.find({});

    // Now render the page to fill out the rest of the reservation details
    renderNewPage(res, req.body.roomId, customers, reservation);
  } catch (err) {
    console.log(err);
    res.redirect("/reservation");
  }
};

async function renderNewPage(res, roomId, customers, reservation, hasError = false) {
  try {
    const room = await Room.findById(roomId);
    
    const params = {
      room: room, // The selected room
      customers: customers,
      reservation: reservation, // The new reservation object
    };
    if (hasError) params.errorMessage = "Error Creating Reservation";
    res.render("staff/reservation/new", params);
  } catch (err) {
    console.log(err);
    res.redirect("/reservation");
  }
}

// cria o reservation
reservationController.newReservation = async (req, res) => {
  const reservation = new Reservation({
    code: req.body.code,
    dateBegin: new Date(req.body.dateBegin),
    dateEnd: new Date(req.body.dateEnd)
  });

  try {
    const customerId = req.body.customer;
    const customer = await Customer.findById(customerId);
    
    reservation.customer = customer;

    const roomId = req.body.roomId;
    const room = await Room.findById(roomId);

    reservation.room = room;
    reservation.dailyPrice = room.dailyPrice;

    console.log(req.body.occupants);

    let occupants = [];
    for(let i = 0; i < room.capacity; i++){
      occupants.push({
        name: req.body.occupants[i].name,
        age: req.body.occupants[i].age
      })
    }

    reservation.occupants = occupants;

    // Save the new reservation
    const newReservation = await reservation.save();

    // Update the room's vacancy status after the reservation is made
    await Room.findByIdAndUpdate(roomId, { isVacant: false });

    // Redirect to the reservation details page
    res.redirect(`/staff/manage-reservations/${newReservation._id}`);
  } catch (err) {
    console.log(err);
    renderNewPage(
      res,
      req.body.roomId,
      await Customer.find({}),
      reservation,
      true
    ); // Pass the reservation object for potential error messages
  }
};

//see reservation
reservationController.viewReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    res.render("staff/reservation/show", {
      reservation: reservation,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

//edit reservation
reservationController.editReservationPage = async (req, res) => {
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
};

//reservation edited
reservationController.editReservation = async (req, res) => {
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

    reservation.state = req.body.state;

    await reservation.save(); //will populate newReservation after saving reservation
    res.redirect(`${reservation.id}`);
  } catch {
    if (reservation == null) {
      res.redirect("/");
    } else {
      renderEditPage(res, reservation, true);
    }
  }
};

async function renderEditPage(res, reservation, hasError = false) {
  try {
    /* const hotels = await Hotel.findHotelsWithVacantRooms({});
    const pets = await Pet.find({}); */
    const states = ["Pending", "Confirmed", "Paid", "Cancelled"];
    const params = {
      /* hotels: hotels,
      pets: pets, */
      reservation: reservation,
      states: states,
    };
    //const reservation = await Reservation.findById(req.params.id);

    if (hasError) params.errorMessage = "Error Updating Reservation";
    res.render("staff/reservation/edit", params);
  } catch {
    res.redirect("/reservation");
  }
}

//delete reservation
reservationController.deleteReservation = async (req, res) => {
  let reservation;
  try {
    reservation = await Reservation.findById(req.params.id);
    //const room = await Room.findOneAndUpdate({ id: reservation.location.room.id },{ isVacant: true })
    const room = await Room.findById(reservation.room.id);
    room.isVacant = true;
    //console.log(room + " " + reservation.location.room.id);
    room.save();

    await reservation.deleteOne(); //will remove reservation
    res.redirect("/");
  } catch (err) {
    console.log(err);
    if (reservation == null) {
      res.redirect("/");
    } else {
      res.redirect(`${reservation.id}`);
    }
  }
};

module.exports = reservationController;
