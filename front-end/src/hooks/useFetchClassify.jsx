import { useState } from 'react';
import * as constants from '../Constants';
import { useSessionContext } from './useSessionContext';
import { useAuthContext } from './useAuthContext';
import axios from 'axios';

/**
 * Custom hook to fetch the total number of particles from the backend.
 * 
 * This hook retrieves the total particle count based on the current session ID and manages
 * loading state and the fetched data.
 * 
 * @returns {Object} An object containing the classify function, loading state, error state.
 */
export const useFetchClassify = () => {
    const [error, setError] = useState(null);  // State to store any login errors
    const [success, setSuccess] = useState(null);  // State to store any login errors
    const [isLoading, setIsLoading] = useState(null);  // State to indicate loading status
    const { user } = useAuthContext();
    const { sessionId } = useSessionContext();  // Get the session ID from the SessionContext
    const proxy = constants.PROXY;  // API proxy URL from constants file

    /**
     * Effect to fetch the total number of particles from the backend when the component mounts or
     * when proxy or sessionId changes.
     */
    const classify = async (selectedFile) => {
        
        setIsLoading(true);  // Set loading state to true
        setError(null);  // Clear any previous errors

        try {

            if (!user) {
                setError('Please login or create an account.')
                return;
            }

            if (!selectedFile) {
                setError('Please select a file.')
                return;
            }

            const email = user?.email;
    
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('sessionId', sessionId);
            formData.append('email', email);

            const response = await axios.post(`${proxy}/classify/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status !== 200) {
                setError('Failed to upload file');
                return;
            }

            if (response.status == 200) {
                setSuccess(response.data);
                return;
            }

        } catch (error) {
            setError(error.response.data);
        } finally {
            setIsLoading(false);  // Reset loading state
        }

    }; 

    return { classify, isLoading, error, success };
};