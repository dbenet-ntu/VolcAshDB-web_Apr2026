const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const labProcedure = require("../enums/labProcedure");
const oxygen_fugacity = require("../enums/oxygen_fugacity")

/**
 * Particle Schema: Defines the structure of the 'particles' collection in MongoDB.
 * This schema contains various properties representing physical, chemical, and visual characteristics of particles.
 */
const sampleSchema = new Schema({
    sample_code: {
        required: true,             // sample_code is a required field
        type: String                // sample_code is of type String
    },
    sample_date: {
        type: Date                  // sample_date is of type Date
    },
    sample_lat: {
        required: true,             // sample_lat (latitude) is a required field
        type: String                // sample_lat (latitude) is of type String
    },
    sample_lon: {
        required: true,             // sample_lon (longitude) is a required field
        type: String                // sample_lon (longitude) is of type String
    },
    sample_nat: {
        required: true,             // sample_nat is a required field
        type: Boolean               // Indicates if the sample is natural or experimental
    },
    afe_code: {
        type: String                // afe_code is of type String
    },
    volc_name: {
        required: true,             // volc_name is a required field
        type: String                // volc_name is of type String
    },
    volc_num: {
        required: true,             // volc_num is a required field
        type: Number                // volc_num is of type Number
    },
    sample_techn: {
        type: String                // sample_techn is of type String (optional)
    },
    sample_surf: {
        type: String                // sample_surf is of type String (optional)
    },
    sample_collector: {
        type: String                // sample_collector is of type String (optional)
    },
    lab_procedure: {
        type: [String],             // lab_procedure is an array of type String
        enum: labProcedure          // Restricts values to those defined in the labProcedureEnum
    },
    temperature_lower_bound: {
        type: Number                // temperature_lower_bound is of type Number
    },
    temperature_upper_bound: {
        type: Number                // temperature_upper_bound is of type Number
    },
    oxygen_fugacity: {
        enum: oxygen_fugacity,      // oxygen_fugacity must be either 'low', 'high' or 'none'
        type: String,               // oxygen_fugacity is of type String
        default: oxygen_fugacity.UNDEFINED
    },
    experiment_duration: {
        type: Number                // experiment_duration is of type Number
    }
}, {
	collection: 'samples',          // Name of the collection in MongoDB
	timestamps: true                // Automatically adds createdAt and updatedAt fields
});

// Create and export the Particle model based on the schema
const Sample = mongoose.model('Sample', sampleSchema);

module.exports = { Sample };