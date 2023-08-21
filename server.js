const express = require('express');
const path = require('path');
const app = express();
const shortid = require('shortid');
const db = require('./db');
const cors = require('cors');

const testimonialsRouter = require('./routes/testimonials.routes');
const concertsRouter = require('./routes/concerts.routes');
const seatsRouter = require('./routes/seats.routes');

app.use(cors());

//  app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use('/api/testimonials', testimonialsRouter);
app.use('/api/concerts', concertsRouter);
app.use('/api/seats', seatsRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});


app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});


app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});
