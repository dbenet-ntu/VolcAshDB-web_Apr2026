import { useEffect, useRef } from 'react';
import { useAuthContext } from './useAuthContext';
import { useGetOpinion } from './useGetOpinion';

/**
 * Custom hook to fetch opinions associated with the authenticated user.
 *
 * @returns {Object} An object containing:
 * - `fetchOpinions`: A function to manually trigger opinion fetching.
 * - `result`: The result of the opinion fetching operation.
 */
const useFetchOpinions = (displayNaturalData) => {
    // Extract user information from the AuthContext
    const { user } = useAuthContext();
    
    // Extract opinion fetching function and results from the useGetOpinion hook
    const { getOpinion, result } = useGetOpinion();
    
    // Reference to store the fetchOpinions function
    const fetchOpinionsRef = useRef();

    // Define the fetchOpinions function
    fetchOpinionsRef.current = async () => {
        try {
            // Extract user ID from the JWT token
            const userId = JSON.parse(atob(user.token.split('.')[1]))._id;
            
            // Call getOpinion function with the extracted userId
            await getOpinion(userId, displayNaturalData);
        } catch (error) {
            // Log any errors encountered during the fetching process
            console.error('Error fetching opinions:', error);
        }
    };

    // useEffect hook to fetch opinions when user is authenticated
    useEffect(() => {
        // Check if a user is authenticated
        if (user) {
            // Trigger opinion fetch when the user is authenticated
            fetchOpinionsRef.current();
        }
    }, [user]);  // Re-run the effect if the user object changes

    // Return the fetchOpinions function and the result of the fetch operation
    return { fetchOpinions: fetchOpinionsRef.current, result };
};

export default useFetchOpinions;
