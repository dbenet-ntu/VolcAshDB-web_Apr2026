import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useSessionContext } from './useSessionContext';
import * as constants from '../Constants';

/**
 * Custom hook to fetch user opinions from the backend.
 * 
 * This hook provides functionality to request opinions for a given user ID
 * and manages the result state.
 * 
 * @returns {Object} An object containing the getOpinion function and the result state.
 */
export const useGetOpinion = () => {
    // State to hold the result of the opinions request
    const [result, setResult] = useState({ success: false, opinions: [] });

    // Retrieve user and session ID from context
    const { user } = useAuthContext();
    const { sessionId } = useSessionContext();

    // Proxy URL for the API endpoint
    const proxy = constants.PROXY;

    /**
     * Function to fetch opinions for a given user ID.
     * 
     * @param {string} userId - The ID of the user for whom to fetch opinions.
     */
    const getOpinion = async (userId, displayNaturalData) => {
        try {

            if (!sessionId) {
                return;
            }

            // Make a POST request to the backend to get opinions
            const response = await fetch(`${proxy}/opinion/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`, // Include JWT token for authorization
                },
                body: JSON.stringify({ userId, sessionId, displayNaturalData }) // Send user ID and session ID in the request body
            });

            // Parse the JSON response
            const json = await response.json();

            if (json.success === false) {
                // Handle error if the response status is not OK
                setResult({ success: false, opinions: [], particles: [], error: json.error });
            } else {
            
                // Update result state with the fetched data
                setResult(json);
            }

        } catch (error) {
            // Handle network or other unexpected errors
            console.error('Error fetching opinions:', error);
            // Optionally, you could set result to indicate failure
            setResult({ success: false, opinions: [] });
        }
    };

    // Return the function to fetch opinions and the result state
    return { getOpinion, result };
};
