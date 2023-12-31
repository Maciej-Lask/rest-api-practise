const express = require('express');
const path = require('path');
const socket = require('socket.io');
const mongoose = require('mongoose');
const helmet = require('helmet');
const app = express();
const cors = require('cors');

const testimonialsRouter = require('./routes/testimonials.routes');
const concertsRouter = require('./routes/concerts.routes');
const seatsRouter = require('./routes/seats.routes');

app.use(cors());
//  app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());

// Na replit jest tak
// const DB_PASS = process.env['DB_PASS'];

// mongoose.connect(
//   `mongodb+srv://maciek30088:${DB_PASS}@cluster0.ofdksez.mongodb.net/?retryWrites=true&w=majority`,
//   {
//     useNewUrlParser: true,
//   }
// );
mongoose.connect(
  'mongodb+srv://maciek30088:Elitarny123@cluster0.ofdksez.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
  }
);
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', (err) => console.log('Error ' + err));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/testimonials', testimonialsRouter);
app.use('/api/concerts', concertsRouter);
app.use('/api/seats', seatsRouter);

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => { 
  res.status(404).json({ error: 'Route not found' });
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New socket connection! Its id – ' + socket.id);
});

module.exports = server;