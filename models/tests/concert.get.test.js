const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server'); 
const Concert = require('../concert.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('Concert API - GET', () => {
  // Before hook to add a test concert before testing
  before(async () => {
    const testConcert = new Concert({
      performer: 'John Doe',
      genre: 'Rock',
      price: 60,
      day: 3,
      image: 'image.jpg',
    });
    await testConcert.save();

    testConcert2 = new Concert({
      performer: 'John Smith',
      genre: 'Pop',
      price: 80,
      day: 3,
      image: 'image.jpg',
    })
    await testConcert2.save();
  });
  after(async () => {
    await Concert.deleteMany(); 
  });
  
  // Test cases for GET endpoints
  describe('GET /api/concerts', () => {

    it('should return performer by performer name', async () => {
      const performerName = 'John Doe';
      const res = await request(server).get(
        `/api/concerts/performer/${performerName}`
      );
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });

    it('should return all concerts within a genre', async () => {
      const genreName = 'Rock';
      const res = await request(server).get(`/api/concerts/genre/${genreName}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });

    it('should return all concerts within a price range', async () => {
      const priceMin = 40;
      const priceMax = 90;
      const res = await request(server).get(
        `/api/concerts/price/${priceMin}/${priceMax}`
      );
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });

    it('should return all concerts in chosen day', async () => {
      const day = 3;
      const res = await request(server).get(`/api/concerts/day/${day}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

});
