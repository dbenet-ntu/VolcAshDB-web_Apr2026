import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

/**
 * Custom hook to access the AuthContext.
 * Provides the current authentication state and dispatch function for managing authentication actions.
 *
 * @returns {Object} The authentication context object containing:
 * - `user`: The currently authenticated user information.
 * - `dispatch`: Function to dispatch authentication-related actions (e.g., login, logout, update user).
 *
 * @throws {Error} If the hook is used outside of an AuthContextProvider.
 */
export const useAuthContext = () => {
    // Access the AuthContext using the useContext hook
    const context = useContext(AuthContext);

    // Ensure the hook is used within an AuthContextProvider
    if (!context) {
        throw Error('useAuthContext must be used inside an AuthContextProvider');
    }

    // Return the context object containing user state and dispatch function
    return context;
};