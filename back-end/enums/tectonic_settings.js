/**
 * Defines and exports the tectonic_settings constants.
 * These constants represent the possible tectonic_settings values of volcano.
 */
const tectonic_settings = {
    INTRAPLATE_CONTINENTAL_CRUST: "Intraplate / Continental crust (>25 km)",
    INTRAPLATE_INTERMEDIATE_CRUST: "Intraplate / Intermediate crust (15-25 km)",
    INTRAPLATE_OCEANIC_CRUST: "Intraplate / Oceanic crust (< 15 km)",
    RIFT_CONTINENTAL_CRUST: "Rift zone / Continental crust (>25 km)",
    RIFT_INTERMEDIATE_CRUST: "Rift zone / Intermediate crust (15-25 km)",
    RIFT_OCEANIC_CRUST: "Rift zone / Oceanic crust (< 15 km)",
    SUBDUCTION_CONTINENTAL_CRUST: "Subduction zone / Continental crust (>25 km)",
    SUBDUCTION_UNKNOWN_CRUST: "Subduction zone / Crustal thickness unknown",
    SUBDUCTION_INTERMEDIATE_CRUST: "Subduction zone / Intermediate crust (15-25 km)",
    SUBDUCTION_OCEANIC_CRUST: "Subduction zone / Oceanic crust (< 15 km)",
    UNDEFINED: null
};

// Export the tectonic_settings constants for use in other modules
module.exports = tectonic_settings;