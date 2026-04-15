const mongoose = require('mongoose')
const Schema = mongoose.Schema
const tectonic_settings = require("../enums/tectonic_settings")

/**
 * Volcano Schema: Defines the structure of the 'volcanoes' collection in MongoDB.
 * This schema tracks details of each volcano in the system, following Smithsonian database schema:
 * https://doi.org/10.5479/si.GVP.VOTW5-2025.5.3
 */
const volcanoSchema = new Schema({
    createdAt: {
        type: Date      // Date when the volcano data was imported from GVP
    },
    data_source: {
        type: String    // Source of the volcano data information 'GVP'
    },
    imgURL: {
        type: String    // URL of the volcano image
    },
    tectonic_settings: {
        enum: tectonic_settings,                // Tectonic settings must be a contains in tectonic_settings enum
        type: String,                           // Tectonic settings related to the volcano is of type String
        default: tectonic_settings.UNDEFINED    // Default value is UNDEFINED
    },
    volc_country: {
        type: String    // Country where the volcano is located is of type String
    },
    volc_last_eruption: {
        type: String    // Last known eruption date or period is of type String
    },
    volc_loc: {
        type: String    // Location details of the volcano is of type String
    },
    volc_mcont: {
        type: String    // volc_mcont is of type String
    },
    volc_name: {
        required: true, // Name of the volcano, which is a mandatory field 
        type: String    // Volcano name is of type String
    },
    volc_num: {
        required: true, // Volcano number, which is a mandatory field
        type: Number    // Number or identifier for the volcano is of type Number
    },
    volc_rtype: {
        type: String    // Rock type or volcanic rock type is of type String
    },
    volc_selev: {
        type: String    // Elevation of the volcano is of type String
    },
    volc_slat: {
        required: true, // Latitude of the volcano, which is a mandatory field
        type: String    // Latitude of the volcano is of type String
    },
    volc_slon: {
        required: true, // Longitude of the volcano, which is a mandatory field
        type: String    // Longitude of the volcano is of type String
    },
    volc_status: {
        type: String    // Status of the volcano is of type String
    },
    volc_subreg: {
        type: String    // Subregion where the volcano is located is of type String
    },
    volc_type: {
        type: String    // Type of volcano is of type String
    }
}, {
    collection: 'volcanoes', // Collection name in MongoDB
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create and export the Volcano model using the schema
const Volcano = mongoose.model('Volcano', volcanoSchema);

module.exports = { Volcano };