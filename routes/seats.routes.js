const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const db = require('../db');

router.get('/', (req, res) => {
  res.json(db.seats);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const seat = db.seats.find((item) => item.id === id);

  if (seat) {
    res.json(seat);
  } else {
    res.status(404).json({ error: 'Seat not found' });
  }
});

router.post('/', (req, res) => {
  const { day, seat, client, email } = req.body;

  if (!day || !seat || !client || !email) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  const isSeatTaken = db.seats.some(
    (item) => item.day === day && item.seat === seat
  );

  
  if (isSeatTaken) {
    res.status(400).json({ message: 'The slot is already taken on this day' });
    return;
  }


  
  const newSeat = {
    id: shortid.generate(),
    day,
    seat,
    client,
    email,
  };

  db.seats.push(newSeat);
  // emit a seatsUpdated event
  req.io.emit('seatsUpdated', db.seats);
  console.log("Seats updated");
  res.status(201).json(newSeat);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const seat = db.seats.find((item) => item.id === id);

  if (!seat) {
    res.status(404).json({ message: 'Seat not found' });
    return;
  }

  const { day, seat: newSeat, client, email } = req.body;

  if (!day && !newSeat && !client && !email) {
    res
      .status(400)
      .json({ error: 'At least one field must be provided for update' });
    return;
  }

  if (day) {
    seat.day = day;
  }

  if (newSeat) {
    seat.seat = newSeat;
  }

  if (client) {
    seat.client = client;
  }

  if (email) {
    seat.email = email;
  }

  res.json(seat);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const seatIndex = db.seats.findIndex((item) => item.id === id);

  if (seatIndex === -1) {
    res.status(404).json({ error: 'Seat not found' });
    return;
  }

  db.seats.splice(seatIndex, 1);
  res.status(204).send();
});

module.exports = router;
