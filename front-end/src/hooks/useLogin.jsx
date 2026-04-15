import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useSessionContext } from './useSessionContext';
import * as constants from '../Constants';

/**
 * Custom hook for handling user login.
 * 
 * This hook provides functionality for user authentication, including managing 
 * loading states and error handling. It interacts with the backend to log in the user.
 * 
 * @returns {Object} An object containing the login function, loading state, and error message.
 */
export const useLogin = () => {
    const [error, setError] = useState(null);  // State to store any login errors
    const [isLoading, setIsLoading] = useState(null);  // State to indicate loading status
    const { dispatch } = useAuthContext();  // Access the dispatch function from the AuthContext
    const { sessionId } = useSessionContext();  // Get the session ID from the SessionContext
    const proxy = constants.PROXY;  // API proxy URL from constants file

    /**
     * Function to perform user login.
     * 
     * @param {string} email - The email address of the user.
     * @param {string} password - The password of the user.
     * 
     * This function sends a POST request to the backend with the user credentials
     * and handles the response, including updating local storage and context state.
     */
    const login = async (email, password) => {
        
        setIsLoading(true);  // Set loading state to true
        setError(null);  // Clear any previous errors

        try {
            // Send a POST request to the login endpoint with user credentials and session ID
            const response = await fetch(`${proxy}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, sessionId })
            });

            if (!response.ok) {
                const message = await response.text();  // Parse JSON response
                setError(message);
            } else {
                const json = await response.json();  // Parse JSON response

                // Save user data to local storage on successful login
                localStorage.setItem('user', JSON.stringify(json));

                // Update the auth context with the logged-in user's data
                dispatch({ type: 'LOGIN', payload: json });
            }
        } catch {
            // Handle network or other unexpected errors
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);  // Reset loading state
        }
    };

    // Return the login function, loading state, and error message
    return { login, isLoading, error };
};