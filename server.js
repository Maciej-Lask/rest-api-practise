const express = require('express');
const path = require('path');
const app = express();
const shortid = require('shortid');
const db = require('./db');


const testimonialsRouter = require('./routes/testimonials.routes');
const concertsRouter = require('./routes/concerts.routes');
const seatsRouter = require('./routes/seats.routes');

//  app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/testimonials', testimonialsRouter);
app.use('/concerts', concertsRouter);
app.use('/seats', seatsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
