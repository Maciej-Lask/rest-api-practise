const Testimonial = require('../models/testimonial.model');

exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTestimonialById = async (req, res) => {
  const id = req.params.id;
  try {
    const testimonial = await Testimonial.findById(id);
    if (testimonial) {
      res.json(testimonial);
    } else {
      res.status(404).json({ error: 'Testimonial not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTestimonial = async (req, res) => {
  const { author, text } = req.body;

  if (!author || !text) {
    res.status(400).json({ error: 'Author and text are required' });
    return;
  }

  try {
    const newTestimonial = new Testimonial({ author, text });
    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTestimonial = async (req, res) => {
  const id = req.params.id;
  const { author, text } = req.body;

  try {
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      res.status(404).json({ message: 'Testimonial not found' });
      return;
    }

    if (author) {
      testimonial.author = author;
    }

    if (text) {
      testimonial.text = text;
    }

    await testimonial.save();

    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTestimonial = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

    if (deletedTestimonial) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Testimonial not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
