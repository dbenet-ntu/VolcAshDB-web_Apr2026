import { useState } from 'react';

/**
 * Custom hook for managing and performing searches on particles and volcanoes data.
 * 
 * @param {Array} particles - Array of particle objects to search through.
 * @param {Array} volcanoes - Array of volcano objects to search through.
 * 
 * @returns {Object} An object containing various states and methods for managing search functionality.
 */
const useSearch = (particles, volcanoes) => {
    const [searchTerm, setSearchTerm] = useState([]);  // State to store the current search terms
    const [searchSubmit, setSearchSubmit] = useState([]);  // State to store submitted search terms
    const [filterSubmit, setFilterSubmit] = useState([]);  // State to store submitted filters (search terms + tags)
    const [searchData, setSearchData] = useState({});  // State to store search results
    const [suggest, setSuggest] = useState(false);  // State to toggle suggestions
    const [selectedTags, setSelectedTags] = useState([]);  // State to store selected tags
    const [isLoading, setIsLoading] = useState(false);  // State to indicate loading status

    /**
     * Filters and returns search results based on the provided search terms and selected tags.
     * 
     * @param {Array} submit - Array of submitted search terms.
     * @param {Array} selectedTags - Array of selected tags for filtering.
     * 
     * @returns {Object} An object containing filtered results for particles and volcanoes.
     */
    const getSearchResult = (submit, selectedTags) => {

        setIsLoading(true);  // Set loading state when search starts
        setSuggest(false);  // Hide suggestions during search

        let dataList = {};

        if (submit.length !== 0 || selectedTags.length !== 0) {
            let filter = [];

            // Convert selected tags to lowercase
            if (selectedTags.length > 0) {
                filter = selectedTags.map(tag => tag.toLowerCase());
            }

            // Convert search terms to lowercase and append to filter array
            if (submit.length > 0) {
                filter.push(...submit.map(term => term.toLowerCase()));
            }
            
            // Filter particles and volcanoes data
            Object.keys({ volcanoes, particles }).forEach((key) => {
                const data = { volcanoes, particles }[key].filter((d) => {
                    // Convert data properties to lowercase for comparison
                    // const propsArr = Object.values(d).map(ele => (typeof ele === 'string' ? ele.toLowerCase() : null));
                    let propsArr = [];
                    if (key === 'volcanoes') {
                        // If volcano_details is already flattened, use d directly
                        propsArr = Object.values(d.volcano_details).map(ele => (typeof ele === 'string' ? ele.toLowerCase() : null));
                    } else {
                        // For particles, proceed as before
                        propsArr = Object.values(d).map(ele => (typeof ele === 'string' ? ele.toLowerCase() : null));
                    }

                    // Check for grain sizes in the image URL
                    const grainSizes = ["mesh60", "mesh120", "phi0phi1", "phi1phi2", "morephi0", "unsieved"];
                    grainSizes.forEach(grainSize => {
                        if (d.imgURL && d.imgURL.toLowerCase().includes(grainSize)) {
                            propsArr.push(grainSize);
                        }
                    });

                    // Extract main_type from particles data and add to properties array
                    if (key === 'particles' && d.main_type) {
                        const mainTypeEntries = Object.entries(d.main_type);
                        const maxMainTypeEntry = mainTypeEntries.reduce((maxEntry, entry) => {
                            return entry[1] > maxEntry[1] ? entry : maxEntry;
                        }, mainTypeEntries[0]);
                        
                        const maxMainTypeKey = maxMainTypeEntry[0].toLowerCase();
                        propsArr.push(maxMainTypeKey);
                    }

                    // Check if all filter terms are present in the properties array
                    return filter.every(elem => propsArr.includes(elem));
                });
                dataList[key] = data;
            });

            setSearchData(dataList);  // Update the search results
        }

        setTimeout(() => setIsLoading(false), 1000);  // Simulate loading time
        return dataList;
    };

    /**
     * Handles the submission of search terms and updates states accordingly.
     * 
     * @param {Array} submit - Array of submitted search terms.
     */
    const handleSubmit = (submit) => {
        submit = submit.map(term => term.toLowerCase());  // Convert search terms to lowercase
        setSearchSubmit(submit);
        setFilterSubmit(submit.length !== 0 && selectedTags.length !== 0 
            ? submit + ', ' + selectedTags.join(',') 
            : submit + selectedTags.join(','));
        getSearchResult(submit, selectedTags);  // Fetch search results
    };

    return {
        searchTerm,
        setSearchTerm,
        searchSubmit,
        setSearchSubmit,
        filterSubmit,
        setFilterSubmit,
        searchData,
        suggest,
        selectedTags,
        setSelectedTags,
        isLoading,
        handleSubmit,
        getSearchResult,
    };
};

export default useSearch;
