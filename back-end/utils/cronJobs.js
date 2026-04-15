const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');
const { User } = require('../models/user');

const uploadsDir = path.join(__dirname, '..', 'uploads');


const oodUploadsDir = path.join(__dirname, '..', 'uploads', 'ood');

// Clean up OOD session folders older than 2 hours (runs every hour)
cron.schedule('0 * * * *', async () => {
    const threshold = new Date(Date.now() - 2 * 60 * 60 * 1000);
    try {
        const entries = await fs.readdir(oodUploadsDir);
        for (const entry of entries) {
            const entryPath = path.join(oodUploadsDir, entry);
            const stats = await fs.stat(entryPath);
            if (stats.isDirectory() && stats.mtime < threshold) {
                await fs.rm(entryPath, { recursive: true, force: true });
                console.log(`[OOD] Cron cleaned up old session: ${entry}`);
            }
        }
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error('Error cleaning OOD sessions:', error);
        }
    }
});

// Schedule a cron job to run daily at midnight
cron.schedule('0 0 * * *', async () => {
    // Calculate the threshold date for inactivity (24 hours ago)
    const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
        // Delete users who have been inactive for more than 24 hours
        await User.deleteMany({
            status: 'INACTIVE',
            createdAt: { $lt: threshold }
        });
        
        console.log('Successfully deleted inactive users');
    } catch (error) {
        // Log any errors that occur during the delete operation
        console.error('Error deleting inactive users:', error);
    }

    // --- DELETE OLD FILES IN UPLOADS FOLDER ---
    try {
        const files = await fs.readdir(uploadsDir);

        for (const file of files) {
            const filePath = path.join(uploadsDir, file);
            const stats = await fs.stat(filePath);

            if (stats.mtime < threshold) {
                await fs.rm(filePath, { recursive: true, force: true });
                console.log(`Deleted: ${file}`);
            }
        }

    } catch (error) {
        console.error('Error cleaning uploads folder:', error);
    }
});
