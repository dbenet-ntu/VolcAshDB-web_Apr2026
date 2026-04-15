import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useSessionContext } from './useSessionContext';
import * as constants from '../Constants';

/**
 * Custom hook to fetch user roles from the backend.
 * 
 * This hook provides functionality to request user roles and manages
 * the result state of the request.
 * 
 * @returns {Object} An object containing the getRoles function and the result state.
 */
export const useGetAllVolcanoes = () => {
    // State to hold the result of the roles request
    const [volcanoes, setVolcanoes] = useState([]);

    // Retrieve user and session ID from context
    const { user } = useAuthContext();
    const { sessionId } = useSessionContext();

    // Proxy URL for the API endpoint
    const proxy = constants.PROXY;

    /**
     * Function to fetch roles for the current user.
     * 
     * This function sends a POST request to the backend to retrieve roles
     * and updates the result state with the fetched data.
     */
    const getAllVolcanoes = async () => {
        try {

            if (!sessionId) {
                return;
            }

            // Make a POST request to the backend to get roles
            const response = await fetch(`${proxy}/volcano/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` // Include JWT token for authorization
                },
                body: JSON.stringify({ sessionId }) // Send session ID in the request body
            });

            if (!response.ok) {
                const message = await response.text();  // Parse JSON response
                console.log(message);
            } else {
                const json = await response.json();  // Parse JSON response
            
                // Update result state with the fetched data
                setVolcanoes(json);
            }

        } catch (error) {
            // Handle network or other unexpected errors
            console.error('Error fetching roles:', error);        
        }
    };

    // Return the function to fetch roles and the result state
    return { getAllVolcanoes, volcanoes };
};
