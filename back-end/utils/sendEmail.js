const transporter = require('../config/nodemailer');

/**
 * Sends an email using the configured transporter.
 * 
 * @param {string} sender - The email address of the sender.
 * @param {string} receiver - The email address of the receiver.
 * @param {string} subject - The subject line of the email.
 * @param {string} html - The HTML content of the email body.
 * @returns {Promise} - A promise that resolves when the email is sent or rejects if there is an error.
 */
const sendEmail = async (sender, receiver, subject, html, attachments = []) => {
    try {
        // Send email with defined transport object
        const info = await transporter.sendMail({
            from: sender, // Sender address
            to: receiver, // List of receivers
            subject: subject, // Subject line
            html: html, // HTML body
            attachments
        });

        // Log the message ID for reference
        console.log('Message sent:', info.messageId);
        
        return info;
    } catch (error) {
        // Log any errors that occur
        console.error('Error sending email:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

module.exports = { sendEmail };