import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useSessionContext } from './useSessionContext';
import * as constants from '../Constants';

/**
 * Custom hook to fetch annotation distribution data for a specific particle.
 * 
 * This hook provides functionality to request annotation distribution from the backend
 * and manages the result state.
 * 
 * @returns {Object} An object containing the getAnnotationDistribution function and the result state.
 */
export const useGetAnnotationDistribution = () => {
    // State to hold the result of the annotation distribution request
    const [result, setResult] = useState({ success: false, distribution: [] });

    // Retrieve user and session ID from context
    const { user } = useAuthContext();
    const { sessionId } = useSessionContext();

    // Proxy URL for the API endpoint
    const proxy = constants.PROXY;

    /**
     * Function to fetch annotation distribution for a given particle ID.
     * 
     * @param {string} particleId - The ID of the particle for which to fetch annotation distribution.
     */
    const getAnnotationDistribution = async (particleId) => {
        try {

            if (!sessionId) {
                return;
            }

            // Make a POST request to the backend to get annotation distribution
            const response = await fetch(`${proxy}/opinion/getDistribution`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`, // Include JWT token for authorization
                },
                body: JSON.stringify({ particleId, sessionId }), // Send particle ID and session ID in the request body
            });

            if (!response.ok) {
                // Handle HTTP errors if response status is not OK
                console.error('Failed to fetch:', response.statusText);
                setResult({ success: false, distribution: [] });
                return;
            }

            // Parse the JSON response
            const json = await response.json();
            setResult(json); // Update result state with the fetched data

        } catch (error) {
            // Handle network or other unexpected errors
            console.error('Error fetching opinions:', error);
            setResult({ success: false, distribution: [] });
        }
    };

    // Return the function to fetch annotation distribution and the result state
    return { getAnnotationDistribution, result };
};
