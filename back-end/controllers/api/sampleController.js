const { Sample } = require('../../models/sample');
const { Particle } = require('../../models/particle');

const getAllSamples = async (req, res) => {
	try {
		const { 
			include_stats = false, 
			limit = 100, 
			page = 1, 
			offset = 0,
			...queryParams 
		} = req.query;
		
		// Parse pagination parameters
		const limitNum = Math.min(1000, Math.max(1, parseInt(limit) || 100)); // Max 1000, default 100
		const pageNum = Math.max(1, parseInt(page) || 1);
		const offsetNum = parseInt(offset) || ((pageNum - 1) * limitNum);

		// Build filter object dynamically from query parameters
		const filter = {};

		// Define which fields should use regex search (text fields)
		const textSearchFields = [
			'sample_code', 'afe_code', 'sample_techn', 'sample_surf', 'sample_collector'
		];

		// Define which fields should be exact matches
		const exactMatchFields = [
			'sample_lat', 'sample_lon', 'oxygen_fugacity'
		];

		// Define numeric fields
		const numericFields = [
			'volc_num', 'temperature_lower_bound', 'temperature_upper_bound', 'experiment_duration'
		];

		// Define date fields
		const dateFields = ['sample_date'];

		// Define boolean fields
		const booleanFields = ['sample_nat'];

		// Define array fields (enum arrays)
		const arrayFields = ['lab_procedure'];

		// Process query parameters
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined && value !== null && value !== '') {
				if (textSearchFields.includes(key)) {
					// Use regex for case-insensitive partial matching on text fields
					filter[key] = { $regex: value, $options: 'i' };
				} else if (exactMatchFields.includes(key)) {
					// Exact match for specific fields
					filter[key] = value;
				} else if (numericFields.includes(key)) {
					// Convert to number for numeric fields
					const numValue = Number(value);
					if (!isNaN(numValue)) {
						filter[key] = numValue;
					}
				} else if (dateFields.includes(key)) {
					// Handle date fields - accept ISO date strings
					const dateValue = new Date(value);
					if (!isNaN(dateValue.getTime())) {
						filter[key] = dateValue;
					}
				} else if (booleanFields.includes(key)) {
					// Convert to boolean for boolean fields
					filter[key] = value === 'true' || value === true;
				} else if (arrayFields.includes(key)) {
					// Handle array fields - check if array contains the value
					filter[key] = { $in: [value] };
				}
			}
		}


		// Execute query with pagination
		const samples = await Sample.find(filter)
			.sort({ sample_code: 1 })
			.skip(offsetNum)
			.limit(limitNum);

		// Get total count for pagination metadata
		const totalCount = await Sample.countDocuments(filter);

		// Check if no results found
        if (samples.length === 0) {
            return res.status(404).json({ error: 'Not Found' });
        }

		const response = { 
			data: samples,
			pagination: {
				page: pageNum,
				limit: limitNum,
				offset: offsetNum,
				total: totalCount,
				pages: Math.ceil(totalCount / limitNum),
				hasNext: offsetNum + limitNum < totalCount,
				hasPrev: offsetNum > 0
			}
		};

		// Include stats if requested
		if (include_stats === 'true' || include_stats === true) {
			const byVolcano = await Sample.aggregate([
				{ $match: filter },
				{
					$group: {
						_id: '$volc_num',
						count: { $sum: 1 }
					}
				},
				{
					$lookup: {
						from: 'volcanos',
						localField: '_id',
						foreignField: 'volc_num',
						as: 'volcanoInfo'
					}
				},
				{
					$unwind: {
						path: '$volcanoInfo',
						preserveNullAndEmptyArrays: true
					}
				},
				{
					$project: {
						volcano_id: '$_id',
						volcano_name: '$volcanoInfo.volc_name',
						count: 1,
						_id: 0
					}
				},
				{ $sort: { volcano_id: 1 } }
			]);

			const byAFECode = await Sample.aggregate([
				{ $match: filter },
				{ 
					$group: { 
						_id: '$afe_code', 
						count: { $sum: 1 } 
					} 
				}, 
				{
					$project: {
						afe_code: '$_id',
						count: 1,
						_id: 0
					}
				}
			]);

			response.stats = {
				total_by_volcano: byVolcano,
				total_by_afe_code: byAFECode
			};
		}

		res.json(response);
	} catch {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getSampleById = async (req, res) => {
	try {
		const id = req.params.id;
		
		// Generic validation for query parameters
		const validationRules = {
			id: { type: 'string', required: true }
		};

		for (const [field, rules] of Object.entries(validationRules)) {
			const value = field === 'id' ? req.params[field] : req.query[field];
			
			if (rules.required && (value === undefined || value === null || value === '')) {
				return res.status(400).json({ error: "Bad Request" });
			}
			
			if (value !== undefined && rules.type === 'string' && typeof value !== 'string') {
				return res.status(400).json({ error: "Bad Request" });
			}
		}

		const sample = await Sample.findOne({ sample_code: id });

		if (!sample) {
			return res.status(404).json({ error: 'Not Found' });
		}

		res.json(sample);
	} catch {
		res.status(500).json({ error: "Internal Server Error"});
	}
};

const getSampleParticles = async (req, res) => {
	try {
		const sampleCode = req.params.id;
		const { page = 1, limit = 50, exclude_faulty = true, min_area, max_area } = req.query;

		// Check if sample exists
		const sampleExists = await Sample.findOne({ sample_code: sampleCode });
		if (!sampleExists) {
			return res.status(404).json({ 
				error: 'Sample not found',
				message: `No sample found with code ${sampleCode}` 
			});
		}

		// Build filter
		const filter = { sample_code: sampleCode };
		
		// Exclude faulty images by default
		if (exclude_faulty === 'true' || exclude_faulty === true) {
			filter.$or = [{ faulty_image: false }, { faulty_image: { $exists: false } }];
		}

		if (min_area) filter.area = { ...filter.area, $gte: parseFloat(min_area) };
		if (max_area) filter.area = { ...filter.area, $lte: parseFloat(max_area) };

		// Calculate pagination
		const pageNumber = Math.max(1, parseInt(page));
		const limitNumber = Math.min(100, Math.max(1, parseInt(limit)));
		const skip = (pageNumber - 1) * limitNumber;

		const particles = await Particle.find(filter)
			.skip(skip)
			.limit(limitNumber)
			.sort({ _id: 1 });

		const total = await Particle.countDocuments(filter);

		res.json({
			data: particles,
			pagination: {
				page: pageNumber,
				limit: limitNumber,
				total,
				pages: Math.ceil(total / limitNumber)
			}
		});
	} catch (error) {
		console.error('Error fetching sample particles:', error);
		res.status(500).json({ 
			error: 'Failed to fetch sample particles',
			message: error.message 
		});
	}
};

/**
 * @swagger
 * /api/sample/origin/{is_natural}:
 *   get:
 *     summary: Get samples filtered by origin (natural or experimental)
 *     tags: [Sample]
 *     parameters:
 *       - in: path
 *         name: is_natural
 *         required: true
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: 'true' for natural samples, 'false' for experimental
 *     responses:
 *       200:
 *         description: Array of samples matching origin
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Sample'
 *       400:
 *         description: Invalid parameter (must be true or false)
 *       500:
 *         description: Server error
 */
const getSamplesByOrigin = async (req, res) => {
	const isNaturalParam = req.params.is_natural.toLowerCase();

	// Validate parameter
	if (isNaturalParam !== 'true' && isNaturalParam !== 'false') {
		return res.status(400).json({ error: 'Invalid parameter, must be true or false' });
	}

	const isNatural = isNaturalParam === 'true';

	try {
		const samples = await Sample.find({ sample_nat: isNatural });
		res.json(samples);
	} catch {
		res.status(500).json({ error: 'Failed to fetch samples by origin' });
	}
};

/**
 * @swagger
 * /api/sample/volc_num/{volc_num}:
 *   get:
 *     summary: Get samples by volcano number
 *     tags: [Sample]
 *     parameters:
 *       - in: path
 *         name: volc_num
 *         required: true
 *         schema:
 *           type: integer
 *         description: Volcano numeric ID
 *     responses:
 *       200:
 *         description: Array of samples for the volcano
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Sample'
 *       500:
 *         description: Server error
 */
const getSamplesByVolcanoNum = async (req, res) => {
	try {
		const samples = await Sample.find({ volc_num: Number(req.params.volc_num) });
		res.json(samples);
	} catch {
		res.status(500).json({ error: 'Failed to fetch samples for this volcano' });
	}
};

/**
 * @swagger
 * /api/sample/search/code:
 *   get:
 *     summary: Search samples by sample_code (partial, case-insensitive)
 *     tags: [Sample]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Substring to match in sample_code
 *     responses:
 *       200:
 *         description: Array of matching samples
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Sample'
 *       400:
 *         description: Missing or invalid query parameter q
 *       500:
 *         description: Server error
 */
const searchSampleByCode = async (req, res) => {
	const { q } = req.query;
	if (!q) return res.status(400).json({ error: 'Missing query parameter q' });

	try {
		const samples = await Sample.find({ sample_code: { $regex: q, $options: 'i' } });
		res.json(samples);
	} catch {
		res.status(500).json({ error: 'Search failed' });
	}
};

const getSampleStats = async (req, res) => {
	try {
		const total = await Sample.countDocuments();

		if (total === 0) {
			return res.status(404).json({ error: 'Not Found' });
		}

		// Aggregate samples grouped by volc_num, then lookup volc_name from Volcano collection
		const byVolcano = await Sample.aggregate([
		{
			$group: {
				_id: '$volc_num',
				count: { $sum: 1 }
			}
		},
		{
			$lookup: {
				from: 'volcanos',        // collection name in MongoDB (make sure it's correct)
				localField: '_id',
				foreignField: 'volc_num',
				as: 'volcanoInfo'
			}
		},
		{
			$unwind: {
				path: '$volcanoInfo',
				preserveNullAndEmptyArrays: true  // in case some volc_num have no matching volcano
			}
		},
		{
			$project: {
				volc_num: '$_id',
				volc_name: '$volcanoInfo.volc_name',
				count: 1,
				_id: 0
			}
		},
		{
			$sort: { volc_num: 1 }
		}
		]);

		const byAFECode = await Sample.aggregate([
			{ 
				$group: { 
					_id: '$afe_code', 
					count: { $sum: 1 } 
				} 
			}, 
			{
				$project: {
					afe_code: '$_id',
					count: 1,
					_id: 0
				}
			}
		]);

		res.json({ total, byVolcano, byAFECode });
	} catch {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = {
	getAllSamples,
	getSampleById,
	getSampleStats
};
