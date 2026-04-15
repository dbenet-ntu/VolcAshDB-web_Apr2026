const { Request } = require('../models/request');
const { User } = require('../models/user');
const formidable = require('formidable')

/**
 * Middleware to log incoming requests to the 'Request' collection.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const logRequest = async (req, res, next) => {
    try {
        let sessionId;
        let requestType = req.method; // HTTP method of the request (GET, POST, etc.)
        let requestUrl = req.url; // URL of the request

        // Skip parsing for routes that use multer (multer will handle the parsing)
        const fullUrl = req.originalUrl || req.url;
        const multerRoutes = ['/preprocessing/upload', '/ood/analyze', '/classify'];
        if (multerRoutes.some(route => fullUrl.includes(route))) {
            console.log(`[logRequest] Skipping for multer route: ${fullUrl}`);
            return next();
        }

        // If the request is multipart/form-data
        if (req.method === 'POST' && req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
            const form = new formidable.IncomingForm();
            
            // Adjust file size limit based on route
            // Preprocessing workflow needs 3 GB for large TIFF files
            // Other routes (classification) need 1 GB
            const isPreprocessingRoute = fullUrl.includes('/preprocessing');
            const maxFileSize = isPreprocessingRoute ? 3 * 1024 * 1024 * 1024 : 1000 * 1024 * 1024;
            
            console.log(`[logRequest] Route: ${fullUrl}, isPreprocessing: ${isPreprocessingRoute}, maxFileSize: ${maxFileSize / 1024 / 1024} MB`);
            
            form.options.maxTotalFileSize = maxFileSize;
            form.options.maxFileSize = maxFileSize;

            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.log(err)
                    return res.status(500).send('Failed to parse form data');
                }

                // Extract sessionId from the form fields
                sessionId = fields.sessionId ? fields.sessionId[0] : null;

                // Create request data for logging
                const requestData = {
                    sessionId,
                    requestType,
                    requestUrl
                };

                // Save request data to the 'Request' collection
                await Request.create(requestData);

                req.file = files;
                req.email = fields.email ? fields.email[0] : null;

                // Ensure next() is called after parsing is complete
                next();
            });
        } else if (req.method === 'POST' && req.headers['content-type'].includes('application/json')) {
            // For JSON requests, we can access req.body directly
            sessionId = req.body.sessionId;

            const requestData = {
                sessionId,
                requestType,
                requestUrl
            };

            // Save request data to the 'Request' collection
            await Request.create(requestData);

            next();

        } else {
            next();
        }
                
    } catch {
        res.status(500).send('Failed to log request');
    }
};

/**
 * Retrieves the total number of users from the 'User' collection.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getTotalUsers = async (req, res) => {
    try {
        const userCount = await User.countDocuments(); // Count the total number of user documents
        res.status(200).send([userCount]);
    } catch {
        res.status(500).send('Failed to fetch total users');
    }
};

/**
 * Retrieves the number of requests per day.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getRequestsPerDay = async (req, res) => {
    try {
        const requestsPerDay = await Request.aggregate([
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
                    count: { $sum: 1 } // Count requests per day
                }
            },
            { $sort: { _id: 1 } } // Sort by date
        ]);

        res.status(200).send(requestsPerDay);
    } catch {
        res.status(500).send('Failed to fetch requests per day');
    }
};

/**
 * Retrieves the number of unique users per day based on session IDs.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getUsersPerDay = async (req, res) => {
    try {
        const usersPerDay = await Request.aggregate([
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
                    sessions: { $addToSet: "$sessionId" } // Collect unique session IDs per day
                }
            },
            {
                $project: {
                    _id: 1,
                    count: { $size: "$sessions" } // Count the number of unique sessions per day
                }
            }
        ]);
        
        res.status(200).send(usersPerDay);
    } catch {
        res.status(500).send('Failed to fetch users per day');
    }
};

module.exports = { logRequest, getTotalUsers, getRequestsPerDay, getUsersPerDay };
