const { AFE } = require('../../models/afe');

const getAllAfes = async (req, res) => {

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

		// Categorize fields for different filtering approaches
		const textSearchFields = ['afe_code', 'eruptive_style', 'afe_dataBP'];
		const exactMatchFields = ['afe_lat', 'afe_lon'];
		const dateFields = ['afe_date', 'afe_end_date'];
		const numericFields = ['volc_num'];

		// Build filter object dynamically
		const filter = {};

		// Process all query parameters
		for (const [key, value] of Object.entries(queryParams)) {
			if (value === undefined || value === null || value === '') continue;

			if (textSearchFields.includes(key)) {
				// Case-insensitive partial match for text fields  
				filter[key] = { $regex: value, $options: 'i' };
			} else if (exactMatchFields.includes(key)) {
				// Exact match for specific fields
				filter[key] = value;
			} else if (numericFields.includes(key)) {
				// Exact match for numeric fields
				const numValue = Number(value);
				if (!isNaN(numValue)) {
					filter[key] = numValue;
				}
			} else if (dateFields.includes(key)) {
				// Date filtering - exact date match
				const dateValue = new Date(value);
				if (!isNaN(dateValue.getTime())) {
					filter[key] = dateValue;
				}
			}
		}

		// Execute query with pagination
		const afes = await AFE.find(filter)
			.sort({ volc_num: 1 })
			.skip(offsetNum)
			.limit(limitNum);

		// Get total count for pagination metadata
		const totalCount = await AFE.countDocuments(filter);

		// Check if no results found
        if (afes.length === 0) {
            return res.status(404).json({ error: 'Not Found' });
        }

		const response = { 
			data: afes,
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
			const total = await AFE.countDocuments();

			// Group and count documents by eruptive style
			const eruptiveStyles = await AFE.aggregate([
				{ $group: { _id: '$eruptive_style', count: { $sum: 1 } } },
				{ $sort: { count: -1 } },
				{ $project: { eruptive_style: '$_id', count: 1,	_id: 0 }}
			]);

			// Group and count documents by volcano number
			const volcanoStats = await AFE.aggregate([
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

			response.stats = { total, eruptiveStyles, volcanoStats }
		}

		res.json(response);
	} catch {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getAfeById = async (req, res) => {
	
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

		const afe = await AFE.findOne({ afe_code: id });

		if (!afe) {
			return res.status(404).json({ error: 'Not Found' });
		}

		res.json(afe);
	} catch {
		res.status(500).json({ error: "Internal Server Error" });
	}
};


const getAfeStats = async (req, res) => {
	try {
		const total = await AFE.countDocuments();

		if (total === 0) {
			return res.status(404).json({ error: 'Not Found' });
		}

		// Group and count documents by eruptive style
		const eruptiveStyles = await AFE.aggregate([
			{ $group: { _id: '$eruptive_style', count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
			{ $project: { eruptive_style: '$_id', count: 1,	_id: 0 }}
		]);

		// Group and count documents by volcano number
		const volcanoStats = await AFE.aggregate([
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

		res.json({
			total,
			eruptiveStyles,
			volcanoStats
		});
	} catch {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = {
	getAllAfes,
	getAfeById,
	getAfeStats
};
