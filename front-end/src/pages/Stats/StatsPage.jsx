import { useState, useEffect } from 'react';
import * as constants from "../../Constants";
import { Container, ResultContainer, ChartContainer, ChartOverlay, Title, ErrorMessage } from './StatsPage.styles';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useSessionContext } from '../../hooks/useSessionContext';
import TimelinePlot from '../AnalyticPlots/TimelinePlot';
import axios from 'axios';

/**
 * StatsPage: Component for displaying statistical data including total users and daily metrics.
 * Utilizes hooks for fetching data and context management to display relevant statistics.
 * 
 * @param {string} visibilityMode - Mode to control the visibility of the plots.
 * @returns {JSX.Element} - The rendered StatsPage component.
 */
const StatsPage = ({ visibilityMode }) => {
    
    // Constants for API proxy and session management
    const proxy = constants.PROXY;
    const { sessionId } = useSessionContext();
    const { user } = useAuthContext();
    const userRole = user ? JSON.parse(atob(user.token.split('.')[1])).role.toLowerCase() : null;
    const [error, setError] = useState(null);  // State to store any login errors

    // State variables for storing fetched data
    const [totalUsers, setTotalUsers] = useState(0);
    const [requestsPerDay, setRequestsPerDay] = useState([]);
    const [sessionsPerDay, setSessionsPerDay] = useState([]);

    useEffect(() => {
        /**
         * fetchData: Fetches statistical data from the backend API.
         * Uses axios to make POST requests and updates state with the fetched data.
         */
        const fetchData = async () => {
            try {

                if (!sessionId) {
                    return;
                }

                if (user && userRole === 'team member') {
                    // Fetch total users, requests per day, and users per day
                    const [totalUsersResponse, requestsPerDayResponse, sessionsPerDayResponse] = await Promise.all([
                        axios.post(`${proxy}/stats/total-users`, { sessionId }, { 
                            headers: {
                                'Content-Type': 'application/json', 
                                'Authorization': `Bearer ${user.token}`
                            }
                        }),
                        axios.post(`${proxy}/stats/requests-per-day`, { sessionId }, { 
                            headers: {
                                'Content-Type': 'application/json', 
                                'Authorization': `Bearer ${user.token}`
                            }
                        }),
                        axios.post(`${proxy}/stats/users-per-day`, { sessionId }, { 
                            headers: {
                                'Content-Type': 'application/json', 
                                'Authorization': `Bearer ${user.token}`
                            }
                        }),
                    ]);

                    // Update state with the fetched data
                    setTotalUsers(totalUsersResponse.data);
                    setRequestsPerDay(requestsPerDayResponse.data);
                    setSessionsPerDay(sessionsPerDayResponse.data);
                }
            } catch (error) {
                setError(error.response?.data || 'An error occurred while fetching data');
            }
        };

        fetchData();
    }, [user, proxy, sessionId, userRole]);

    return (
        <Container>
            <Title>
                <h1>Statistic Menu</h1>
            </Title>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {!error && 
                <ResultContainer>
                    {/* Container for statistical charts */}
                    <ChartContainer>
                        <ChartOverlay>
                            {/* Display total number of users */}
                            <h2>{totalUsers}</h2>
                            <h4>Total Users</h4>
                        </ChartOverlay>
                        <ChartOverlay>
                            {/* Display requests per day chart */}
                            <TimelinePlot
                                title="Requests Per Day"
                                data={requestsPerDay}
                                visibilityMode={visibilityMode}
                            />
                        </ChartOverlay>
                        <ChartOverlay>
                            {/* Display users per day chart */}
                            <TimelinePlot
                                title="Sessions Per Day"
                                data={sessionsPerDay}
                                visibilityMode={visibilityMode}
                            />
                        </ChartOverlay>
                    </ChartContainer>
                </ResultContainer>
            }
            
        </Container>
    );
};

export default StatsPage;