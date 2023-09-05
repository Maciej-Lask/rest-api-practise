const Seat = require('../models/seat.model');

exports.getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json(seats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSeatById = async (req, res) => {
  const id = req.params.id;
  try {
    const seat = await Seat.findById(id);
    if (seat) {
      res.json(seat);
    } else {
      res.status(404).json({ error: 'Seat not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.createSeat = async (req, res) => {
//   const { day, seat, client, email } = req.body;

//   if (!day || !seat || !client || !email) {
//     res.status(400).json({ error: 'All fields are required' });
//     return;
//   }

//   try {
//     const isSeatTaken = await Seat.exists({ day, seat });

//     if (isSeatTaken) {
//       res
//         .status(400)
//         .json({ message: 'The slot is already taken on this day' });
//       return;
//     }

//     const newSeat = new Seat({ day, seat, client, email });
//     await newSeat.save();
//     req.io.emit('seatsUpdated', newSeat);

//     const updatedSeats = await Seat.find();
//     req.io.emit('seatsUpdated', updatedSeats);

//     console.log('Seats updated');
//     res.status(201).json(newSeat);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.createSeat = async (req, res) => {
  const { day, seat, client, email } = req.body;

  if (!day || !seat || !client || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    if (await Seat.exists({ day, seat })) {
      return res
        .status(400)
        .json({ message: 'The slot is already taken on this day' });
    }

    const newSeat = await Seat.create({ day, seat, client, email });

    const updatedSeats = await Seat.find();
    req.io.emit('seatsUpdated', updatedSeats);

    console.log('Seats updated');
    return res.status(201).json(newSeat);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateSeat = async (req, res) => {
  const id = req.params.id;
  const { day, seat: newSeat, client, email } = req.body;

  try {
    const seat = await Seat.findById(id);

    if (!seat) {
      res.status(404).json({ message: 'Seat not found' });
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

    await seat.save();

    res.json(seat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSeat = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedSeat = await Seat.findByIdAndDelete(id);

    if (deletedSeat) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Seat not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
