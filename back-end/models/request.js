const mongoose = require('mongoose');

const Schema = mongoose.Schema

/**
 * Request Schema: Defines the structure of the 'requests' collection in MongoDB.
 * This schema tracks details of each request made in the system.
 */
const requestSchema = new Schema({
    sessionId: {
        type: String,           // Session ID to identify the session where the request originated
        required: false,
        default: 'anonymous'
    },
    requestType: {
        type: String,           // Type of request (e.g., GET, POST, etc.)
        required: true          // requestType is a required field
    },
    requestUrl: {
        type: String,           // URL of the request made
        required: true          // requestUrl is a required field
    }
}, {
    collection: 'requests',     // Name of the collection in MongoDB
    timestamps: true            // Automatically creates 'createdAt' and 'updatedAt' fields
});

// Export the model so it can be used in other parts of the application
const Request = mongoose.model('Request', requestSchema);

module.exports = { Request };
