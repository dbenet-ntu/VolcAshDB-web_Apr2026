import { useEffect, useRef } from 'react';
import { useAuthContext } from './useAuthContext';
import { useGetAllVolcanoes } from './useGetAllVolcanoes';

/**
 * Custom hook to fetch volcanoes data from the backend.
 * 
 * This hook retrieves the list of volcanoes based on the current session ID and manages
 * loading state and the fetched data.
 * 
 * @returns {Object} An object containing the volcanoes array and the loading state.
 */
const useFetchAllVolcanoes = () => {

    // Get the authenticated user from the AuthContext
    const { user } = useAuthContext();

    // Extract the function to get roles and its result from the useGetAllVolcanoes hook
    const { getAllVolcanoes, volcanoes } = useGetAllVolcanoes();

    // Reference to store the fetchVolcanoesRef function
    const fetchVolcanoesRef = useRef();

    // Define the fetchVolcanoesRef function
    fetchVolcanoesRef.current = async () => {
        try {
            // Extract user ID from the JWT token
            const userId = JSON.parse(atob(user.token.split('.')[1]))._id;

            // Call getRoles with the extracted user ID
            await getAllVolcanoes(userId);
        } catch (error) {
            // Log any errors encountered during the fetch operation
            console.error('Error fetching roles:', error);
        }
    };

    // Use effect to trigger fetchVolcanoesRef when the user object changes
    useEffect(() => {
        // Fetch roles only if the user is available (i.e., logged in)
        if (user) {
            fetchVolcanoesRef.current();  // Trigger the fetchVolcanoesRef function
        }
    }, [user]);  // Dependency array: effect runs when 'user' changes


    // Return the list of volcanoes and loading state
    return { fetchVolcanoes: fetchVolcanoesRef.current, volcanoes };
};

export default useFetchAllVolcanoes;
