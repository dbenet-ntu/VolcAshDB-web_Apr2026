import { useState, useEffect } from 'react';
import axios from 'axios';
import * as constants from '../Constants';
import { useSessionContext } from './useSessionContext';

/**
 * Custom hook to fetch the total number of particles from the backend.
 * 
 * This hook retrieves the total particle count based on the current session ID and manages
 * loading state and the fetched data.
 * 
 * @returns {Object} An object containing the totalParticles array and the loading state.
 */
const useFetchTotalParticles = () => {
    // State to hold the total number of particles
    const [totalParticles, setTotalParticles] = useState([]);
    
    // State to track the loading status
    const [isLoading, setIsLoading] = useState(true);

    // Proxy URL for the API endpoint
    const proxy = constants.PROXY;

    // Get the session ID from the SessionContext
    const { sessionId } = useSessionContext();

    /**
     * Effect to fetch the total number of particles from the backend when the component mounts or
     * when proxy or sessionId changes.
     */
    useEffect(() => {
        // Define the asynchronous function to fetch data
        const fetchData = async () => {

            if (!sessionId) {
                setIsLoading(false);
                return;
            }

            axios.post(`${proxy}/particle/getTotalParticles`, { 
                sessionId 
            }).then(function (response) {
                setTotalParticles(response.data[0].totalParticles);
                // Set loading state to false after data is fetched
                setIsLoading(false);
            }).catch(function (error) {
                // Log any errors encountered during data fetching
                console.log('Error fetching data:', error);
            })
        };

        // Call the fetchData function
        fetchData();
    }, [proxy, sessionId]); // Dependency array: effect runs when 'proxy' or 'sessionId' changes

    // Return the totalParticles and loading state
    return { totalParticles, isLoading };
};

export default useFetchTotalParticles;