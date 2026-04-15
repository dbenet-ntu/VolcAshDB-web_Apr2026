import { useState } from "react";
import { useSessionContext } from './useSessionContext';
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from 'react-router'; 
import * as constants from '../Constants';

/**
 * Custom hook for verifying a user's email code.
 * 
 * @returns {Object} - Contains the verify function, loading state, and error state.
 */
export const useVerifyCode = () => {
    const [error, setError] = useState(null); // State for storing error messages
    const [isLoading, setIsLoading] = useState(false); // State for loading status
    const { sessionId } = useSessionContext(); // Get session ID from context
    const { user, dispatch } = useAuthContext(); // Access user and dispatch from authentication context
    const navigate = useNavigate(); // Navigation hook
    const proxy = constants.PROXY; // API proxy URL

    /**
     * Verifies the user's email code.
     * 
     * @param {string} email - User's email address.
     * @param {string} code - Verification code.
     */
    const verify = async (email, code) => {

        if (!sessionId) {
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true); // Set loading to true
        setError(null); // Clear any previous errors

        try {
            // Send verification request to the server
            const response = await fetch(`${proxy}/user/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, sessionId })
            });

            if (!response.ok) {
                const message = await response.text();  // Parse JSON response
                setError(message);
            } else {
                // Update user status and local storage
                const updatedUser = { ...user, status: 'ACTIVE' };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // Dispatch action to update user status in context
                dispatch({ type: 'UPDATE_USER', payload: { status: 'ACTIVE' } });
                
                // Redirect to home page
                navigate('/');
            }
        } catch {
            // Handle network errors
            setError('An unexpected error occurred.');
        } finally {
            setIsLoading(false); // Ensure loading is set to false after request
        }
    };

    return { verify, isLoading, error }; // Return values
};
