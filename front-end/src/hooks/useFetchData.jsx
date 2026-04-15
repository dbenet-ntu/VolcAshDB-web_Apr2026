import { useState, useEffect } from 'react';
import axios from 'axios';
import * as constants from '../Constants';
import { useSessionContext } from './useSessionContext';

/**
 * Custom hook to fetch and manage data from multiple API endpoints.
 * This hook is responsible for retrieving particles, volcanoes, eruptions, AFE, and tags data.
 * It handles both experimental and natural particle data based on the displayNaturalData flag.
 *
 * @param {boolean} displayNaturalData - Flag to determine whether to fetch experimental or natural data.
 * @returns {object} Contains the fetched data (particles, volcanoes, eruptions, etc.) and a loading state.
 */
const useFetchData = (displayNaturalData, setProgress) => {
    // State variables for storing fetched data
    const [particles, setParticles] = useState([]);
    const [particlesExamples, setParticlesExamples] = useState([]);
    const [volcanoes, setVolcanoes] = useState([]);
    const [eruptions, setEruptions] = useState([]);
    const [samples, setSamples] = useState([]);
    const [afes, setAfes] = useState([]);
    const [tags, setTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);  // Loading state

    const proxy = constants.PROXY;  // Proxy URL for API calls
    const { sessionId } = useSessionContext();  // Access sessionId from SessionContext

    useEffect(() => {
        // Fetches data from multiple API endpoints using axios
        const fetchData = async () => {
            try {

                if (!sessionId) {
                    setIsLoading(false);
                    return;
                }
                
                setIsLoading(true);  // Set loading state to true before the request starts
                setProgress(0);

                let totalProgress = 0;
                const totalRequests = 7;

                // Perform multiple API requests in parallel using Promise.all
                const [particlesResponse, particlesExamplesResponse, volcanoesResponse, eruptionsResponses, samplesResponse, afesResponse, tagsResponse] = await Promise.all([
                    axios.post(`${proxy}/particle/get`, { sessionId, displayNaturalData }, {
                        onDownloadProgress: (progressEvent) => {
                            if (progressEvent.total) {
                                // Calculate progress for this individual request
                                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                totalProgress += progress / totalRequests; // Accumulate the progress for all requests
                                setProgress(Math.round(totalProgress));  // Update the global progress
                            }
                        }
                    }),                   
                    axios.post(`${proxy}/particle/getExamples`, { sessionId }, {
                        onDownloadProgress: (progressEvent) => {
                            if (progressEvent.total) {
                                // Calculate progress for this individual request
                                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                totalProgress += progress / totalRequests; // Accumulate the progress for all requests
                                setProgress(Math.round(totalProgress));  // Update the global progress
                            }
                        }
                    }),
                    axios.post(`${proxy}/volcano/getVolcStd`, { sessionId }, {
                        onDownloadProgress: (progressEvent) => {
                            if (progressEvent.total) {
                                // Calculate progress for this individual request
                                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                totalProgress += progress / totalRequests; // Accumulate the progress for all requests
                                setProgress(Math.round(totalProgress));  // Update the global progress
                            }
                        }
                    }),
                    axios.post(`${proxy}/eruption/get`, { sessionId }, {
                        onDownloadProgress: (progressEvent) => {
                            if (progressEvent.total) {
                                // Calculate progress for this individual request
                                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                totalProgress += progress / totalRequests; // Accumulate the progress for all requests
                                setProgress(Math.round(totalProgress));  // Update the global progress
                            }
                        }
                    }),
                    axios.post(`${proxy}/sample/get`, { sessionId }, {
                        onDownloadProgress: (progressEvent) => {
                            if (progressEvent.total) {
                                // Calculate progress for this individual request
                                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                totalProgress += progress / totalRequests; // Accumulate the progress for all requests
                                setProgress(Math.round(totalProgress));  // Update the global progress
                            }
                        }
                    }),
                    axios.post(`${proxy}/afe/get`, { sessionId }, {
                        onDownloadProgress: (progressEvent) => {
                            if (progressEvent.total) {
                                // Calculate progress for this individual request
                                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                totalProgress += progress / totalRequests; // Accumulate the progress for all requests
                                setProgress(Math.round(totalProgress));  // Update the global progress
                            }
                        }
                    }),
                    axios.post(`${proxy}/particle/tags`, { sessionId }, {
                        onDownloadProgress: (progressEvent) => {
                            if (progressEvent.total) {
                                // Calculate progress for this individual request
                                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                totalProgress += progress / totalRequests; // Accumulate the progress for all requests
                                setProgress(Math.round(totalProgress));  // Update the global progress
                            }
                        }
                    })
                ]);

                // Extract all particles and volcanoes from the response data
                const filteredParticles = particlesResponse.data;
                const allVolcanoes = volcanoesResponse.data;

                // Filter volcanoes by matching volc_num with the filtered particles
                const filteredVolcanoes = allVolcanoes.filter(volcano =>
                    filteredParticles.some(particle => particle.volc_num === volcano.volcano_details.volc_num)
                );

                // Update state with the fetched and filtered data
                setParticles(filteredParticles);
                setParticlesExamples(particlesExamplesResponse.data);
                setVolcanoes(filteredVolcanoes);
                setEruptions(eruptionsResponses.data);
                setSamples(samplesResponse.data)
                setAfes(afesResponse.data);
                setTags(tagsResponse.data.tags);

                setIsLoading(false);  // Set loading state to false after data is fetched
            } catch (error) {
                console.error('Error fetching data:', error);  // Log any errors
            }
        };

        fetchData();  // Trigger the data fetch when the component mounts or dependencies change
    }, [proxy, sessionId, displayNaturalData]);

    // Return the fetched data and loading state
    return { particles, particlesExamples, volcanoes, eruptions, samples, afes, tags, isLoading };
};

export default useFetchData;
