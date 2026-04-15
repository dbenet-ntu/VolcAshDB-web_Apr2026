/**
 * Defines and exports the possible labProcedure values.
 * These constants represent the allowed labProcedure options.
 */
const labProcedure = {
    UNDEFINED: null,          // Undefined or no value
    CLEANING: 'cleaning',   // cleaning type
    SIEVING: 'sieving',     // sieving type
    LEACHING: 'leaching',   // leaching type
};

// Export the labProcedure constants for use in other modules
module.exports = labProcedure;
