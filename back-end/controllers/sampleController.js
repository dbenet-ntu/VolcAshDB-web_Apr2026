const { default: mongoose } = require('mongoose');
const { Sample } = require('../models/sample');

/**
 * Retrieves all Sample documents from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const get = async (req, res) => {
    try {
        // Fetch all Sample documents
        const samples = await Sample.aggregate([
            {
                $lookup: {
                    from: 'afes', // Lookup AFE details from the 'afes' collection
                    localField: 'afe_code',
                    foreignField: 'afe_code',
                    as: 'afe_details'
                }
            },
            {
                $unwind: {
                    path: '$afe_details',
                    preserveNullAndEmptyArrays: true // Keep particles even if they have no AFE details
                }
            },
            {
                $addFields: {
                    afe_code: '$afe_details.afe_code',
                    eruptive_style: '$afe_details.eruptive_style',
                    afe_date: '$afe_details.afe_date',
                    afe_dateBP: '$afe_details.afe_dateBP',
                    afe_lat: '$afe_details.afe_lat',
                    afe_lon: '$afe_details.afe_lon',
                }
            },
            {
                $project: {
                    afe_details: 0 // Exclude the original 'afe_details' field from the result
                }
            }
        ]);
        
        res.status(200).send(samples);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

/**
 * Adds or updates an Sample document based on provided data.
 * @param {Object} req - The request object containing the Sample data.
 * @param {Object} res - The response object.
 */
const add = async (req, res) => {
    try {
        // Extract the Sample data from the request body
        const new_sample = req.body;
        // Query to find the document to update or create
        const query = {
            volc_num: new_sample.volc_num,
            ed_num: new_sample.ed_num
        };
        // Options for the update operation
        const options = {
            upsert: true, // Create a new document if none matches the query
            new: true, // Return the modified document rather than the original
            setDefaultsOnInsert: true // Set default values if a new document is created
        };

        // Perform the findOneAndUpdate operation
        await Sample.findOneAndUpdate(query, new_sample, options);

        res.status(200).send('Sample added successfully');
    } catch (error) {
        res.status(404).send(error.message);
    }
};

/**
 * Deletes an Sample document by ID.
 * @param {Object} req - The request object containing the Sample ID.
 * @param {Object} res - The response object.
 */
const remove = async (req, res) => {
    // Extract the ID from the request parameters
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No such Sample');
    }

    try {
        // Delete the Sample document by ID
        await Sample.findByIdAndDelete(id);
        
        res.status(200).send('Sample deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    get,
    add, 
    remove
};