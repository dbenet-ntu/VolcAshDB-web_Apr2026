import { SessionContext } from '../context/SessionContext';
import { useContext } from 'react';

/**
 * Custom hook for accessing the session context.
 * 
 * @returns {Object} The context value from `SessionContext`.
 * 
 * @throws {Error} If used outside of a `SessionContextProvider`, throws an error indicating that the hook must be used within the provider.
 */
export const useSessionContext = () => {
    // Access the context value
    const context = useContext(SessionContext);

    // Check if the context is undefined (which means the hook is used outside of a provider)
    if (!context) {
        throw Error('useSessionContext must be used inside a SessionContextProvider');
    }

    // Return the context value
    return context;
};