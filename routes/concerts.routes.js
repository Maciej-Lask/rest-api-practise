const express = require('express');
const router = express.Router();
const concertsController = require('../controllers/concerts.controller');

router.get('/', concertsController.getAllConcerts);
router.get('/:id', concertsController.getConcertById);
router.post('/', concertsController.createConcert);
router.put('/:id', concertsController.updateConcert);
router.delete('/:id', concertsController.deleteConcert);

router.get('/performer/:performer', concertsController.getConcertsByPerformer);
router.get('/genre/:genre', concertsController.getConcertsByGenre);
router.get('/price/:price_min/:price_max', concertsController.getConcertsByPriceRange);
router.get('/day/:day', concertsController.getConcertsByDay);

module.exports = router;
