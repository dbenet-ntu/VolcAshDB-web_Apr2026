import { useState } from "react";

/**
 * Custom hook to manage loading state based on data availability.
 * 
 * This hook provides a loading state that can be updated based on the provided data.
 * 
 * @returns {Object} An object containing the load function and the loading state.
 */
export const useLoading = () => {
    // State to indicate whether data is still loading
    const [loading, setLoading] = useState(true);

    /**
     * Function to update loading state based on the provided data.
     * 
     * @param {Array} data - An array of data elements to check.
     * 
     * This function iterates through the data array and updates the loading state
     * to false if any of the elements meet the criteria (i.e., not undefined,
     * has length greater than 0, or is an object).
     */
    const load = (data) => {
        data.forEach(element => {
            if (element !== undefined) {
                // Check if element has length or is of type object
                if (element.length > 0 || typeof element === 'object') {
                    // Data is available, update loading state
                    setLoading(false);
                }
            }
        });
    };

    // Return the load function and the loading state
    return { load, loading };
};