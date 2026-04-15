import { createContext, useReducer, useEffect, useMemo, useCallback } from 'react'

// Create an AuthContext to provide and consume authentication data globally
export const AuthContext = createContext()

/**
 * Reducer function to manage authentication state.
 * 
 * @param {Object} state - Current state of the authentication context.
 * @param {Object} action - Action containing the type and optional payload to modify the state.
 * @returns {Object} Updated state based on the action type.
 */
export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload } // Set the user upon login
        case 'LOGOUT':
            return { user: null } // Clear the user upon logout
        case 'UPDATE_USER':
            return { user: { ...state.user, ...action.payload } } // Update user information
        default:
            return state // Return the current state if action is not recognized
    }
}

/**
 * AuthContextProvider component to wrap the application and provide authentication context.
 * 
 * @param {Object} props - The children components that will be wrapped by this context.
 */
export const AuthContextProvider = ({ children }) => {

    // Initialize state from localStorage to avoid race condition
    const initializeUser = () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) return null;
            
            const user = JSON.parse(storedUser);
            
            if (user?.token) {
                // Decode JWT token to check expiration
                const expirationTime = JSON.parse(atob(user.token.split('.')[1])).exp * 1000;
                
                if (expirationTime < Date.now()) {
                    // Token expired, clean up
                    localStorage.removeItem('user');
                    return null;
                }
                
                return user;
            }
        } catch (error) {
            localStorage.removeItem('user');
        }
        return null;
    };

    // Initialize reducer with user from localStorage (no race condition)
    const [state, dispatch] = useReducer(authReducer, {
        user: initializeUser()
    })

    /**
     * Function to set the user and store user data in localStorage.
     * 
     * @param {Object} user - User object to be stored in localStorage and updated in state.
     */
    const setUser = useCallback((user) => {
        localStorage.setItem('user', JSON.stringify(user)) // Save user data to localStorage
        dispatch({ type: 'LOGIN', payload: user }) // Dispatch LOGIN action to update state
    }, [])

    /**
     * Function to update specific user fields in both localStorage and the state.
     * 
     * @param {Object} updatedFields - Fields to be updated for the current user.
     */
    const updateUser = useCallback((updatedFields) => {
        const updatedUser = { ...state.user, ...updatedFields } // Merge updated fields with current user
        localStorage.setItem('user', JSON.stringify(updatedUser)) // Save updated user data in localStorage
        dispatch({ type: 'UPDATE_USER', payload: updatedFields }) // Dispatch UPDATE_USER action to modify state
    }, [state.user])

    // Memorize the value object to prevent unnecessary re-renders
    const value = useMemo(() => ({ ...state, dispatch, setUser, updateUser }), [state, setUser, updateUser])

    // Provide the auth state, dispatch function, and setUser/updateUser functions to children
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}