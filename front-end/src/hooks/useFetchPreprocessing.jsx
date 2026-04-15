import { useState } from 'react';
import * as constants from '../Constants';
import { useAuthContext } from './useAuthContext';
import axios from 'axios';

/**
 * Custom hook for preprocessing workflow: upload TIFF images, draw bounding boxes,
 * extract particles with RemBG, and download ZIP.
 * 
 * @returns {Object} Functions and states for the preprocessing workflow
 */
export const useFetchPreprocessing = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [processingStatus, setProcessingStatus] = useState(null);
    
    const { user } = useAuthContext();
    const proxy = constants.PROXY;

    /**
     * Upload an image and get the downscaled version for display
     * @param {File} imageFile - TIFF/PNG/JPEG file
     * @returns {Promise<Object>} Session info with displayUrl, dimensions, scaleRatio
     */
    const uploadImage = async (imageFile) => {
        setIsLoading(true);
        setError(null);
        setUploadProgress(0);

        try {
            if (!user) {
                throw new Error('Please login or create an account.');
            }

            if (!imageFile) {
                throw new Error('Please select a file.');
            }

            const email = user?.email;

            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('email', email);

            const response = await axios.post(
                `${proxy}/preprocessing/upload`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                    },
                }
            );

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error('Failed to upload image');
            }

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Upload failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Process bounding boxes: extract particles with RemBG
     * @param {string} sessionId - Session ID from upload
     * @param {Array} bboxes - Array of {id, x, y, width, height}
     * @param {number} marginPx - Margin in pixels (default: 10)
     * @returns {Promise<Object>} Processing status
     */
    const processBboxes = async (sessionId, bboxes, marginPx = 10) => {
        setIsLoading(true);
        setError(null);
        setProcessingStatus({ status: 'processing', progress: 0 });

        try {
            if (!user) {
                throw new Error('Please login or create an account.');
            }

            if (!sessionId) {
                throw new Error('Session ID is required.');
            }

            if (!bboxes || bboxes.length === 0) {
                throw new Error('Please draw at least one bounding box.');
            }

            const response = await axios.post(
                `${proxy}/preprocessing/process`,
                {
                    sessionId,
                    bboxes,
                    marginPx,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 202 || response.status === 200) {
                setProcessingStatus({
                    status: 'processing',
                    progress: 0,
                    particlesCount: bboxes.length,
                });
                return response.data;
            } else {
                throw new Error('Failed to start processing');
            }

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Processing failed';
            setError(errorMessage);
            setProcessingStatus({ status: 'error', error: errorMessage });
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Get processing status (for polling)
     * @param {string} sessionId - Session ID
     * @returns {Promise<Object>} Status with progress, processedCount, zipUrl
     */
    const getStatus = async (sessionId) => {
        try {
            if (!user) {
                throw new Error('Please login or create an account.');
            }

            if (!sessionId) {
                throw new Error('Session ID is required.');
            }

            const response = await axios.get(
                `${proxy}/preprocessing/status/${sessionId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                }
            );

            if (response.status === 200) {
                const statusData = response.data;
                setProcessingStatus(statusData);
                return statusData;
            } else {
                throw new Error('Failed to get status');
            }

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Failed to get status';
            setError(errorMessage);
            throw err;
        }
    };

    /**
     * Download the ZIP file of extracted particles
     * @param {string} sessionId - Session ID
     * @param {string} filename - Custom filename (optional)
     * @returns {Promise<void>} Downloads file via browser
     */
    const downloadZip = async (sessionId, filename = null) => {
        setIsLoading(true);
        setError(null);

        try {
            if (!user) {
                throw new Error('Please login or create an account.');
            }

            if (!sessionId) {
                throw new Error('Session ID is required.');
            }

            const response = await axios.get(
                `${proxy}/preprocessing/download/${sessionId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                    responseType: 'blob', // Important for file download
                }
            );

            if (response.status === 200) {
                // Create a download link and trigger it
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    filename || `volcashdb_particles_${sessionId.substring(0, 8)}.zip`
                );
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                throw new Error('Failed to download ZIP');
            }

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Download failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Clear error state
     */
    const clearError = () => {
        setError(null);
    };

    /**
     * Clear processing status
     */
    const clearStatus = () => {
        setProcessingStatus(null);
    };

    return {
        uploadImage,
        processBboxes,
        getStatus,
        downloadZip,
        clearError,
        clearStatus,
        isLoading,
        error,
        uploadProgress,
        processingStatus,
    };
};
