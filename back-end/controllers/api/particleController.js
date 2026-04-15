const { Particle } = require('../../models/particle');


// Common filter to exclude faulty images
const faultyImageFilter = { $or: [{ faulty_image: false }, { faulty_image: { $exists: false } }] };


/**
 * Helper function to transform imgURL to full URL for FAIR compliance
 * @param {Object} particle - Particle document
 * @param {Object} req - Express request object
 * @returns {Object} Particle with full imgURL
 */
const transformParticleImageUrl = (particle, req) => {
	const particleObj = particle.toObject ? particle.toObject() : particle;

	if (particleObj.imgURL) {
		// Check for X-Forwarded-Proto header (set by nginx reverse proxy)
		// If present, use that protocol (https); otherwise fall back to req.protocol
		const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
		const host = req.get('host');
		particleObj.imgURL = `${protocol}://${host}/images/particles/${particleObj.imgURL}`;
	}

	return particleObj;
};

/**
 * Helper function to transform multiple particles
 * @param {Array} particles - Array of particle documents
 * @param {Object} req - Express request object
 * @returns {Array} Particles with full imgURL
 */
const transformParticlesImageUrls = (particles, req) => {
	return particles.map(particle => transformParticleImageUrl(particle, req));
};


const getAllParticles = async (req, res) => {
  try {
    const { 
		include_stats = false, 
		main_type, 
		limit = 100, 
		page = 1, 
		offset = 0,
		...queryParams 
	} = req.query;
	
	// Parse pagination parameters
	const limitNum = Math.min(1000, Math.max(1, parseInt(limit) || 100)); // Max 1000, default 100
	const pageNum = Math.max(1, parseInt(page) || 1);
	const offsetNum = parseInt(offset) || ((pageNum - 1) * limitNum);

	// Check if main_type is valid (keep existing validation)
	if (!['lithic', 'free crystal', 'altered material', 'juvenile'].includes(main_type) && main_type !== undefined) {
		return res.status(400).json({ error: 'Bad Request' });
	}

    // Build filter object dynamically from query parameters
    const filter = {};

    // Apply faulty image filter by default
    Object.assign(filter, faultyImageFilter);

	// Define which fields should use regex search (text fields)
	const textSearchFields = [
		'imgURL', 'sample_code', 'volc_name', 'instrument', 'weathering_sign'
	];

	// Define which fields should be exact matches (enum fields)
	const exactMatchFields = [
		'color', 'crystallinity', 'edge', 'gsLow', 'gsUp', 'hydro_alter_degree',
		'luster', 'shape', 'sub_type', 'type'
	];

	// Define numeric fields
	const numericFields = [
		'aspect_rat', 'blue_mean', 'blue_mode', 'blue_std', 'circularity_cioni',
		'circularity_dellino', 'comp_elon', 'compactness', 'contrast', 'convexity',
		'correlation', 'dissimilarity', 'eccentricity_ellipse', 'eccentricity_moments',
		'elongation', 'energy', 'green_mean', 'green_mode', 'green_std', 'homogeneity',
		'hue_mean', 'hue_mode', 'hue_std', 'id', 'magnification', 'rect_comp',
		'rectangularity', 'red_mean', 'red_mode', 'red_std', 'roundness',
		'saturation_mean', 'saturation_mode', 'saturation_std', 'solidity',
		'value_mean', 'value_mode', 'value_std', 'volc_num'
	];

	// Define boolean fields
	const booleanFields = [
		'faulty_image', 'multi_focus', 'requiresDetailedAnnotation', 'ultrasound'
	];

	// Handle special main_type filtering (keep existing logic)
	if (main_type) {
		filter[`main_type.${main_type}`] = { $gt: 0 };
	}

	// Process query parameters
	for (const [key, value] of Object.entries(queryParams)) {
		if (value !== undefined && value !== null && value !== '') {
			if (textSearchFields.includes(key)) {
				// Use regex for case-insensitive partial matching on text fields
				filter[key] = { $regex: value, $options: 'i' };
			} else if (exactMatchFields.includes(key)) {
				// Exact match for enum and specific fields
				filter[key] = value;
			} else if (numericFields.includes(key)) {
				// Convert to number for numeric fields
				const numValue = Number(value);
				if (!isNaN(numValue)) {
					filter[key] = numValue;
				}
			} else if (booleanFields.includes(key)) {
				// Convert to boolean for boolean fields
				filter[key] = value === 'true' || value === true;
			}
		}
	}


    // Execute query with pagination
    const particles = await Particle.find(filter)
		.sort({ _id: 1 })
		.skip(offsetNum)
		.limit(limitNum);

	// Get total count for pagination metadata
	const totalCount = await Particle.countDocuments(filter);

	// Check if no results found
	if (particles.length === 0) {
		return res.status(404).json({ error: 'Not Found' });
	}
	// Transform imgURL to full URLs
	const transformedParticles = transformParticlesImageUrls(particles, req);

    const response = { 		    
		data: transformedParticles,
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
      const volcanoes = await Particle.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$volc_num',
            count: { $sum: 1 },
            volcano_name: { $first: '$volc_name' }
          }
        },
        {
          $project: {
            volcano_id: '$_id',
            volcano_name: '$volcano_name',
            count: 1,
            _id: 0
          }
        },
        { $sort: { count: -1 } }
      ]);

      response.stats = {
        total_by_volcano: volcanoes
      };
    }

    res.json(response);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getParticleById = async (req, res) => {
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

    const particle = await Particle.findOne( { imgURL: id, ...faultyImageFilter } );

    if (!particle) {
      return res.status(404).json({ error: 'Not found' });
    }
	// Transform imgURL to full URL
	const transformedParticle = transformParticleImageUrl(particle, req);

	res.json(transformedParticle);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


/**
 * @swagger
 * /api/particles/filter/main-type:
 *   get:
 *     tags: [Particle]
 *     summary: Filter particles by main type range
 *     description: Filter non-faulty particles by a percentage range on a given main_type category
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [lithic, "free crystal", "altered material", juvenile]
 *         description: Main type category
 *         example: lithic
 *       - in: query
 *         name: min
 *         required: true
 *         schema:
 *           type: number
 *         description: Minimum percentage (inclusive)
 *         example: 0
 *       - in: query
 *         name: max
 *         required: true
 *         schema:
 *           type: number
 *         description: Maximum percentage (inclusive)
 *         example: 100
 *     responses:
 *       200:
 *         description: List of filtered particles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Particle'
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
const filterByMainTypeRange = async (req, res) => {
	const { type, min, max } = req.query;

	// Validate required parameters
	if (!type || min === undefined || max === undefined) {
		return res.status(400).json({ error: 'Missing query parameters type, min or max' });
	}

	// Validate main_type category
	if (!['lithic', 'free crystal', 'altered material', 'juvenile'].includes(type)) {
		return res.status(400).json({ 
			error: 'Invalid main_type. Must be one of: lithic, free crystal, altered material, juvenile' 
		});
	}

	// Validate numeric range
	const minVal = parseFloat(min);
	const maxVal = parseFloat(max);
	if (isNaN(minVal) || isNaN(maxVal)) {
		return res.status(400).json({ error: 'min and max must be numbers' });
	}

	if (minVal > maxVal) {
		return res.status(400).json({ error: 'min value cannot be greater than max value' });
	}

	try {
		const filter = {
			[`main_type.${type}`]: { $gte: minVal, $lte: maxVal },
      		...faultyImageFilter,
		};
		const particles = await Particle.find(filter);
		res.json(particles);
	} catch {
		res.status(500).json({ error: 'Filter failed' });
	}
};


const getParticleStats = async (req, res) => {
	try {
		// Total non-faulty particle count
		const total = await Particle.countDocuments(faultyImageFilter);

		if (total === 0) {
			return res.status(404).json({ error: 'Not Found' });
		}

		// Aggregate count of particles per main_type category (only if > 0%)
		const main_types = await Particle.aggregate([
			{ $match: faultyImageFilter },
			{
				$project: {
					main_type: { $objectToArray: "$main_type" }
				}
			},
			{ $unwind: "$main_type" },
			{
				$match: {
					"main_type.v": { $gt: 0 }
				}
			},
			{
				$group: {
					_id: "$main_type.k",
					count: { $sum: 1 }
				}
			},
			{
				$project: {
					main_type: '$_id',
					count: 1,
					_id: 0
				}
			},
			{ $sort: { count: -1 } }
		]);

		// Aggregate count of particles per volcano
		const volcanoes = await Particle.aggregate([
			{ $match: faultyImageFilter },
			{
				$group: {
					_id: '$volc_num',
					count: { $sum: 1 },
					volc_name: { $first: '$volc_name' }
				}
			},
			{
				$project: {
					volc_num: '$_id',
					volc_name: '$volc_name',
					count: 1,
					_id: 0
				}
			},
			{ $sort: { count: -1 } }
		]);

		res.json({ total, main_types, volcanoes });
	} catch {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = {
	getAllParticles,
	getParticleById,
  	getParticleStats
};
