const router = require('express').Router();

const { 
    getToken, 
} = require('../controllers/ssoController');

// Public routes

/**
 * @route POST /get_token
 * @description This route is used to get the access token from the Keycloak server using the authorization code.
 * @access Public
 */
router.post('/get_token', getToken);

module.exports = router;