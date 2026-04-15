/**
 * Defines and exports the subtypes constants.
 * These constants represent the possible subtypes values of particles.
 */
const subtypes = {
    PLAGIOCLASE: "plagioclase",                                             // Plagioclase type
    PYROXENE: "pyroxene",                                                   // Pyroxene type
    AMPHIBOLE: "amphibole",                                                 // Amphibole type
    S_GROUP_MINERAL: "S-group mineral",                                     // S-group mineral type
    OLIVINE: "olivine",                                                     // Olivine type
    OTHERS: "others",                                                       // Others type
    RECYCLED_JUVENILE_PARTICLES: "recycled juvenile particles",             // Recycled juvenile particles type
    HYDROTHERMALLY_ALTERED_JUVENILE: "hydrothermally altered juvenile",     // Hydrothermally altered juvenile type
    STANDARD_JUVENILE: "standard juvenile",                                 // Standard juvenile type
    WEATHERED_MATERIAL: "weathered material",                               // Weathered material type
    HYDROTHERMALLY_ALTERED_MATRIAL: "hydrothermally altered material",      // Hydrothermally altered material type
    STANDARD_LITHIC: "standard lithic",                                     // Standard lithic type
    EMPTY: ""
};

// Export the subtypes constants for use in other modules
module.exports = subtypes;