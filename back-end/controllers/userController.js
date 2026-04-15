const { User } = require('../models/user');

/**
 * Logs in a user by validating email and password, and then creates a JWT token.
 * @param {Object} req - The request object containing the email and password.
 * @param {Object} res - The response object used to send the response.
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Authenticate user
        const user = await User.login(email, password);

        // Generate a JWT token
        const token = await User.createToken(user._id, user.role);

        res.status(200).send({
            email,
            token,
            country: user.country,
            institute: user.institute
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

/**
 * Signs up a new user by creating a new record and then generating a JWT token.
 * @param {Object} req - The request object containing user details.
 * @param {Object} res - The response object used to send the response.
 */
const signupUser = async (req, res) => {
    try {
        const { email, password, confirmpassword, country, institute } = req.body;

        // Register new user
        const user = await User.signup(email, password, confirmpassword, country, institute);

        // Generate a JWT token
        const token = await User.createToken(user._id, user.role);

        res.status(200).send({
            email,
            token,
            country: user.country,
            institute: user.institute,
            status: user.status
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

/**
 * Verifies a user's email with the provided verification code.
 * @param {Object} req - The request object containing email and verification code.
 * @param {Object} res - The response object used to send the response.
 */
const verifyUser = async (req, res) => {
    try {
        const { email, code } = req.body;

        // Verify the provided code
        await User.verifyCode(email, code);

        res.sendStatus(200);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

/**
 * Updates user details based on the provided email and update fields.
 * @param {Object} req - The request object containing email and update fields.
 * @param {Object} res - The response object used to send the response.
 */
const update = async (req, res) => {
    try {
        const { email, ...updateFields } = req.body;

        // Find and update user by email
        await User.findOneAndUpdate({ email }, updateFields);

        res.status(200).send('User updated successfully');
    } catch (error) {
        res.status(404).send(error.message);
    }
};

/**
 * Retrieves the email and role of all users.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send the response.
 */
const getRoles = async (req, res) => {
    try {
        // Fetch users' emails and roles
        const users = await User.find({}, { email: 1, role: 1, _id: 0 });

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

/**
 * Handles password reset requests by sending a reset email to the user.
 * @param {Object} req - The request object containing the user's email.
 * @param {Object} res - The response object used to send the response.
 */
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Process password reset request
        await User.forgetPassword(email);

        res.status(200).send('Email sent');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

/**
 * Resets a user's password based on the provided user ID and new passwords.
 * @param {Object} req - The request object containing user ID and new passwords.
 * @param {Object} res - The response object used to send the response.
 */
const resetPassword = async (req, res) => {
    try {
        const userId = req.user; // Extract user ID from request
        const { password, confirmPassword } = req.body;

        // Reset the user's password
        const user = await User.resetPassword(userId, password, confirmPassword);

        // Generate a JWT token
        const token = await User.createToken(user._id, user.role);

        res.status(200).send({
            email: user.email,
            token,
            country: user.country,
            institute: user.institute
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    signupUser,
    loginUser,
    verifyUser,
    update,
    getRoles,
    forgetPassword,
    resetPassword
};