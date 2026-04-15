/**
 * Defines and exports the oxygen fugacity constants.
 * These constants represent the possible oxygen fugacity values.
 */
const oxygen_fugacity = {
    LOW: 'low',     // Represents an active status
    HIGH: 'high',   // Represents an inactive status
    UNDEFINED: null    
};

// Export the status constants for use in other modules
module.exports = oxygen_fugacity;
