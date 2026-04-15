import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useSessionContext } from './useSessionContext';
import * as constants from '../Constants';

/**
 * Custom hook for updating user information.
 * 
 * @returns {Object} - Contains the updateInformation function, loading state, success state, and message.
 */
export const useUpdateInformation = () => {
    const [message, setMessage] = useState(null); // State for storing update messages
    const [success, setSuccess] = useState(null); // State for storing success status
    const [isLoading, setIsLoading] = useState(null); // State for loading status
    const { user, updateUser } = useAuthContext(); // Access user and updateUser from authentication context
    const { sessionId } = useSessionContext(); // Get session ID from context
    const proxy = constants.PROXY; // API proxy URL

    /**
     * Updates user information by sending updated fields to the server.
     * 
     * @param {Object} updateFields - Object containing fields to be updated.
     */
    const updateInformation = async (updateFields) => {

        if (!sessionId) {
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true); // Set loading to true

        try {
            // Send update request to the server
            const response = await fetch(`${proxy}/user/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({...updateFields, sessionId})
            });

            // Parse JSON response
            const json = await response.json();

            if (!response.ok) {
                // Set error state if response is not ok
                setIsLoading(false);
                setSuccess(json.success);
                setMessage(json.message);
            } else {
                // Update user information in context and set success state
                updateUser(updateFields);
                setSuccess(json.success);
                setMessage(json.message);
                setIsLoading(false);
            }
        } catch (error) {
            // Handle network errors
            setIsLoading(false);
            setMessage('An unexpected error occurred.');
        }
    };

    return { updateInformation, isLoading, success, message }; // Return values
};