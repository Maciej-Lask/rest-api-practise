const Concert = require('../models/concert.model');

exports.getAllConcerts = async (req, res) => {
  try {
    const concerts = await Concert.find();
    res.json(concerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getConcertById = async (req, res) => {
  const id = req.params.id;
  try {
    const concert = await Concert.findById(id);
    if (concert) {
      res.json(concert);
    } else {
      res.status(404).json({ error: 'Concert not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createConcert = async (req, res) => {
  const { performer, genre, price, day, image } = req.body;

  if (!performer || !genre || !price || !day || !image) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  try {
    const newConcert = new Concert({ performer, genre, price, day, image });
    await newConcert.save();
    res.status(201).json(newConcert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateConcert = async (req, res) => {
  const id = req.params.id;
  const { performer, genre, price, day, image } = req.body;

  try {
    const concert = await Concert.findById(id);

    if (!concert) {
      res.status(404).json({ message: 'Concert not found' });
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

    await concert.save();

    res.json(concert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteConcert = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedConcert = await Concert.findByIdAndDelete(id);

    if (deletedConcert) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Concert not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
