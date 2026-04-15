const AdmZip = require('adm-zip');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { sendEmail } = require('../utils/sendEmail');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify upload directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Save file with original name and timestamp
    }
});
const upload = multer({ storage: storage });

// Load README content from file
let readmeContent;
try {
    readmeContent = fs.readFileSync(path.join(__dirname, '../utils/README.md'), 'utf8');
} catch (error) {
    console.error('Error loading README.md:', error);
    readmeContent = '# Ash Particle Classification Data\n\nPlease contact volcashdb@ipgp.fr for assistance.';
}

/**
 * Validates ZIP structure and returns the path containing images.
 * Accepts:
 * - Images directly at ZIP root
 * - Images inside exactly one top-level folder
 * Rejects:
 * - Multiple top-level folders
 * - Nested folders beyond one level
 * - Mixed structure
 * @param {string} extractPath - Path where ZIP was extracted
 * @returns {Object} { valid: boolean, imagePath: string|null, error: string|null }
 */
const validateZipStructure = (extractPath) => {
    const imageExtensions = ['.png', '.jpg', '.jpeg'];
    const items = fs.readdirSync(extractPath);
    
    // Filter out hidden files and __MACOSX
    const visibleItems = items.filter(item => !item.startsWith('.') && !item.startsWith('__MACOSX'));
    
    if (visibleItems.length === 0) {
        return { valid: false, imagePath: null, error: 'ZIP file is empty or contains only hidden files' };
    }
    
    // Check if images are directly at root
    const imagesAtRoot = visibleItems.filter(item => {
        const itemPath = path.join(extractPath, item);
        return fs.statSync(itemPath).isFile() && imageExtensions.includes(path.extname(item).toLowerCase());
    });
    
    const foldersAtRoot = visibleItems.filter(item => {
        const itemPath = path.join(extractPath, item);
        return fs.statSync(itemPath).isDirectory();
    });
    
    // Case 1: Images directly at root (no folders or folders are empty)
    if (imagesAtRoot.length > 0 && foldersAtRoot.length === 0) {
        return { valid: true, imagePath: extractPath, error: null };
    }
    
    // Case 2: Mixed structure - images at root AND folders
    if (imagesAtRoot.length > 0 && foldersAtRoot.length > 0) {
        return { 
            valid: false, 
            imagePath: null, 
            error: 'ZIP contains mixed structure (images and folders at root). Please organize all images in one folder or place them all at the root.' 
        };
    }
    
    // Case 3: Only folders at root - check if exactly one folder
    if (foldersAtRoot.length > 1) {
        return { 
            valid: false, 
            imagePath: null, 
            error: `ZIP contains ${foldersAtRoot.length} folders. Please use only one folder containing all images.` 
        };
    }
    
    if (foldersAtRoot.length === 1) {
        const singleFolder = path.join(extractPath, foldersAtRoot[0]);
        const folderContents = fs.readdirSync(singleFolder);
        
        // Filter out hidden files
        const visibleFolderContents = folderContents.filter(item => !item.startsWith('.') && !item.startsWith('__MACOSX'));
        
        // Check for nested folders
        const nestedFolders = visibleFolderContents.filter(item => {
            const itemPath = path.join(singleFolder, item);
            return fs.statSync(itemPath).isDirectory();
        });
        
        if (nestedFolders.length > 0) {
            return { 
                valid: false, 
                imagePath: null, 
                error: 'ZIP contains nested folders. Please flatten the structure to one level (images in one folder or at root).' 
            };
        }
        
        // Check if folder contains images
        const imagesInFolder = visibleFolderContents.filter(item => {
            const itemPath = path.join(singleFolder, item);
            return fs.statSync(itemPath).isFile() && imageExtensions.includes(path.extname(item).toLowerCase());
        });
        
        if (imagesInFolder.length === 0) {
            return { 
                valid: false, 
                imagePath: null, 
                error: 'No valid images found in the folder. Please include PNG, JPG, or JPEG files.' 
            };
        }
        
        return { valid: true, imagePath: singleFolder, error: null };
    }
    
    // Case 4: No images found anywhere
    return { 
        valid: false, 
        imagePath: null, 
        error: 'No valid images found. Please include PNG, JPG, or JPEG files.' 
    };
};

/**
 * Middleware to upload particles (handles both zip and individual image files).
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const uploadParticles = async (req, res) => {
    try {
        const uploadsDir = path.join(__dirname, '../uploads');
        const existingFolders = fs.readdirSync(uploadsDir).filter(file => fs.statSync(path.join(uploadsDir, file)).isDirectory());

        // Check if there are already 5 processing folders
        if (existingFolders.length >= 5) {
            return res.status(429).send('The server is currently processing 5 requests. Please try again later.');
        }
        const file = req.file; // Access the uploaded file through multer
        const userEmail = req.body.email; // Get user email from request body

        if (!file || !userEmail) {
            console.log("No file or email uploaded", { file: !!file, email: userEmail });
            return res.status(400).send("No file uploaded or email provided.");
        }

        const filePath = file.path;  // Access the file path from multer
        const fileName = file.originalname;

        // Create an extraction path and ensure the directory exists
        const extractPath = path.join(uploadsDir, Date.now().toString());
        fs.mkdirSync(extractPath, { recursive: true });

        res.status(200).send('Processing started. You will receive an email when done.');

        let processPath; // Declare processPath in the correct scope

        // Check if the uploaded file is a zip file
        if (path.extname(fileName) === '.zip') {
            try {
                // Extract the zip file
                const zip = new AdmZip(filePath);
                zip.extractAllTo(extractPath, true);
                
                // Validate ZIP structure
                const validation = validateZipStructure(extractPath);
                                
                if (!validation.valid) {
                    // Clean up and send error
                    fs.rmSync(extractPath, { recursive: true });
                    await sendErrorEmail(userEmail, validation.error);
                    return; // Exit early
                }
                
                // Use the validated image path for processing
                processPath = validation.imagePath;
                
            } catch (error) {
                console.error('Error processing zip file:', error);
                fs.rmSync(extractPath, { recursive: true });
                await sendErrorEmail(userEmail, 'Error extracting ZIP file. Please ensure it is a valid ZIP archive.');
                return;
            }
        } else {
            try {
               // Move the uploaded image to the new folder
               const newFilePath = path.join(extractPath, fileName);
               fs.renameSync(filePath, newFilePath);
               processPath = extractPath;
            } catch (error) {
                console.error('Error processing image file:', error);
                fs.rmSync(extractPath, { recursive: true });
                await sendErrorEmail(userEmail, 'Error processing image file.');
                return;
            }
        }

        try {

            // Send folder path to Flask microservice for processing
            const response = await axios.post('http://localhost:5003/process_folder', {
                folder: processPath
            });

            const { output_folder } = response.data;

            const imageExtensions = ['.png', '.jpg', '.jpeg'];
            const filesInExtractPath = fs.readdirSync(processPath);
            filesInExtractPath.forEach(file => {
                const filePath = path.join(processPath, file);
                if (imageExtensions.includes(path.extname(file).toLowerCase())) {
                    fs.unlinkSync(filePath);  // Delete the image file
                }
            });

            // Zip the output folder containing the CSV file
            const resultZip = path.join(extractPath, 'result.zip');
            const pdfPath = path.join(__dirname, '../utils/README.pdf');
            const readmePath = path.join(output_folder, 'README.md');
            fs.writeFileSync(readmePath, readmeContent);

            const outputZip = new AdmZip();
            outputZip.addLocalFolder(output_folder);
            outputZip.addLocalFile(pdfPath);
            outputZip.writeZip(resultZip);

            // Check if the result ZIP file exceeds 7MB (safe threshold for 7MB SMTP limit, accounting for base64 encoding ~33% increase + headers)
            const maxEmailAttachmentSize = 7 * 1024 * 1024; // 7MB in bytes
            const resultZipStats = fs.statSync(resultZip);
            
            if (userEmail) {
                if (resultZipStats.size > maxEmailAttachmentSize) {
                    // File too large to send via email
                    await sendErrorEmail(
                        userEmail, 
                        `The classification results are too large (${(resultZipStats.size / (1024 * 1024)).toFixed(2)}MB) to send via email. Email attachments are limited to 7MB. Please resubmit with fewer images to keep results under this limit.`
                    );
                } else {
                    try {
                        await sendResultEmail(userEmail, resultZip);
                    } catch (emailError) {
                        console.error('Error sending result email:', emailError);
                        // If sending fails (e.g., due to size), send error notification
                        await sendErrorEmail(
                            userEmail,
                            `The classification results could not be sent via email (${(resultZipStats.size / (1024 * 1024)).toFixed(2)}MB). Email attachments are limited to 7MB. Please resubmit with fewer images.`
                        );
                    }
                }
            }

            // Remove the ZIP file and the parent folder after it has been downloaded
            fs.unlinkSync(resultZip);
            
        } catch (processingError) {

            console.error('Microservice or processing error:', processingError);

            // Send failure notification email
            await sendErrorEmail(userEmail, 'An error occurred during the classification process. Please try again or contact support.');

            
        } finally {
            // Remove the extraction folder
            if (fs.existsSync(extractPath)) {
                fs.rmSync(extractPath, { recursive: true });
            }
            
            // Remove the original uploaded ZIP file
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Cleaned up uploaded file: ${filePath}`);
            }
        }

    } catch (err) {
        console.log(err)
        res.status(500).send('Failed to classify images');
    }
};


const sendResultEmail = async (userEmail, resultZip) => {
    const sender = '"VolcAshDB Result" <volcashdb@ipgp.fr>'
    const receiver = userEmail
    const subject = 'Your Particle Analysis Results'
    const html = `<div style="background-color:#f6f6f6;margin:0">
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
                                        <td style="color:#3d4f58;font-size:24px;font-weight:bold;line-height:28px">Your Particle Analysis Results</td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top:24px;font-size:16px">You are receiving this email because a request was made for a classification of ash particles.</td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top:24px;font-size:16px">Please find attached your results, and thank you for using our service.</td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top:24px;font-size:16px">If you did not request this, please change your password or contact us.</td>
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
    const attachements = [
        {
            filename: 'labeled_images.zip',
            path: resultZip,
            contentType: 'application/zip'
        }
    ]

    await sendEmail(
        sender,
        receiver,
        subject,
        html,
        attachements
    );
}


const sendErrorEmail = async (userEmail, errorMessage = null) => {
    try {
        const sender = '"VolcAshDB Result" <volcashdb@ipgp.fr>'
        const receiver = userEmail
        const subject = 'Your Particle Analysis Results Failed'
        
        // Default error message if none provided
        const defaultError = 'An error occurred during the classification of your ash particles.';
        const specificError = errorMessage || defaultError;
        
        const html = `<div style="background-color:#f6f6f6;margin:0">
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
                                            <td style="color:#3d4f58;font-size:24px;font-weight:bold;line-height:28px">Your Particle Analysis Failed</td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top:24px;font-size:16px;color:#d32f2f;font-weight:600">${specificError}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top:24px;font-size:16px">Please ensure your submission meets the following requirements:</td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top:12px;font-size:14px">
                                                <ul style="margin:0;padding-left:20px">
                                                    <li>Images are PNG, JPG, or JPEG format</li>
                                                    <li>ZIP file contains images at root OR in a single folder (no nested folders)</li>
                                                    <li>Particles occupy 70-80% of image area with transparent backgrounds</li>
                                                    <li>Uploaded file does not exceed 60MB</li>
                                                    <li>Results must fit within 7MB email limit (~70 images with mean size &lt;850KB)</li>
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top:24px;font-size:16px">If the problem persists, please contact us at <a href="mailto:volcashdb@ipgp.fr">volcashdb@ipgp.fr</a></td>
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

        await sendEmail(
            sender,
            receiver,
            subject,
            html
        );

    } catch (err) {
        console.error('Error sending error email:', err);
    }
}

module.exports = { 
    uploadParticles,
    upload // Export multer middleware
};
