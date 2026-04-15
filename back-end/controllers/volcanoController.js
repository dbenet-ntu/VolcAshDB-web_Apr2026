const { default: mongoose } = require('mongoose');
const { Volcano } = require('../models/volcano');
const { Particle } = require('../models/particle');

/**
 * Retrieves all volcano records from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send the response.
 */
const get = async (req, res) => {
    try {
        // Fetch all volcano records
        const volcanoes = await Volcano.find();
        
        res.status(200).send(volcanoes);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

/**
 * Retrieves Volcano documents based on a tectonic setting.
 * @param {Object} req - The request object containing the tectonic setting query.
 * @param {Object} res - The response object.
 */
const getTectonicSetting = async (req, res) => {
    // Extract the volcano name from the query parameters
    const tectonic_setting = req.query.tectonic_setting === "Undefined" ? null : req.query.tectonic_setting;
    const natural_sample = req.query.natural_sample === 'true';

    try {
        // Aggregate volcano documents that match the given tectonic setting
        const volcanoes = await Volcano.aggregate([
            {
                $lookup: {
                    from: "samples",  // Collection to join with
                    localField: "volc_num",  // Field from the volcano collection
                    foreignField: "volc_num", // Field from the afes collection
                    as: "sample_details"  // Alias for the joined records
                }
            },
            {
                $match: {
                    sample_details: { 
                        $exists: true,  // Ensure the field exists
                        $ne: []  // Ensure the field is not an empty array
                    }
                }
            },
            {
                $match: {
                    tectonic_settings: tectonic_setting, // Filter based on the tectonic setting
                    "sample_details.sample_nat": natural_sample  // Ensure at least one sample has sample_nat = natural_sample
                }
            }
        ]);
        res.status(200).send(volcanoes);
    } catch (error) {
        res.status(404).send(error.message);
    }
};

/**
 * Retrieves volcano records that have associated samples records and the number of particles associated.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send the response.
 */
const getVolcStd = async (req, res) => {
    try {

        const volcanoes = await Particle.aggregate([
            {
                $match: {
                    faulty_image: { $ne: true } // Exclude particles with faulty images
                }
            },
            {
                $group: {
                    _id: "$volc_num", // Change this to the relevant filter field
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "volcanoes",  // Collection to join with
                    localField: "_id",  // Field from the volcano collection
                    foreignField: "volc_num", // Field from the afes collection
                    as: "volcano_details"  // Alias for the joined records
                }
            },
            {
                $unwind: {
                    path: '$volcano_details',
                    preserveNullAndEmptyArrays: true // Keep particles even if they have no AFE details
                }
            },
            {
                $lookup: {
                    from: "samples",  // Collection to join with
                    localField: "_id",  // Field from the volcano collection
                    foreignField: "volc_num", // Field from the afes collection
                    as: "sample_details"  // Alias for the joined records
                }
            },
            {
                $unwind: {
                    path: '$sample_details',
                    preserveNullAndEmptyArrays: true // Keep particles even if they have no AFE details
                }
            },
            {
                $group: {
                    _id: "$_id",  // Regroup by the volcano number
                    count: { $first: "$count" },  // Preserve the original count
                    volcano_details: { $first: "$volcano_details" },  // Keep the volcano details
                    samples: { $push: "$sample_details" }  // Aggregate all sample details into an array
                }
            }
        ]);

        res.status(200).send(volcanoes);
    } catch (error) {
        res.status(404).send(error.message);
    }
};

/**
 * Adds a new volcano record to the database.
 * @param {Object} req - The request object containing the new volcano data.
 * @param {Object} res - The response object used to send the response.
 */
const add = async (req, res) => {
    try {
        // Create a new volcano instance with the request body
        const newVolcano = new Volcano(req.body);

        // Save the new volcano to the database
        await newVolcano.save();
        
        res.status(200).send('Volcano added successfully');
    } catch (error) {
        res.status(404).send(error.message);
    }
};

/**
 * Updates an existing volcano record in the database.
 * @param {Object} req - The request object containing filter and update data.
 * @param {Object} res - The response object used to send the response.
 */
const update = async (req, res) => {
    const filter = req.body.filter;  // Criteria to find the record
    const update = req.body.update;  // Data to update the record
    const options = {
        new: true,  // Return the updated document
        useFindAndModify: false  // Use native findOneAndUpdate
    };

    try {
        // Find and update the volcano record
        await Volcano.findOneAndUpdate(filter, update, options);
        
        res.status(200).send('Volcano updated successfully');
    } catch (error) {
        res.status(404).send(error.message);
    }
};

/**
 * Deletes a volcano record from the database by its ID.
 * @param {Object} req - The request object containing the volcano ID.
 * @param {Object} res - The response object used to send the response.
 */
const remove = async (req, res) => {
    const { id } = req.params;  // Extract ID from request parameters

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No such volcano');
    }

    try {
        // Find and delete the volcano record by ID
        await Volcano.findByIdAndDelete(id);
        
        res.status(200).send('Volcano deleted successfully');
    } catch (error) {
        res.status(404).send(error.message);
    }
};

/**
 * Retrieves volcano records by their number.
 * @param {Object} req - The request object containing the volcano number as a query parameter.
 * @param {Object} res - The response object used to send the response.
 */
const getVolcNum = async (req, res) => {
    const volc_num = req.query.volc_num;  // Extract volcano number from query parameters

    try {
        // Find volcano records by number
        const volcano = await Volcano.find({ 'volc_num': volc_num });
        
        res.status(200).send(volcano);
    } catch (error) {
        res.status(404).send(error.message);
    }
};

module.exports = {
    get, 
    getTectonicSetting,
    getVolcStd,
    getVolcNum,
    add,
    update,
    remove
};