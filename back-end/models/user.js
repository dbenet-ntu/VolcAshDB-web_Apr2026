const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema
const statusEnum = require('../enums/status')
const { randomString } = require('../utils/random')
const { sendEmail } = require('../utils/sendEmail')
const role = require("../enums/role")

/**
 * User Schema: Defines the structure of the 'users' collection in MongoDB.
 * This schema tracks details of each user.
 */
const userSchema = new Schema({
    country: {
        type: String                    // Country of the user is of type String
    },
    email: {
        required: true,                 // Email is required
        type: String,                   // Email is of type String
        unique: true                    // Email must be unique across users
    },
    institute: {
        type: String                    // Institute of the user is of type String
    },
    password: {
        required: true,                 // Password of the user is required
        type: String                    // Password is of type String
    },
    role: {
        default: role.USER,             // Default role is 'user'
        enum: role,                     // Possible values for role, imported from an enum
        required: true,                 // Role is required
        type: String                    // Role is of type String
    },
    status: {
        default: statusEnum.INACTIVE,   // Default status is inactive
        enum: statusEnum,               // Possible values for status, imported from an enum
        required: true,                 // Status is required
        type: String                    // Status is of type String
    },
    verificationCode: {
        type: String                    // Code used for email verification is of type String
    },
},{
	collection: 'users',                // Name of the collection in MongoDB
	timestamps: true                    // Automatically generate createdAt and updatedAt timestamps
})

// Static method to create a JWT token
userSchema.statics.createToken = (_id, role, expiresIn = '1d') => {
    return jwt.sign({_id, role}, process.env.SECRET, {expiresIn}); // Sign the JWT with user ID and role
};

// Static method for signing up a new user
userSchema.statics.signup = async function(email, password, confirmpassword, country, institute) {

    // Validation
    if (!email || !password || !confirmpassword) {
        throw Error('All fields must be filled')
    }

    // Validate email format
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }

    // Validate password strength
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }

    // Check if passwords match
    if (password !== confirmpassword) {
        throw Error('Passwords are not identical')
    }

    // Check if the email is already registered
    const exists = await this.findOne({email})

    if(exists) {
        throw Error('Email already in use')
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    // Generate a random verification code
    const code = randomString(6)

    // Create the user document
    const user = await this.create({
        email, 
        password: hash, 
        country,
        institute,
        verificationCode: code
    })

    // Send verification email
    sender = '"VolcAshDB Account" <volcashdb@ipgp.fr>'
    receiver = email
    subject = "Verify your identity"
    html = `
        <div style="background-color:#f6f6f6;margin:0">
            <table style="font-family:'akzidenz','helvetica','arial',sans-serif;font-size:14px;color:#5e5e5e;width:98%;max-width:600px;float:none;margin:0 auto" border="0" cellpadding="0" cellspacing="0" valign="top" align="left">
                <tbody>
                <tr align="left">
                    <td style="padding-top:36px;padding-bottom:22px;display:flex;justify-content:space-between;">
                        <img src="https://research-collection.ipgp.fr/_nuxt/img/logo.35aeb56.png" height="70" width="auto" class="CToWUd" data-bit="iit">
                        <div>
                            <img src="https://palseagroup.weebly.com/uploads/1/1/5/6/115603541/published/eos-logo-colour-horizontal-mention.png" height="70" width="auto" class="CToWUd" data-bit="iit">
                            <img src="https://download.logo.wine/logo/Nanyang_Technological_University/Nanyang_Technological_University-Logo.wine.png" height="70" width="auto" class="CToWUd" data-bit="iit">
                        </div>
                    </td>
                </tr>
                <tr bgcolor="#ffffff">
                    <td>
                        <table bgcolor="#ffffff" style="width:100%;line-height:20px;padding:32px;border:1px solid;border-color:#f0f0f0" cellpadding="0">
                            <tbody>
                            <tr>
                                <td style="color:#3d4f58;font-size:24px;font-weight:bold;line-height:28px">Action Required: Verify Your Identity</td>
                            </tr>
                            <tr>
                                <td style="padding-top:24px;font-size:16px">You are receiving this email because a request was made for a one-time code that can be used for authentication.</td>
                            </tr>
                            <tr>
                                <td style="padding-top:24px;font-size:16px">Please enter the following code for verification:</td>
                            </tr>
                            <tr>
                                <td style="padding-top:24px;font-size:16px" align="center"><span id="m_6389788773516852171verification-code" style="font-size:18px">${code}</span></td>
                            </tr>
                            <tr>
                                <td style="padding-top:24px;font-size:16px">If you did not request this change, please change your password or contact us.</td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="font-size:12px;padding:24px 0;color:#999">This message was sent from <span class="il">VolcAshDB</span>, IPGP, 1 rue Jussieu, 75238 Paris cedex 05.</td>
                </tr>
                </tbody>
            </table>
        </div>`

    // Send the email
    sendEmail(sender, receiver, subject, html)

    return user

}

// Static method for verifying the user's verification code
userSchema.statics.verifyCode = async function(email, code) {
    const user = await this.findOne({ email, verificationCode: code });

    // Verify if the user exist
    if (!user) {
        throw Error('Verification code is incorrect');
    }

    // Activate the user and clear the verification code
    user.status = statusEnum.ACTIVE;
    user.verificationCode = null;

    await user.save();
};


// Static method for logging in a user
userSchema.statics.login = async function(email, password) {

    // Verify that email and password are defined
    if (!email || !password) {
        throw Error('All fields must be filled')
    }

    // Find the user by email
    const user = await this.findOne({email})

    if(!user) {
        throw Error('Incorrect email')
    }

    // Compare the password with the stored hash
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error('Incorrect password')
    }

    return user

}


// Static method for handling forgotten password requests
userSchema.statics.forgetPassword = async function(email) {

    // Verify that email is defined
    if (!email) {
        throw Error('All fields must be filled')
    }

    // Find the user by email
    const user = await this.findOne({email})

    if(!user) {
        throw Error('Incorrect email')
    }

    // Generate a reset token (valid for 10 minutes)
    const token = await this.createToken(user._id, user.role, '10m')

    // Prepare and send the reset password email
    sender = '"VolcAshDB Account" <volcashdb@ipgp.fr>'
    receiver = email
    subject = "Reset Password"
    html = `
    <div style="background-color:#f6f6f6;margin:0">
        <table style="font-family:'akzidenz','helvetica','arial',sans-serif;font-size:14px;color:#5e5e5e;width:98%;max-width:600px;float:none;margin:0 auto" border="0" cellpadding="0" cellspacing="0" valign="top" align="left">
            <tbody>
            <tr align="left">
                <td style="padding-top:36px;padding-bottom:22px;display:flex;justify-content:space-between;">
                    <img src="https://research-collection.ipgp.fr/_nuxt/img/logo.35aeb56.png" height="70" width="auto" class="CToWUd" data-bit="iit">
                    <div>
                        <img src="https://palseagroup.weebly.com/uploads/1/1/5/6/115603541/published/eos-logo-colour-horizontal-mention.png" height="70" width="auto" class="CToWUd" data-bit="iit">
                        <img src="https://download.logo.wine/logo/Nanyang_Technological_University/Nanyang_Technological_University-Logo.wine.png" height="70" width="auto" class="CToWUd" data-bit="iit">
                    </div>
                </td>
            </tr>
            <tr bgcolor="#ffffff">
                <td>
                    <table bgcolor="#ffffff" style="width:100%;line-height:20px;padding:32px;border:1px solid;border-color:#f0f0f0" cellpadding="0">
                        <tbody>
                        <tr>
                            <td style="color:#3d4f58;font-size:24px;font-weight:bold;line-height:28px">Action Required: Verify Your Identity</td>
                        </tr>
                        <tr>
                            <td style="padding-top:24px;font-size:16px">You are receiving this email because a request has been made to reset your password. </td>
                        </tr>
                        <tr>
                            <td style="padding-top:24px;font-size:16px">Please follow the link to reset your password:</td>
                        </tr>
                        <tr>
                            <td style="padding-top:24px;font-size:16px" align="center"><a href="https://volcashdb.ipgp.fr/reset/${token}">https://volcashdb.ipgp.fr/reset/${token}</a></td>
                        </tr>
                        <tr>
                            <td style="padding-top:24px;font-size:16px" align="center">The link will expire in 10 minutes.</td>
                        </tr>
                        <tr>
                            <td style="padding-top:24px;font-size:16px">If you didn't request a password reset, please ignore this email.</td>
                        </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" style="font-size:12px;padding:24px 0;color:#999">This message was sent from <span class="il">VolcAshDB</span>, IPGP, 1 rue Jussieu, 75238 Paris cedex 05.</td>
            </tr>
            </tbody>
        </table>
    </div>`

    // Send the email
    sendEmail(sender, receiver, subject, html)

}


// Static method for resetting password
userSchema.statics.resetPassword = async function(userId, password, confirmpassword) {

    // Find the user by id
    const user = await this.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    // Verify that password and comfirm password are defined
    if (!password || !confirmpassword) {
        throw Error('All fields must be filled')
    }

    // Validate password strength
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }

    // Check if passwords match
    if (password !== confirmpassword) {
        throw Error('Passwords are not identical')
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Update user's password, clear reset token and expiration time
    user.password = hash;
    await user.save();

    return user;

}

// Create and export the User model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = { User };