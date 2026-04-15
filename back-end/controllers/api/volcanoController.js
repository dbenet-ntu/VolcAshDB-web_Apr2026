const { Volcano } = require('../../models/volcano');
const { Eruption } = require('../../models/eruption');
const { Sample } = require('../../models/sample');

const getAllVolcanoes = async (req, res) => {
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
			'volc_name',
			'volc_last_eruption',
			'volc_loc', 
			'volc_mcont',
			'volc_rtype', 
			'volc_status', 
			'volc_subreg',
			'volc_type',
			'imgURL',
			'data_source'
		];
		
		// Define which fields should be exact matches
		const exactMatchFields = [
			'volc_country', 'tectonic_settings',
			'volc_selev', 'volc_slat', 'volc_slon'
		];
		
		// Define numeric fields
		const numericFields = ['volc_num'];
		
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
				}
			}
		}

		// Execute query with pagination
		const volcanoes = await Volcano.find(filter)
			.sort({ volc_num: 1 })
			.skip(offsetNum)
			.limit(limitNum);

		// Get total count for pagination metadata
		const totalCount = await Volcano.countDocuments(filter);

		// Check if no results found
        if (volcanoes.length === 0) {
            return res.status(404).json({ error: 'Not Found' });
        }

		const response = { 
			data: volcanoes,
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
			const countries = await Volcano.distinct('volc_country', filter);
			const tectonics = await Volcano.distinct('tectonic_settings', filter);
			const rockTypes = await Volcano.distinct('volc_rtype', filter);
			const volcanoTypes = await Volcano.distinct('volc_type', filter);

			response.stats = {
				total_countries: countries.length,
				total_tectonic_settings: tectonics.length,
				total_rock_types: rockTypes.length,
				total_volcano_types: volcanoTypes.length,
				countries,
				tectonic_settings: tectonics,
				rock_types: rockTypes,
				volcano_types: volcanoTypes
			};
		}

		res.json(response);
	} catch (error) {
		res.status(500).json({  error: "Internal Server Error" });
	}
};

const getVolcanoById = async (req, res) => {
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
		
		const volcano = await Volcano.findOne({ volc_num: Number(id) });

		if (!volcano) {
			return res.status(404).json({ error: 'Not Found' });
		}

		res.json(volcano);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getVolcanoStats = async (req, res) => {
	try {
		const total = await Volcano.countDocuments();

		if (total === 0) {
			return res.status(404).json({ error: 'Not Found' });
		}

		const countries = await Volcano.distinct('volc_country');
		const tectonics = await Volcano.distinct('tectonic_settings');
		const rockTypes = await Volcano.distinct('volc_rtype');
		const volcanoTypes = await Volcano.distinct('volc_type');

		res.json({
			total_volcanoes: total,
			total_countries: countries.length,
			total_tectonic_settings: tectonics.length,
			total_rock_types: rockTypes.length,
			total_volcano_types: volcanoTypes.length,
			countries,
			tectonic_settings: tectonics,
			rock_types: rockTypes,
			volcano_types: volcanoTypes
		});
	} catch {
		res.status(500).json({ error: "Internal Server Error" });
	}
}

module.exports = {
	getAllVolcanoes,
	getVolcanoById,
	getVolcanoStats
};
