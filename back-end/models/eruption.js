const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Eruption Schema: Defines the structure of the 'eruptions' collection in MongoDB.
 * This schema tracks details of each eruption in the system, following Smithsonian database schema:
 * - https://doi.org/10.5479/si.GVP.VOTW5-2024.5.2
 */
const eruptionSchema = new Schema({
    createdAt: {
        type: Date          // Date when the volcano data was imported from GVP
    },
    data_source: {
        required: true,     // data_source is a required field
        type: String        // Source of the volcano data information 'GVP'
    },
    ed_area: {
        type: String        // Area where the eruption occurred
    },
    ed_category: {
        type: String        // Category of the eruption
    },
    ed_endday: {
        type: String        // End day of the eruption
    },
    ed_endday_mod: {
        type: String        // Modified end day of the eruption
    },
    ed_endday_unc: {
        type: String        // Uncertainty in end day of the eruption
    },
    ed_endmonth: {
        type: String        // End month of the eruption
    },
    ed_endyear: {
        type: String        // End year of the eruption
    },
    ed_endyear_mod: {
        type: String        // Modified end year of the eruption
    },
    ed_endyear_unc: {
        type: String        // Uncertainty in end year of the eruption
    },
    ed_etime: {
        type: Date          // Exact time of the eruption
    },
    ed_evidence: {
        type: String        // Evidence supporting the eruption data
    },
    ed_latitude: {
        type: Number        // Latitude of the eruption location
    },
    ed_longitude: {
        type: Number        // Longitude of the eruption location
    },
    ed_num: {
        required: true,     // ed_num is a required field
        type: Number        // Number or identifier for the eruption
    },
    ed_startday: {
        type: String        // Start day of the eruption
    },
    ed_startday_mod: {
        type: String        // Modified start day of the eruption
    },
    ed_startday_unc: {
        type: String        // Uncertainty in start day of the eruption
    },
    ed_startmonth: {
        type: String        // Start month of the eruption
    },
    ed_startyear: {
        required: true,     // ed_startyear is a required field
        type: String        // Start year of the eruption
    },
    ed_startyear_mod: {
        type: String        // Modified start year of the eruption
    },
    ed_startyear_unc: {
        type: String        // Uncertainty in start year of the eruption
    },
    ed_stime: {
        type: Date          // Exact time when the eruption started
    },
    ed_VEI: {
        type: Number        // Volcanic Explosivity Index (VEI) for the eruption
    },
    ed_VEI_mod: {
        type: String        // Modified VEI for the eruption
    },
    volc_name: {
        required: true,     // volc_name is a required field
        type: String        // Name of the volcano
    },
    volc_num: {
        required: true,     // volc_num is a required field
        type: Number        // Number identifying the volcano
    }
}, {
    collection: 'eruptions', // Collection name in MongoDB
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create and export the Eruption model using the schema
const Eruption = mongoose.model("Eruption", eruptionSchema);

module.exports = { Eruption };
