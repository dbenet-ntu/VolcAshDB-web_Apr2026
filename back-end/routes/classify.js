const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth');

const { 
    uploadParticles,
    upload
} = require('../controllers/classifyController');

// Apply authentication middleware to all routes
router.use(requireAuth);

/**
 * @route POST /classify/upload
 * @description Upload and classify particle images (ZIP or single image)
 * @access Protected
 */
router.post('/upload', upload.single('file'), uploadParticles);

module.exports = router;