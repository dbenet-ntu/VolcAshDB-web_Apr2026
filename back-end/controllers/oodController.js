const axios = require('axios');
const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

/**
 * Analyze OOD (Out-Of-Distribution) for uploaded images
 * Accepts a ZIP file, extracts images, and sends them to the Flask OOD endpoint
 */
const analyzeOOD = async (req, res) => {
	try {
		// 1. Check if file was uploaded
		if (!req.file) {
			return res.status(400).json({ error: 'No file uploaded' });
		}

		const zipPath = req.file.path;
		const sessionId = `ood_${Date.now()}_${Math.round(Math.random() * 1E9)}`;

		// 2. Create session folder in uploads/ood
		const sessionPath = path.join(__dirname, '../uploads/ood', sessionId);
		const extractPath = path.join(sessionPath, 'extracted');
		const analysisPath = path.join(sessionPath, 'ood_analysis');
		fs.mkdirSync(extractPath, { recursive: true });
		fs.mkdirSync(analysisPath, { recursive: true });

		const zip = new AdmZip(zipPath);
		zip.extractAllTo(extractPath, true);

		// 3. Find all images in the extracted folder
		const imageExtensions = ['.png', '.jpg', '.jpeg'];
		const findImages = (dir) => {
			let images = [];
			const files = fs.readdirSync(dir);
			
			for (const file of files) {
				const fullPath = path.join(dir, file);
				const stat = fs.statSync(fullPath);
				
				if (stat.isDirectory()) {
					images = images.concat(findImages(fullPath));
				} else {
					const ext = path.extname(file).toLowerCase();
					if (imageExtensions.includes(ext)) {
						images.push(fullPath);
					}
				}
			}
			
			return images;
		};

		const imagePaths = findImages(extractPath);

		if (imagePaths.length === 0) {
			// Cleanup
			fs.rmSync(extractPath, { recursive: true, force: true });
			fs.unlinkSync(zipPath);
			return res.status(400).json({ error: 'No images found in ZIP file' });
		}

		// 4. Call Flask API for OOD analysis
		const flaskURL = process.env.VOLCASH_CLASSIFIER_API || 'http://localhost:5003';
		console.log(`[OOD] Connecting to Flask at ${flaskURL}/ood_analysis`);
		console.log(`[OOD] Analyzing ${imagePaths.length} images from ${extractPath}`);
		
		const flaskResponse = await axios.post(`${flaskURL}/ood_analysis`, {
			folder_path: extractPath,
			output_folder: analysisPath
		}, {
			timeout: 300000, // 5 minutes timeout
			headers: {
				'Content-Type': 'application/json'
			}
		});

		// 5. Cleanup uploaded ZIP file and extracted images (no longer needed)
		fs.unlinkSync(zipPath);
		fs.rmSync(extractPath, { recursive: true, force: true });
		console.log(`[OOD] Analysis completed, session: ${sessionId}`);

		// 6. Parse Flask response and format for frontend
		const flaskData = flaskResponse.data;
		
		// Transform ood_summary array into object format
		const summary = {
			green: { count: 0, percentage: 0 },
			amber: { count: 0, percentage: 0 },
			red: { count: 0, percentage: 0 }
		};

		if (flaskData.ood_summary && Array.isArray(flaskData.ood_summary)) {
			flaskData.ood_summary.forEach(item => {
				const key = item.warning.toLowerCase();
				if (summary[key]) {
					summary[key] = {
						count: item.count,
						percentage: item.percentage
					};
				}
			});
		}

		// 7. Return formatted results with relative paths
		const makeRelativePath = (absolutePath) => {
			if (!absolutePath) return '';
			// Extract path after 'uploads/'
			const match = absolutePath.match(/uploads\/.+/);
			return match ? `/${match[0]}` : '';
		};

		res.status(200).json({
			sessionId: sessionId,
			total_images: imagePaths.length,
			summary: summary,
			ood_rate: flaskData.ood_rate || 0,
			csv_url: makeRelativePath(flaskData.files?.scores),
			umap_plot_url: makeRelativePath(flaskData.files?.plot),
			analysis_folder: `/uploads/ood/${sessionId}/ood_analysis`
		});

	} catch (error) {
		console.error('Error in OOD analysis:', error);

		// Cleanup on error
		if (req.file && req.file.path && fs.existsSync(req.file.path)) {
			try {
				fs.unlinkSync(req.file.path);
			} catch (cleanupError) {
				console.error('Cleanup error:', cleanupError);
			}
		}

		res.status(500).json({
			error: 'OOD analysis failed',
			details: error.message
		});
	}
};

/**
 * Download OOD analysis results as ZIP
 */
const downloadOODZip = async (req, res) => {
	try {
		const { sessionId } = req.params;

		if (!sessionId) {
			return res.status(400).json({ error: 'Session ID required' });
		}

		const sessionPath = path.join(__dirname, '../uploads/ood', sessionId);
		const analysisPath = path.join(sessionPath, 'ood_analysis');

		if (!fs.existsSync(analysisPath)) {
			return res.status(404).json({ error: 'Analysis results not found' });
		}

		// Create ZIP file
		const zip = new AdmZip();
		zip.addLocalFolder(analysisPath);

		const zipBuffer = zip.toBuffer();

		// Generate filename with timestamp
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
		const filename = `preclassification-check-${timestamp}.zip`;

		// Set headers for download
		res.setHeader('Content-Type', 'application/zip');
		res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
		res.setHeader('Content-Length', zipBuffer.length);

		res.send(zipBuffer);

		// Cleanup after download (with a small delay to ensure download completes)
		setTimeout(() => {
			if (fs.existsSync(sessionPath)) {
				fs.rmSync(sessionPath, { recursive: true, force: true });
				console.log(`[OOD] Cleaned up session: ${sessionId}`);
			}
		}, 5000);

	} catch (error) {
		console.error('Error downloading OOD ZIP:', error);
		res.status(500).json({
			error: 'Failed to create ZIP file',
			details: error.message
		});
	}
};

module.exports = {
	analyzeOOD,
	downloadOODZip
};
