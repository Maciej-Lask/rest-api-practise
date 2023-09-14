const Concert = require('../models/concert.model');
const mongoSanitize = require('mongo-sanitize');

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

  // if (!performer || !genre || !price || !day || !image) {
  //   res.status(400).json({ error: 'All fields are required' });
  //   return;
  // }
  const sanitizedData = {
    performer: mongoSanitize(performer),
    genre: mongoSanitize(genre),
    price: mongoSanitize(price),
    day: mongoSanitize(day),
    image: mongoSanitize(image),
  };

  if (
    !sanitizedData.performer ||
    !sanitizedData.genre ||
    !sanitizedData.price ||
    !sanitizedData.day ||
    !sanitizedData.image
  ) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  try {
    // const newConcert = new Concert({ performer, genre, price, day, image });
    const newConcert = new Concert(sanitizedData);
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

exports.getConcertsByPerformer = async (req, res) => {
  const performer = req.params.performer;
  try {
    const concerts = await Concert.find({ performer });
    res.json(concerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getConcertsByGenre = async (req, res) => {
  const genre = req.params.genre;
  try {
    const concerts = await Concert.find({ genre });
    res.json(concerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getConcertsByPriceRange = async (req, res) => {
  const price_min = req.params.price_min;
  const price_max = req.params.price_max;
  try {
    const concerts = await Concert.find({
      price: { $gte: price_min, $lte: price_max },
    });
    res.json(concerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getConcertsByDay = async (req, res) => {
  const day = req.params.day;
  try {
    const concerts = await Concert.find({ day });

    res.json(concerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
