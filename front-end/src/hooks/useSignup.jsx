import { useState } from "react";
import { useSessionContext } from './useSessionContext';
import { useNavigate } from 'react-router'; 
import { useAuthContext } from "./useAuthContext";
import * as constants from '../Constants';
import { flushSync } from 'react-dom';

/**
 * Custom hook for handling user signup.
 * 
 * @returns {Object} - Contains the signup function, loading state, and error message.
 */
export const useSignup = () => {
    const [error, setError] = useState(null); // State for storing error messages
    const [isLoading, setIsLoading] = useState(null); // State for loading status
    const { sessionId } = useSessionContext(); // Get session ID from context
    const { setUser } = useAuthContext(); // Use setUser instead of dispatch
    const navigate = useNavigate(); // Hook for navigation
    const proxy = constants.PROXY; // API proxy URL

    /**
     * Handles user signup by sending user details to the server.
     * 
     * @param {string} email - User's email address.
     * @param {string} password - User's password.
     * @param {string} confirmpassword - User's password confirmation.
     * @param {string} country - User's country.
     * @param {string} institute - User's institute.
     */
    const signup = async (email, password, confirmpassword, country, institute) => {
        
        setIsLoading(true); // Set loading to true
        setError(null); // Clear previous errors

        try {
            // Send signup request to the server
            const response = await fetch(`${proxy}/user/signup`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password, confirmpassword, country, institute, sessionId})
            });

            if (!response.ok) {
                const message = await response.text();  // Parse JSON response
                setError(message);
            } else {
                const json = await response.json();

                // Add default status if not provided by backend
                const userWithStatus = {
                    ...json,
                    status: json.status || 'INACTIVE'
                };

                // Use flushSync to ensure state update completes synchronously
                flushSync(() => {
                    setUser(userWithStatus);
                });
                
                // Navigate to verification page
                navigate('/verify');
            }
        } catch {
            // Handle network errors
            setError('An unexpected error occurred. Please try again.');
        }  finally {
            setIsLoading(false);  // Reset loading state
        }
    };

    return { signup, isLoading, error }; // Return values
};