const Concert = require('../concert.model');
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe('Concert', () => {
  // Clean up the models after all tests
  after(() => {
    mongoose.models = {};
  });

  it('should throw an error if performer, genre or image is not a string', async () => {
    const concert = new Concert({
      performer: 123, // Not a string
      genre: 456, // Not a string
      price: 50,
      day: 1,
      image: 789, // Not a string
    });

    try {
      await concert.validate();
    } catch (error) {
      expect(error).to.exist;
      expect(error.errors).to.exist;

      if (
        typeof concert.performer !== 'string' ||
        typeof concert.genre !== 'string' ||
        typeof concert.image !== 'string'
      ) {
        expect(error.errors).to.exist;
      }
    }
  });

  it('should throw an error if price or day is not a number', async () => {
    const concert = new Concert({
      performer: 'Artist',
      genre: 'Rock',
      price: 'Invalid', // Not a number
      day: 'Invalid', // Not a number
      image: 'image.jpg',
    });

    let error;
    try {
      await concert.validate();
    } catch (err) {
      error = err;
    }

    expect(error).to.exist;
    expect(error.errors).to.have.property('price');
    expect(error.errors).to.have.property('day');
  });

  it('should throw an error if any required field is missing', async () => {
    const concert = new Concert({
      genre: 'Rock',
      price: 50,
      day: 1,
      image: 'image.jpg',
    });

    try {
      await concert.validate();
    } catch (error) {
      expect(error).to.exist;
      expect(error.errors).to.have.property('performer');
    }

  });

  it('should not throw an error if all required fields are present', async () => {
    const concert = new Concert({
      performer: 'Artist',
      genre: 'Rock',
      price: 50,
      day: 1,
      image: 'image.jpg',
    });

    let error;
    try {
      await concert.validate();
    } catch (err) {
      error = err;
    }

    expect(error).to.not.exist;
  });
});
