const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const db = require('../db');

router.get('/', (req, res) => {
  res.json(db.testimonials);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const testimonial = db.testimonials.find((item) => item.id === id);

  if (testimonial) {
    res.json(testimonial);
  } else {
    res.status(404).json({ error: 'Testimonial not found' });
  }
});

router.get('/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * db.testimonials.length);
  const randomTestimonial = db.testimonials[randomIndex];
  res.json(randomTestimonial);
});

router.post('/', (req, res) => {
  const { author, text } = req.body;

  if (!author || !text) {
    res.status(400).json({ error: 'Author and text are required' });
    return;
  }

  const newTestimonial = {
    id: shortid.generate(),
    author,
    text,
  };

  db.testimonials.push(newTestimonial);
  res.status(201).json(newTestimonial);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const testimonial = db.testimonials.find((item) => item.id === id);

  if (!testimonial) {
    res.status(404).json({ message: 'Testimonial not found' });
    return;
  }

  const { author, text } = req.body;

  if (!author && !text) {
    res.status(400).json({ error: 'Author and text are required' });
    return;
  }

  if (author) {
    testimonial.author = author;
  }

  if (text) {
    testimonial.text = text;
  }

  res.json(testimonial);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const testimonialIndex = db.testimonials.findIndex((item) => item.id === id);

  if (testimonialIndex === -1) {
    res.status(404).json({ error: 'Testimonial not found' });
    return;
  }

  db.testimonials.splice(testimonialIndex, 1);
  res.status(204).send(); 
});

module.exports = router;
