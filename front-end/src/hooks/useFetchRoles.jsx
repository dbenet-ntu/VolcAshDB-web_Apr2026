import { useEffect, useRef } from 'react';
import { useAuthContext } from './useAuthContext';
import { useGetRoles } from './useGetRoles';

/**
 * Custom hook to fetch user roles.
 * 
 * This hook provides a function to fetch roles based on the current user's ID. 
 * It also returns the result of the fetch operation.
 * 
 * @returns {Object} An object containing the fetchRoles function and the result of the fetch operation.
 */
const useFetchRoles = () => {
    // Extract the user from the authentication context
    const { user } = useAuthContext();

    // Extract the function to get roles and its result from the useGetRoles hook
    const { getRoles, result } = useGetRoles();

    // Reference to store the fetchRoles function
    const fetchRolesRef = useRef();

    // Define the fetchRoles function
    fetchRolesRef.current = async () => {
        try {
            // Extract user ID from the JWT token
            const userId = JSON.parse(atob(user.token.split('.')[1]))._id;

            // Call getRoles with the extracted user ID
            await getRoles(userId);
        } catch (error) {
            // Log any errors encountered during the fetch operation
            console.error('Error fetching roles:', error);
        }
    };

    // Use effect to trigger fetchRoles when the user object changes
    useEffect(() => {
        // Fetch roles only if the user is available (i.e., logged in)
        if (user) {
            fetchRolesRef.current();  // Trigger the fetchRoles function
        }
    }, [user]);  // Dependency array: effect runs when 'user' changes

    // Return the fetchRoles function and the result of the fetch operation
    return { fetchRoles: fetchRolesRef.current, result };
};

export default useFetchRoles;
