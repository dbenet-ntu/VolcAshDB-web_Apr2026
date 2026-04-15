const axios = require('axios');
const keycloakConfig = require('../config/keycloak');
const { User } = require('../models/user');


/**
 * Logs in a user by validating email and password, and then creates a JWT token.
 * @param {Object} req - The request object containing the email and password.
 * @param {Object} res - The response object used to send the response.
 */
const getToken = async (req, res) => {
    try {
        const { code, pkceCodeVerifier } = req.body;

        const tokenResponse = await axios.post(`${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`, 
            new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: keycloakConfig.clientId,
                client_secret: keycloakConfig.clientSecret,
                code: code,
                code_verifier: pkceCodeVerifier,
                redirect_uri: 'https://volcashdb.ipgp.fr/login'
            }), 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const userInfoResponse = await axios.post(`${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/userinfo`, 
            new URLSearchParams({
                client_id: keycloakConfig.clientId,
                client_secret: keycloakConfig.clientSecret,
                access_token: tokenResponse.data.access_token,
            })
        );
        

        const token = await User.createToken(tokenResponse.data.refresh_token, userInfoResponse.data.roles[0]);

        res.status(200).send({
            email: userInfoResponse.data.email,
            token
        });

    } catch (err) {
        console.log(err)
        res.status(500).send('Failed to exchange code for token');
    }
};

module.exports = {
    getToken
};