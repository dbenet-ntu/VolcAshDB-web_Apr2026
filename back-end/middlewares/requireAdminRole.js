const jwt = require('jsonwebtoken');

/**
 * Middleware to ensure the user has an admin role.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
const requireAdminRole = (req, res, next) => {
    // Extract the 'Authorization' header from the request
    const { authorization } = req.headers;

    // Extract the token from the 'Authorization' header
    const token = authorization.split(' ')[1];

    // If no token is provided, respond with a 401 Unauthorized status
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        // Verify the token using the secret key from environment variables
        const decoded = jwt.verify(token, process.env.SECRET); 
        const role = decoded.role; // Extract the role from the decoded token

        // Check if the role includes 'admin'
        if (role.includes('admin')) {
            next(); // User is an admin, proceed to the next middleware
        } else {
            // Respond with a 403 Forbidden status if the user is not an admin
            res.status(403).send('Access denied. Admins only.');
        }
    } catch {
        // Respond with a 400 Bad Request status if the token is invalid
        res.status(400).send('Invalid token.');
    }
};

module.exports = requireAdminRole;