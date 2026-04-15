import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useSessionContext } from './useSessionContext';
import * as constants from '../Constants';

/**
 * Custom hook for handling password reset functionality.
 * 
 * This hook provides functionality to reset a user's password by making
 * a request to the backend with the provided token and new passwords.
 * 
 * @returns {Object} An object containing the resetPassword function, 
 * loading state, success status, and any message from the operation.
 */
export const useResetPassword = () => {
    const [message, setMessage] = useState(null);  // State to hold response messages
    const [success, setSuccess] = useState(null);  // State to track success status
    const [isLoading, setIsLoading] = useState(null);  // State to track loading status
    const { dispatch } = useAuthContext();  // Access the dispatch function from AuthContext
    const { sessionId } = useSessionContext();  // Retrieve session ID from SessionContext
    const proxy = constants.PROXY;  // API proxy URL from constants file

    /**
     * Function to handle password reset.
     * 
     * @param {string} token - The token received for password reset.
     * @param {string} password - The new password.
     * @param {string} confirmPassword - Confirmation of the new password.
     */
    const resetPassword = async (token, password, confirmPassword) => {

        if (!sessionId) {
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);  // Set loading state when the request starts
        setMessage(null);  // Reset the message state

        try {
            // Perform a POST request to the backend to reset the password
            const response = await fetch(`${proxy}/user/reset/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}`  // Use token for authorization
                },
                body: JSON.stringify({ password, confirmPassword, sessionId })
            });

            if (!response.ok) {
                const message = await response.text();  // Parse JSON response

                setMessage(message);  // Set error message if the request fails
                setSuccess(response.ok);  // Set success status to false
            } else {
                const json = await response.json();  // Parse JSON response

                // Save the user to local storage on successful password reset
                localStorage.setItem('user', JSON.stringify(json));

                // Update the authentication context with the new user data
                dispatch({ type: 'LOGIN', payload: json });

                setMessage('Password successfully reset.');  // Set success message
                setSuccess(json.success);  // Set success status to true
            }
        } catch {
            setMessage('An error occurred while resetting the password.');  // Handle unexpected errors
            setSuccess(false);  // Mark operation as failed
        } finally {
            setIsLoading(false);  // Reset loading state when the request completes
        }
    };

    // Return the resetPassword function along with the loading, success, and message state variables
    return { resetPassword, isLoading, success, message };
};