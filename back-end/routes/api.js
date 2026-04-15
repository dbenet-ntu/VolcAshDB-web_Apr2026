const express = require('express');
const router = express.Router();

// Import controllers
const volcanoController = require('../controllers/api/volcanoController');
const eruptionController = require('../controllers/api/eruptionController');
const sampleController = require('../controllers/api/sampleController');
const particleController = require('../controllers/api/particleController');
const afeController = require('../controllers/api/afeController');

// VOLCANO ROUTES - FIXED ORDER: specific routes BEFORE parameterized routes
router.get('/volcanoes/stats', volcanoController.getVolcanoStats);           // ✅ MUST come FIRST
router.get('/volcanoes/:id', volcanoController.getVolcanoById);              // ✅ MUST come LAST
router.get('/volcanoes', volcanoController.getAllVolcanoes);

// ERUPTION ROUTES - applying same pattern
router.get('/eruptions/stats', eruptionController.getEruptionStats);
router.get('/eruptions/:id', eruptionController.getEruptionById);
router.get('/eruptions', eruptionController.getAllEruptions);

// SAMPLE ROUTES - applying same pattern  
router.get('/samples/stats', sampleController.getSampleStats);
router.get('/samples/:id', sampleController.getSampleById);
router.get('/samples', sampleController.getAllSamples);

// PARTICLE ROUTES - applying same pattern
router.get('/particles/stats', particleController.getParticleStats);
router.get('/particles/:id', particleController.getParticleById);
router.get('/particles', particleController.getAllParticles);

// AFE ROUTES - applying same pattern
router.get('/afes/stats', afeController.getAfeStats);
router.get('/afes/:id', afeController.getAfeById);
router.get('/afes', afeController.getAllAfes);

module.exports = router;