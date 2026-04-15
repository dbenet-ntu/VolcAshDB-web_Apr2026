const { Eruption } = require('../../models/eruption');

const getAllEruptions = async (req, res) => {

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
			'ed_area', 
			'ed_category', 
			'ed_evidence', 
			'ed_VEI_mod',
			'ed_startyear',
			'ed_startyear_mod', 
			'ed_startyear_unc', 
			'ed_startmonth',
			'ed_startday',
			'ed_startday_mod', 
			'ed_startday_unc', 
			'ed_endyear',
			'ed_endyear_mod',
			'ed_endyear_unc',
			'ed_endmonth',
			'ed_endday',
			'ed_endday_mod', 
			'ed_endday_unc', 
		];
				
		const exactMatchFields = [];

		// Define numeric fields
		const numericFields = [
			'ed_latitude', 'ed_longitude', 'ed_num', 'ed_VEI', 'volc_num'
		];

		// Define date fields
		const dateFields = ['ed_etime', 'ed_stime'];

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
				}
			}
		}

		// Execute query with pagination
		const eruptions = await Eruption.find(filter)
			.sort({ volc_num: 1 })
			.skip(offsetNum)
			.limit(limitNum);

		// Get total count for pagination metadata
		const totalCount = await Eruption.countDocuments(filter);

		// Check if no results found
        if (eruptions.length === 0) {
            return res.status(404).json({ error: 'Not Found' });
        }

		const response = { 
			data: eruptions,
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
			const total = await Eruption.countDocuments();

			const veiStats = await Eruption.aggregate([
				{ $group: { _id: "$ed_VEI", count: { $sum: 1 } } },
				{ $project: { _id: 0, VEI: "$_id", count: "$count" } },
				{ $sort: { _id: 1 } }
			]);

			const eruptionsPerVolcano = await Eruption.aggregate([
				{
					$group: {
					_id: {
						volc_num: "$volc_num",
						volc_name: "$volc_name"
					},
					count: { $sum: 1 }
					}
				},
				{
					$project: {
						_id: 0,
						volc_num: "$_id.volc_num",
						volc_name: "$_id.volc_name",
						eruption_count: "$count"
					}
				},
				{ $sort: { eruption_count: -1 } }
			]);

			response.stats = { total, veiStats, eruptionsPerVolcano }
		}

		res.json(response);
	} catch {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getEruptionById = async (req, res) => {
	
	try {
		const id = req.params.id;

		// Generic validation for query parameters
		const validationRules = {
			id: { type: 'number', required: true }
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

		const eruption = await Eruption.findOne({ ed_num: Number(id) });

		if (!eruption) {
			return res.status(404).json({ error: 'Not Found' });
		}

		res.json(eruption);
	} catch {
		res.status(500).json({ error: "Internal Server Error" });
	}
};


const getEruptionStats = async (req, res) => {
	try {
		const total = await Eruption.countDocuments();

		if (total === 0) {
			return res.status(404).json({ error: 'Not Found' });
		}

		const veiStats = await Eruption.aggregate([
			{ $group: { _id: "$ed_VEI", count: { $sum: 1 } } },
			{ $project: { _id: 0, VEI: "$_id", count: "$count" } },
			{ $sort: { _id: 1 } }
		]);

		const eruptionsPerVolcano = await Eruption.aggregate([
			{
				$group: {
				_id: {
					volc_num: "$volc_num",
					volc_name: "$volc_name"
				},
				count: { $sum: 1 }
				}
			},
			{
				$project: {
					_id: 0,
					volc_num: "$_id.volc_num",
					volc_name: "$_id.volc_name",
					eruption_count: "$count"
				}
			},
			{ $sort: { eruption_count: -1 } }
		]);

		res.json({ total, veiStats, eruptionsPerVolcano });
	} catch {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = {
	getAllEruptions,
	getEruptionById,
	getEruptionStats
};
