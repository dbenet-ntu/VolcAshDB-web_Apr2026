const { default: mongoose } = require('mongoose');
const { Particle } = require('../models/particle');
const { AFE } = require('../models/afe');

/**
 * Retrieves particles excluding those with faulty images and includes AFE and volcano details.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const get = async (req, res) => {
    try {
        const { displayNaturalData } = req.body;

        const display_natural = displayNaturalData === true;

        const particles = await Particle.aggregate([
            {
                $match: {
                    faulty_image: { $ne: true } // Exclude particles with faulty images
                }
            },
            {
                $lookup: {
                    from: 'samples',
                    localField: 'sample_code',
                    foreignField: 'sample_code',
                    as: 'sample_details'
                }
            },
            {
                $unwind: {
                    path: '$sample_details',
                    preserveNullAndEmptyArrays: true // Keep particles even if they have no AFE details
                }
            },
            {
                $addFields: {
                    sample_code: '$sample_details.sample_code',
                    sample_date: '$sample_details.sample_date',
                    sample_nat: '$sample_details.sample_nat',
                    afe_code: '$sample_details.afe_code',
                    sample_lat: '$sample_details.sample_lat',
                    sample_lon: '$sample_details.sample_lon',
                    temperature_lower_bound: '$sample_details.temperature_lower_bound',
                    temperature_upper_bound: '$sample_details.temperature_upper_bound',
                    oxygen_fugacity: '$sample_details.oxygen_fugacity',
                    experiment_duration: '$sample_details.experiment_duration',
                    sample_techn: '$sample_details.sample_techn',
                    sample_surf: '$sample_details.sample_surf',
                    sample_collector: '$sample_details.sample_collector',
                    lab_procedure: '$sample_details.lab_procedure',
                }
            },
            {
                $project: {
                    sample_details: 0 // Exclude the original 'afe_details' field from the result
                }
            },
            {
                $match: {
                    sample_nat: display_natural // Exclude the original 'afe_details' field from the result
                }
            },
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
            },
            {
                $lookup: {
                    from: 'volcanos', // Lookup volcano details from the 'volcanos' collection
                    localField: 'volc_num',
                    foreignField: 'volc_num',
                    as: 'volc_details'
                }
            },
            {
                $unwind: {
                    path: '$volc_details',
                    preserveNullAndEmptyArrays: true // Keep particles even if they have no volcano details
                }
            },
            {
                $addFields: {
                    tectonic_settings: '$volc_details.tectonic_settings',
                    volc_lat: '$volc_details.volc_slat',
                    volc_lon: '$volc_details.volc_slon'
                }
            },
            {
                $project: {
                    volc_details: 0 // Exclude the original 'volc_details' field from the result
                }
            }
        ]);

        res.status(200).send(particles);
    } catch (error) {
        res.status(404).send(error.message);
    }
};

/**
 * Retrieves distinct tag values from both particles and AFE documents.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getTags = async (req, res) => {
    try {
        const tags = {};

        // Define fields of interest for tags
        const fields = [
            'tectonicSetting', 'volcanoName', 'eruptions', 'eruptiveStyle', 'grainSize', 
            'mainType', 'shape', 'crystallinity', 'color', 
            'hydroAlterDegree', 'juvenileType', 'lithicType', 
            'alteredMaterialType', 'freeCrystalType'
        ];

        // Function to get distinct values from a collection and field
        const getDistinctValues = async (model, field) => {
            const values = await model.distinct(field);
            return values;
        };

        // Process particles collection
        const particleFields = {
            tectonicSetting: 'tectonic_settings',
            volcanoName: 'volcano_name',
            eruptiveStyle: 'eruptive_style',
            grainSize: 'grain_size',
            mainType: 'main_type',
            shape: 'shape',
            crystallinity: 'crystallinity',
            color: 'color',
            hydroAlterDegree: 'hydro_alter_degree',
            juvenileType: 'juvenile_type',
            lithicType: 'lithic_type',
            alteredMaterialType: 'altered_material_type',
            freeCrystalType: 'free_crystal_type'
        };

        for (const [key, field] of Object.entries(particleFields)) {
            const choices = await getDistinctValues(Particle, field);
            tags[key] = {
                id: fields.indexOf(key) + 1,
                oriTag: key.replace(/([A-Z])/g, ' $1').trim(), // Format tag name for display
                choices
            };
        }

        // Process AFE collection
        const afesFields = {
            eruptiveStyle: 'eruptive_style',
            grainSize: 'grain_size',
            mainType: 'main_type',
            shape: 'shape',
            crystallinity: 'crystallinity',
            color: 'color',
            hydroAlterDegree: 'hydro_alter_degree',
            juvenileType: 'juvenile_type',
            lithicType: 'lithic_type',
            alteredMaterialType: 'altered_material_type',
            freeCrystalType: 'free_crystal_type'
        };

        for (const [key, field] of Object.entries(afesFields)) {
            const choices = await getDistinctValues(AFE, field);
            if (!tags[key]) {
                tags[key] = {
                    id: fields.indexOf(key) + 1,
                    oriTag: key.replace(/([A-Z])/g, ' $1').trim(), // Format tag name for display
                    choices
                };
            } else {
                // Merge choices from both particles and AFE collections
                tags[key].choices = [...new Set([...tags[key].choices, ...choices])];
            }
        }

        res.status(200).send(tags);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

/**
 * Retrieves specific example particles based on image URLs.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getExamples = async (req, res) => {
    try {
        const particles = await Particle.aggregate([
            {
                $match: {
                    imgURL: {
                        $in: [
                            "CIN-11-DB15_1_01_1_153_mf_5x_phi1phi2_JJbllchv.png",
                            "CIN-11-DB15_1_01_1_111_mf_5x_phi1phi2_AHh.png",
                            "ST-00-EXP_1_1_1_2_VHX_200_unsieved.png",
                            "ET-15-EXP_1_2_1_49_VHX_200_unsieved.png",
                            "ONT-10-DB1_1_03_1_27_mf_4x_phi0phi1_AHh.png",
                            "CIN-11-DB2_1_01_2_5_mf_5x_phi0phi1_LLtrmcn.png",
                            "CIN-11-DB2_1_01_2_104_mf_5x_phi0phi1_PG.png",
                            "CIN-11-DB2_1_01_2_57_mf_5x_phi0phi1_PX.png",
                            "MEA-22post-DB2_1_01_2_90_mf_5x_phi0phi1_AHh.png",
                        ]
                    }
                },
            },
            {
                $lookup: {
                    from: 'samples', // Lookup AFE details from the 'afes' collection
                    localField: 'sample_code',
                    foreignField: 'sample_code',
                    as: 'sample_details'
                }
            },
            {
                $unwind: {
                    path: '$sample_details',
                    preserveNullAndEmptyArrays: true // Keep particles even if they have no AFE details
                }
            },
            {
                $addFields: {
                    sample_date: '$sample_details.sample_date',
                    sample_nat: '$sample_details.sample_nat',
                    afe_code: '$sample_details.afe_code',
                    sample_lat: '$sample_details.sample_lat',
                    sample_lon: '$sample_details.sample_lon',
                    temperature_lower_bound: '$sample_details.temperature_lower_bound',
                    temperature_upper_bound: '$sample_details.temperature_upper_bound',
                    oxygen_fugacity: '$sample_details.oxygen_fugacity',
                    experiment_duration: '$sample_details.experiment_duration',
                    sample_techn: '$sample_details.sample_techn',
                    sample_surf: '$sample_details.sample_surf',
                    sample_collector: '$sample_details.sample_collector',
                    lab_procedure: '$sample_details.lab_procedure',
                }
            },
            {
                $project: {
                    sample_details: 0 // Exclude the original 'afe_details' field from the result
                }
            }
        ]);

        res.status(200).send(particles);
    } catch (error) {
        res.status(404).send(error.message);
    }
};

/**
 * Retrieves the total number of particles in the collection.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getTotalParticles = async (req, res) => {
    try {
        const particles = await Particle.aggregate([
            {
                $match: {
                    faulty_image: { $ne: true } // Exclude particles with faulty images
                }
            },
            {
                $count: 'totalParticles'
            }
        ]);

        res.status(200).send(particles);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

/**
 * Adds a new particle document to the collection.
 * @param {Object} req - The request object containing the new particle data.
 * @param {Object} res - The response object.
 */
const add = async (req, res) => {
    try {
        const newParticle_ = new Particle(req.body);
        
        await newParticle_.save();
        
        res.status(200).send('Particle added successfully');
    } catch (error) {
        res.status(404).send(error.message);
    }
};

/**
 * Removes a particle document by ID.
 * @param {Object} req - The request object containing the particle ID in the parameters.
 * @param {Object} res - The response object.
 */
const remove = async (req, res) => {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No such particle');
    }

    try {
        await Particle.findByIdAndDelete(id);
        
        res.status(200).send('Particle deleted successfully');
    } catch (error) {
        res.status(404).send(error.message);
    }
};

/**
 * Updates a particle document based on a filter and update criteria.
 * @param {Object} req - The request object containing filter and update data.
 * @param {Object} res - The response object.
 */
const update = async (req, res) => {
    try {
        const { filter, update } = req.body;
        const options = {
            upsert: true, // Create a new document if no document matches the filter
            new: true, // Return the modified document
            setDefaultsOnInsert: true // Set default values for fields on insert
        };

        await Particle.findOneAndUpdate(filter, update, options);
        
        res.status(200).send('Particle updated successfully');
    } catch (error) {
        res.status(404).send(error.message);
    }
};

module.exports = {
    get,
    getTags,
    getExamples,
    getTotalParticles,
    add,
    remove,
    update
};