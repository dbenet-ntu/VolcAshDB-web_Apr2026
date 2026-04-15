const { default: mongoose } = require('mongoose');
const { AFE } = require('../models/afe');

/**
 * Retrieves all AFE documents from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const get = async (req, res) => {
    try {
        // Fetch all AFE documents
        const afes = await AFE.find();
        
        res.status(200).send(afes);
    } catch (error) {
        res.status(404).send(error.message);
    }
};

/**
 * Adds or updates an AFE document based on provided data.
 * @param {Object} req - The request object containing the AFE data.
 * @param {Object} res - The response object.
 */
const add = async (req, res) => {
    try {
        // Extract the AFE data from the request body
        const newAFE = req.body;
        // Query to find the document to update or create
        const query = {
            volc_num: newAFE.volc_num,
            ed_num: newAFE.ed_num
        };
        // Options for the update operation
        const options = {
            upsert: true, // Create a new document if none matches the query
            new: true, // Return the modified document rather than the original
            setDefaultsOnInsert: true // Set default values if a new document is created
        };

        // Perform the findOneAndUpdate operation
        await AFE.findOneAndUpdate(query, newAFE, options);

        res.status(200).send('AFE added successfully');
    } catch (error) {
        res.status(404).send(error.message);
    }
};

/**
 * Deletes an AFE document by ID.
 * @param {Object} req - The request object containing the AFE ID.
 * @param {Object} res - The response object.
 */
const remove = async (req, res) => {
    // Extract the ID from the request parameters
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No such AFE');
    }

    try {
        // Delete the AFE document by ID
        await AFE.findByIdAndDelete(id);
        
        res.status(200).send('AFE deleted successfully');
    } catch (error) {
        res.status(404).send(error.message);
    }
};

/**
 * Retrieves AFE documents based on a volcano name.
 * @param {Object} req - The request object containing the volcano name query.
 * @param {Object} res - The response object.
 */
const getVolcano = async (req, res) => {
    // Extract the volcano name from the query parameters
    const volc_name = req.query.volcano;

    try {
        // Aggregate AFE documents with a lookup to the volcanos collection
        const afes = await AFE.aggregate([
            {
                $lookup: {
                    from: "volcanoes", // Collection to join with
                    localField: "volc_num", // Field from AFE
                    foreignField: "volc_num", // Field from volcanos
                    as: "volcano_details" // Output array field
                }
            },
            {
                $match: {
                    "volcano_details.volc_name": volc_name // Filter based on the volcano name
                }
            }
        ]);
        
        res.status(200).send(afes);
    } catch (error) {
        res.status(404).send(error.message);
    }
};

module.exports = {
    get,
    add, 
    remove,
    getVolcano
};