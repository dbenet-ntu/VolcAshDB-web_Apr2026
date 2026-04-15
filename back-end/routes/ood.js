const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzeOOD, downloadOODZip } = require('../controllers/oodController');

const router = express.Router();

// Configure multer for OOD uploads
const oodStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadPath = path.join(__dirname, '../uploads/ood');
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath, { recursive: true });
		}
		cb(null, uploadPath);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, 'ood-' + uniqueSuffix + path.extname(file.originalname));
	}
});

const upload = multer({
	storage: oodStorage,
	limits: {
		fileSize: 150 * 1024 * 1024 // 150 MB limit
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed' || file.originalname.endsWith('.zip')) {
			cb(null, true);
		} else {
			cb(new Error('Only ZIP files are allowed'), false);
		}
	}
});

/**
 * POST /ood/analyze
 * Upload ZIP file for OOD analysis
 */
router.post('/analyze', (req, res, next) => {
	upload.single('file')(req, res, (err) => {
		if (err) {
			if (err.code === 'LIMIT_FILE_SIZE') {
				return res.status(413).json({ error: 'File too large. Maximum size is 100 MB.' });
			}
			return res.status(400).json({ error: err.message });
		}
		next();
	});
}, analyzeOOD);

/**
 * GET /ood/download/:sessionId
 * Download OOD analysis results as ZIP
 */
router.get('/download/:sessionId', downloadOODZip);

module.exports = router;
