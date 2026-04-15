import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useSessionContext } from './useSessionContext';
import * as constants from '../Constants';

/**
 * Custom hook to handle adding a user's opinion on a particle along with several related attributes.
 * It interacts with the backend API to submit this data.
 *
 * @returns {Object} The hook's state and functions:
 * - `addOpinion`: Function to add an opinion with various attributes.
 * - `isLoading`: Boolean indicating if the request is in progress.
 * - `success`: Boolean indicating if the operation was successful.
 * - `message`: String holding the response message (success or error).
 */
export const useAddOpinion = () => {
    // State to hold the response message
    const [message, setMessage] = useState(null);
    // State to track the success status of the operation
    const [success, setSuccess] = useState(null);
    // State to track loading status during the API request
    const [isLoading, setIsLoading] = useState(false);
    // Get the authenticated user from the AuthContext
    const { user } = useAuthContext();
    // Get the session ID from the SessionContext
    const { sessionId } = useSessionContext();
    // API proxy URL from constants file
    const proxy = constants.PROXY;

    /**
     * Function to add an opinion to the backend.
     * 
     * @param {string} userId - The ID of the user submitting the opinion.
     * @param {string} particleId - The ID of the particle being reviewed.
     * @param {string} opinion - The opinion text itself.
     * @param {string} comments - Any additional comments.
     * @param {string} color - Particle color.
     * @param {string} luster - Particle luster property.
     * @param {string} edge - Particle edge details.
     * @param {string} shape - Shape of the particle.
     * @param {string} crystallinity - Crystallinity of the particle.
     * @param {string} hydro_alter_degree - Degree of hydro alteration.
     * @param {string} weathering_sign - Signs of weathering.
     */
    const addOpinion = async (
        userId, 
        particleId, 
        opinion, 
        comments,
        color,
        luster,
        edge,
        shape,
        crystallinity,
        hydro_alter_degree,
        weathering_sign
    ) => {

        if (!sessionId) {
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true); // Set loading state when the request starts

        try {
            // Perform a POST request to the backend to submit the opinion
            const response = await fetch(`${proxy}/opinion/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${user.token}` // Use JWT token for authorization
                },
                body: JSON.stringify({
                    sessionId, // Attach session ID
                    userId, 
                    particleId, 
                    opinion, 
                    comments,
                    color,
                    luster,
                    edge,
                    shape,
                    crystallinity,
                    hydro_alter_degree,
                    weathering_sign
                })
            });

            const json = await response.json(); // Parse JSON response

            if (!response.ok) {
                // Set error message if the request fails
                setMessage(json.message);
                setSuccess(false); // Mark operation as failed
            } else {
                // Set success message if the request succeeds
                setMessage(json.message);
                setSuccess(true); // Mark operation as successful
            }
        } catch (error) {
            // Handle any unexpected errors
            setMessage('An error occurred while submitting your opinion.');
            setSuccess(false); // Mark operation as failed
        } finally {
            setIsLoading(false); // Reset loading state when the request completes
        }
    };

    // Return the addOpinion function along with the loading, success, and message state variables
    return { addOpinion, isLoading, success, message };
};
