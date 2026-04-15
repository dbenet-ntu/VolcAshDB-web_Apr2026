const { default: mongoose } = require('mongoose');
const { Opinion } = require('../models/opinion');
const { Particle } = require('../models/particle');

/**
 * Retrieves all opinions for a given user and their associated particle details.
 * @param {Object} req - The request object containing the userId in the body.
 * @param {Object} res - The response object.
 */
const get = async (req, res) => {
    try {
        const { userId, displayNaturalData } = req.body;

        const display_natural = displayNaturalData === true;

        if (mongoose.Types.ObjectId.isValid(userId)) {

            // Find all opinions for the given userId
            const opinions = await Opinion.find({ userId: userId });

            if (opinions.length > 0) {
                // Extract particle IDs from the opinions
                const particleIds = opinions.map(opinion => opinion.particleId);

                // Aggregate particle details based on the particle IDs
                const particles = await Particle.aggregate([
                    { $match: { _id: { $in: particleIds } } },
                    {
                        $lookup: {
                            from: "opinions",
                            localField: "_id",
                            foreignField: "particleId",
                            as: "opinions"
                        }
                    },
                    {
                        $project: {
                            main_type: {
                                $cond: {
                                    if: { $isArray: "$opinions" },
                                    then: {
                                        $cond: {
                                            if: { $eq: [{ $size: "$opinions" }, 0] },
                                            then: "$main_type",
                                            else: { $arrayElemAt: ["$opinions.main_type", 0] }
                                        }
                                    },
                                    else: "$main_type"
                                }
                            },
                            asm: 1, 
                            aspect_rat: 1, 
                            blue_mean: 1, 
                            blue_std: 1, 
                            blue_mode: 1, 
                            circ_elon: 1,
                            circ_rect: 1, 
                            circularity_cioni: 1,
                            circularity_dellino: 1,
                            color: 1,
                            comp_elon: 1, 
                            compactness: 1, 
                            contrast: 1, 
                            convexity: 1, 
                            correlation: 1, 
                            crystallinity: 1,
                            dissimilarity: 1, 
                            eccentricity_ellipse: 1,
                            eccentricity_moments: 1, 
                            elongation: 1, 
                            energy: 1, 
                            faulty_image: 1,
                            green_mean: 1, 
                            green_mode: 1, 
                            green_std: 1, 
                            gsLow: 1,
                            gsUp: 1,
                            homogeneity: 1, 
                            hue_mean: 1,
                            hue_mode: 1,
                            hue_std: 1,
                            hydro_alter_degree: 1, 
                            id: 1, 
                            imgURL: 1,
                            instrument: 1,
                            luster: 1,
                            magnification: 1,
                            multi_focus: 1,
                            rect_comp: 1, 
                            rectangularity: 1, 
                            red_mean: 1, 
                            red_mode: 1,
                            red_std: 1, 
                            requiresDetailedAnnotation: 1,
                            roundness: 1, 
                            sample_code: 1,
                            saturation_mean: 1,
                            saturation_mode: 1,
                            saturation_std: 1,
                            shape: 1,
                            solidity: 1, 
                            sub_type: 1,
                            type: 1,
                            value_mean: 1,
                            value_mode: 1,
                            value_std: 1,
                            volc_name: 1,
                            volc_num: 1, 
                            weathering_sign: 1
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
                            preserveNullAndEmptyArrays: true
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
                            afe_details: 0 // Exclude the afe_details field from the final result
                        }
                    },
                    {
                        $match: {
                            sample_nat: display_natural
                        }
                    },
                    {
                        $lookup: {
                            from: 'afes',
                            localField: 'afe_code',
                            foreignField: 'afe_code',
                            as: 'afe_details'
                        }
                    },
                    {
                        $unwind: {
                            path: '$afe_details',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $addFields: {
                            eruptive_style: '$afe_details.eruptive_style'
                        }
                    },
                    {
                        $project: {
                            afe_details: 0 // Exclude the afe_details field from the final result
                        }
                    }
                ]);

                res.status(200).json({ success: true, opinions, particles });
            } else {
                res.status(200).json({ success: false, opinions });
            }
        } else {
            res.status(200).json({ success: false, error: "User connected by SSO don't have opinions" });
        }
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

/**
 * Retrieves the distribution of annotations for a specific particle.
 * @param {Object} req - The request object containing the particleId in the body.
 * @param {Object} res - The response object.
 */
const getAnnotationDistribution = async (req, res) => {
    const { particleId } = req.body;

    try {
        // Aggregate the distribution of opinions for a specific particle
        const distribution = await Opinion.aggregate([
            {
                $match: { particleId: mongoose.Types.ObjectId(particleId) }
            },
            {
                $lookup: {
                    from: "particles",
                    localField: "particleId",
                    foreignField: "_id",
                    as: "particle_info"
                }
            },
            {
                $unwind: {
                    path: "$particle_info",
                }
            },
            {
                $project: {
                    particleId: 1,
                    opinion_main_type: "$main_type",
                    particle_main_type: "$particle_info.main_type"
                }
            },
            {
                $group: {
                    _id: "$particleId",
                    opinion_main_type_counts: { $push: "$opinion_main_type" },
                    particle_main_type_counts: { $push: "$particle_main_type" }
                }
            },
            {
                $addFields: {
                    particle_main_type_counts: { $arrayElemAt: ["$particle_main_type_counts", 0] }
                }
            },
            {
                $project: {
                    particleId: 1,
                    main_type: {
                        $concatArrays: [
                            "$opinion_main_type_counts",
                            ["$particle_main_type_counts"]
                        ]
                    }
                }
            },
            {
                $unwind: {
                    path: "$main_type",
                }
            },
            {
                $project: {
                    main_type: { $objectToArray: "$main_type" }
                }
            },
            {
                $unwind: {
                    path: "$main_type",
                }
            },
            {
                $group: {
                    _id: { particleId: "$_id", key: "$main_type.k" },
                    averageValue: { $avg: "$main_type.v" }
                }
            },
            {
                $group: {
                    _id: "$_id.particleId",
                    main_type: {
                        $push: {
                            k: "$_id.key",
                            v: "$averageValue"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    main_type: {
                        $arrayToObject: "$main_type"
                    }
                }
            }
        ]);

        res.status(200).json({ success: true, distribution });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

/**
 * Adds or updates an opinion document.
 * @param {Object} req - The request object containing the opinion details in the body.
 * @param {Object} res - The response object.
 */
const add = async (req, res) => {
    const {
        userId, 
        particleId, 
        opinion, 
        comments,
        color,
        luster,
        edge,
        shape,
        crystallinity,
        hydro_alter_degree,
        weathering_sign
    } = req.body;

    try {
        // Add or update the opinion using the static method from the Opinion model
        await Opinion.addOpinion(
            userId, 
            particleId, 
            opinion, 
            comments,
            color,
            luster,
            edge,
            shape,
            crystallinity,
            hydro_alter_degree,
            weathering_sign
        );
        
        res.status(200).json({ success: true, message: 'Opinion added successfully' });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

/**
 * Removes an opinion document by ID.
 * @param {Object} req - The request object containing the opinion ID in the parameters.
 * @param {Object} res - The response object.
 */
const remove = async (req, res) => {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, error: 'No such opinion' });
    }

    try {
        // Delete the opinion document by ID
        await Opinion.findByIdAndDelete(id);
        
        res.status(200).json({ success: true, message: 'Opinion deleted successfully' });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

module.exports = {
    get,
    getAnnotationDistribution,
    add,
    remove
};