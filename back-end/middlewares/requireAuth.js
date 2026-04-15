const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User } = require('../models/user');
const keycloakConfig = require('../config/keycloak');
const mongoose = require('mongoose');

/**
 * Middleware to ensure that the request is authenticated.
 * Handles both native users and Keycloak SSO users.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
const requireAuth = async (req, res, next) => {
    // Extract the 'Authorization' header from the request
    const { authorization } = req.headers;

    // If 'Authorization' header is missing, respond with a 401 Unauthorized status
    if (!authorization) {
        return res.status(401).send('Authorization token required');
    }

    // Extract the token from the 'Authorization' header
    const token = authorization.split(" ")[1];
    
    try {
        // Native JWT token verification
        const { _id } = jwt.verify(token, process.env.SECRET);

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            const user = await verifyKeycloakToken(_id, res);

            if (!user) {
                return; // Prevent calling next() if user is not found
            }
        } else {
        
            // Find the user in your native database and attach the user object to the request
            req.user = await User.findOne({ _id }).select('_id');
            if (!req.user) {
                return res.status(401).send('User not found in native database');
            }
        }
        
        return next();
        
    } catch {
        // Respond with a 401 Unauthorized status if token verification fails
        return res.status(401).send('Request is not authorized');
    }
};

/**
 * Verify the Keycloak token by introspecting it using Keycloak's token introspection endpoint.
 * 
 * @param {string} token - The Keycloak token to be verified.
 * @returns {Object} - The response from Keycloak's introspection endpoint.
 */
const verifyKeycloakToken = async (refresh_token, res) => {
    try {
        
        const refreshTokenResponse = await axios.post(`${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`, 
            new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: keycloakConfig.clientId,
                client_secret: keycloakConfig.clientSecret,
                refresh_token: refresh_token,
            })
        );

        return !(!refreshTokenResponse.data);
        
    } catch (error) {
        if (error.response?.data?.error_description === "Refresh token expired") {
            res.status(401).send('Your session has expired. Please log in again to continue.');
        } else {
            res.status(401).send(error.response?.data?.error_description || 'An error occurred');
        }
        return null; // Ensure null is returned to indicate failure
    }
};

module.exports = requireAuth;