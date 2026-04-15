import { useState } from "react";
import { useSessionContext } from './useSessionContext';
import * as constants from '../Constants';

/**
 * Custom hook to handle password reset requests.
 * 
 * This hook provides functionality to request a password reset by sending an email to the backend.
 * It manages the loading state, success status, and response messages.
 * 
 * @returns {Object} An object containing the forgetPassword function, loading state, message, and success status.
 */
export const useForgetPassword = () => {
    // State to hold the success status of the request
    const [success, setSuccess] = useState(null);

    // State to hold the response message from the server
    const [message, setMessage] = useState(null);

    // State to track the loading status during the API request
    const [isLoading, setIsLoading] = useState(null);

    // Get the session ID from the SessionContext
    const { sessionId } = useSessionContext();

    // Proxy URL for the API endpoint
    const proxy = constants.PROXY;

    /**
     * Function to handle the password reset request.
     * 
     * @param {string} email - The email address of the user requesting the password reset.
     */
    const forgetPassword = async (email) => {
        
        if (!sessionId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true); // Set loading state to true when the request starts
        setMessage(null); // Reset message state

        try {
            // Make a POST request to the backend to request a password reset
            const response = await fetch(`${proxy}/user/forget`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, sessionId })
            });

            const message = await response.text();
            setMessage(message);
            setSuccess(response.ok);
            
        } catch {
            setMessage('An error occurred while processing your request.');
            setSuccess(false);
        } finally {
            setIsLoading(false); // Ensure loading state is reset
        }
    };

    // Return the forgetPassword function, loading state, message, and success status
    return { forgetPassword, isLoading, message, success };
};