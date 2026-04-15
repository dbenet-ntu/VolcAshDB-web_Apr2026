import { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import the UUID library for generating unique session IDs

// Create a SessionContext to store and provide the session ID
export const SessionContext = createContext();

/**
 * SessionContextProvider component to manage session ID creation and storage.
 * 
 * This component provides a context with a session ID to its child components.
 * It ensures that a unique session ID is generated and stored when the component mounts.
 * 
 * @param {Object} props - Children components that will be wrapped by this context.
 * @returns {JSX.Element} The provider component wrapping its children with SessionContext.
 */
export const SessionContextProvider = ({ children }) => {
    const [sessionId, setSessionId] = useState(null); // State to hold the current session ID

    /**
     * Effect to initialize the session ID on component mount.
     * 
     * This effect checks if a session ID already exists in sessionStorage:
     * - If found, it is retrieved and set in the state.
     * - If not found, a new session ID is generated, stored in sessionStorage,
     *   and set in the state.
     */
    useEffect(() => {
        // Check if session ID exists in sessionStorage
        const storedSessionId = sessionStorage.getItem('sessionId');
        if (storedSessionId) {
            setSessionId(storedSessionId); // Set session ID from sessionStorage
        } else {
            // Generate a new session ID and store it in sessionStorage
            const newSessionId = generateSessionId();
            sessionStorage.setItem('sessionId', newSessionId);
            setSessionId(newSessionId); // Update state with the new session ID
        }
    }, []); // Empty dependency array ensures this effect runs only once on component mount

    /**
     * Function to generate a new session ID using the UUID library.
     * 
     * @returns {string} A new unique session ID.
     */
    const generateSessionId = () => {
        return uuidv4(); // Generate and return a unique ID using UUID
    };

    // Provide the sessionId to any components wrapped by this context
    return (
        <SessionContext.Provider value={{ sessionId }}>
            {children}
        </SessionContext.Provider>
    );
};
