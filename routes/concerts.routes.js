const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const db = require('../db');

router.get('/', (req, res) => {
  res.json(db.concerts);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const concert = db.concerts.find((item) => item.id === id);

  if (concert) {
    res.json(concert);
  } else {
    res.status(404).json({ error: 'Concert not found' });
  }
});

router.post('/', (req, res) => {
  const { performer, genre, price, day, image } = req.body;

  if (!performer || !genre || !price || !day || !image) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  const newConcert = {
    id: shortid.generate(),
    performer,
    genre,
    price,
    day,
    image,
  };

  db.concerts.push(newConcert);
  res.status(201).json(newConcert);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const concert = db.concerts.find((item) => item.id === id);

  if (!concert) {
    res.status(404).json({ message: 'Concert not found' });
    return;
  }

  const { performer, genre, price, day, image } = req.body;

  if (!performer && !genre && !price && !day && !image) {
    res
      .status(400)
      .json({ error: 'At least one field must be provided for update' });
    return;
  }

  if (performer) {
    concert.performer = performer;
  }

  if (genre) {
    concert.genre = genre;
  }

  if (price) {
    concert.price = price;
  }

  if (day) {
    concert.day = day;
  }

  if (image) {
    concert.image = image;
  }

  res.json(concert);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const concertIndex = db.concerts.findIndex((item) => item.id === id);

  if (concertIndex === -1) {
    res.status(404).json({ error: 'Concert not found' });
    return;
  }

  db.concerts.splice(concertIndex, 1);
  res.status(204).send(); 
});

module.exports = router;
