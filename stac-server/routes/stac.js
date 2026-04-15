const express = require('express');
const router = express.Router();

const { getLandingPage } = require('../controllers/landingController');
const { getConformance } = require('../controllers/conformanceController');
const { getCollections, getCollection } = require('../controllers/collectionsController');
const { getItems, getItem } = require('../controllers/itemsController');
const { getParticleImages } = require('../controllers/imagesController');
const { searchItems, searchItemsGet } = require('../controllers/searchController');

// Core STAC endpoints
router.get('/', getLandingPage);
router.get('/conformance', getConformance);
router.get('/collections', getCollections);
router.get('/collections/:collectionId', getCollection);
router.get('/collections/:collectionId/items', getItems);
router.get('/collections/:collectionId/items/:itemId', getItem);

// STAC Search endpoints
router.post('/search', searchItems);
router.get('/search', searchItemsGet);

// Custom endpoints
router.get('/images/particles', getParticleImages);

module.exports = router;
