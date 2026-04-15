import { useAuthContext } from "./useAuthContext";

/**
 * Custom hook for handling user logout.
 * 
 * This hook provides functionality to log out the user by clearing the user data
 * from local storage and updating the authentication context.
 * 
 * @returns {Object} An object containing the logout function.
 */
export const useLogout = () => {
    const { dispatch } = useAuthContext();  // Access the dispatch function from the AuthContext

    /**
     * Function to perform user logout.
     * 
     * This function clears the user data from local storage and dispatches a 
     * logout action to update the authentication context.
     */
    const logout = () => {
        // Remove user data from local storage
        localStorage.removeItem('user');
        // Remove all keys matching the pattern 'kc-callback-*'
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('kc-callback-')) {
                localStorage.removeItem(key);
            }
        });

        // Dispatch logout action to update authentication context
        dispatch({ type: 'LOGOUT' });
    };

    // Return the logout function for use in components
    return { logout };
};