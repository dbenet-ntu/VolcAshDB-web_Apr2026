import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import RiseLoader from "react-spinners/RiseLoader";
import { Switch } from '@mui/material';  // Importing Switch from MUI
import PieChart from './PieChart';
import * as constants from "../../Constants";
import ParticleTernaryPlot from './ParticleTernaryPlot';
import ParticleTernaryPlotEruptiveStyle from './ParticleTernaryPlotEruptiveStyle';
import PCAAllParticles2d from './PCAAllParticles2d';
import PCAJuvenile2d from './PCAJuvenile2d';
import PCAExperimentalData from './PCAExperimentalData';
import HistogramParticles from './HistogramParticles';
import HistogramParticlesVolcanoes from './HistogramParticlesVolcanoes';
import { Container, ChartOverlay, ErrorMessage } from './Dashboard.styles';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useSessionContext } from '../../hooks/useSessionContext';
import PopUp from '../PopUp/popUp'; 
import InformationPopUp from '../PopUp/InformationPopUp/InformationPopUp';
import axios from 'axios'

/**
 * Dashboard Component: Displays various charts and graphs based on user and session data.
 * 
 * @param {object} props - Component properties.
 * @param {string} props.visibilityMode - Current visibility mode for chart colors.
 * 
 * @returns {JSX.Element} - The rendered component.
 */
const Dashboard = ({ visibilityMode }) => {
    
    // Proxy URL for API requests
    const proxy = constants.PROXY;

    // State to manage fetched data and loading state
    const [data, setData] = useState({ particles: [], opinion: { particles: [], opinions: [] } });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);  // State to store any login errors

    // Authentication and session context
    const { sessionId } = useSessionContext();
    const { user } = useAuthContext();

    // Extract user role from token
    const userRole = user ? JSON.parse(atob(user.token.split('.')[1])).role.toLowerCase() : null;

    // State for toggles and popup visibility
    const [displayUserData, setDisplayUserData] = useState(false);
    const [displayNaturalData, setDisplayNaturalData] = useState(true);
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);

    // Fetch data on component mount or when dependencies change
    useEffect(() => {
        const fetchData = async () => {

            if (!sessionId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                let fetchedData = { particles: [], opinion: { particles: [], opinions: [] } };

                if (sessionId && user) {
                    const userId = JSON.parse(atob(user.token.split('.')[1]))._id;
                    // Fetch opinion and particle data
                    const [opinionResponse, particlesResponse] = await Promise.all([
                        axios.post(`${proxy}/opinion/get`, { userId, sessionId, displayNaturalData }, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${user.token}`
                            }
                        }),
                        axios.post(`${proxy}/particle/get`, { sessionId, displayNaturalData }),
                    ]);
                    // Check if opinion request was successful
                    if (opinionResponse.data.success === false) {
                        fetchedData.opinion = { particles: [], opinions: [] };
                    } else {
                        fetchedData.opinion = opinionResponse.data;
                    }

                    fetchedData.particles = particlesResponse.data;
                } else if (sessionId && !user) {
                    // Fetch only particle data
                    const particlesResponse = await axios.post(`${proxy}/particle/get`, { sessionId, displayNaturalData });
                    fetchedData.particles = particlesResponse.data;
                }
                setData(fetchedData);
            } catch (error) {
                setError(error.response?.data || 'An error occurred while fetching data');
            } finally {
                setLoading(false);  // Set loading to false when data fetch is complete
            }
        };

        fetchData();
    }, [user, proxy, sessionId, displayNaturalData]);

    // Handler for user data toggle switch
    const handleUserToggleChange = (event) => {
        setDisplayUserData(event.target.checked);
    };

    // Handler for data type toggle switch
    const handleDataTypeToggleChange = (event) => {
        setDisplayNaturalData(event.target.checked);
    };

    // Select and filter data based on toggles
    const selectedData = displayUserData ? data.opinion.particles : data.particles;

    // Check if there are juvenile particles
    const hasJuvenile = selectedData.some(particle => particle.main_type?.juvenile === 100);

    return (
        <Container>
            {/* Toggle Switch for Authenticated Users */}
            {['team member', 'annotator'].includes(userRole) && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Switch
                        onChange={handleUserToggleChange}
                        checked={displayUserData}
                        color="primary"
                        inputProps={{ 'aria-label': 'Global/User Data Toggle' }}
                        sx={{
                            '& .MuiSwitch-thumb': {
                                color: displayUserData ? '#0c4aad' : '#006837',  // Customize thumb color
                            },
                            '& .MuiSwitch-track': {
                                backgroundColor: displayUserData ? '#0c4aad' : '#006837',  // Customize track color
                            },
                            '& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track': {
                                backgroundColor: displayUserData ? '#0c4aad' : '#006837',  // Customize track color
                            }
                        }}
                    />
                    <label>{displayUserData ? "User Data" : "Global Data"}</label>
                </div>
            )}

            {/* Toggle Switch for Data Type */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Switch
                    onChange={handleDataTypeToggleChange}
                    checked={displayNaturalData}
                    color="secondary"
                    inputProps={{ 'aria-label': 'Natural/Experimental Data Toggle' }}
                    sx={{
                        '& .MuiSwitch-thumb': {
                            color: displayNaturalData ? '#006837' : '#ff9900',  // Customize thumb color
                        },
                        '& .MuiSwitch-track': {
                            backgroundColor: displayNaturalData ? '#006837' : '#ff9900',  // Customize track color
                        },
                        '& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track': {
                            backgroundColor: displayNaturalData ? '#006837' : '#ff9900',  // Customize track color
                        }
                    }}
                />
                <label>{displayNaturalData ? "Natural Data" : "Experimental Data"}</label>
            </div>

            {/* PopUp component */}
            {isPopUpOpen && (
                <PopUp onClose={() => setIsPopUpOpen(false)}>
                    <InformationPopUp />
                </PopUp>
            )}

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {/* Loading state */}
            {!isPopUpOpen && loading && (
                <div style={{ textAlign: 'center', paddingTop: '10px', paddingBottom: '0px' }}>
                    <RiseLoader
                        cssOverride={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "450px",
                        }}
                        size={10}
                        color={"#123abc"}
                        loading={loading}
                    />
                </div>
            )}
            
            {!isPopUpOpen && !loading && selectedData.length > 0 && displayNaturalData && (
                <div>
                    {/* Display charts and plots for natural data */}
                    <Box style={{ paddingTop: '50px', display: 'flex', wrap: 'wrap', justifyContent: "space-evenly" }}>
                        <ChartOverlay>
                            <PieChart visibilityMode={visibilityMode} data={selectedData} title={'volc_name'} />
                        </ChartOverlay>

                        <ChartOverlay>
                            <PieChart visibilityMode={visibilityMode} data={selectedData} title={'main_type'} />
                        </ChartOverlay>
                        
                        <ChartOverlay>
                            <PieChart visibilityMode={visibilityMode} data={selectedData} title={'eruptive_style'} />
                        </ChartOverlay>
                    </Box>

                    <Box style={{ paddingTop: '50px', display: 'flex', wrap: 'wrap', justifyContent: "space-evenly" }}>
                        <ChartOverlay>
                            <ParticleTernaryPlot visibilityMode={visibilityMode} data={selectedData} />
                        </ChartOverlay>
                        <ChartOverlay>
                            <ParticleTernaryPlotEruptiveStyle visibilityMode={visibilityMode} data={selectedData} />
                        </ChartOverlay>
                    </Box>

                    <Box style={{ paddingTop: '50px', display: 'flex', wrap: 'wrap', justifyContent: "space-evenly" }}>
                        <ChartOverlay>
                            <PCAAllParticles2d visibilityMode={visibilityMode} data={selectedData} />
                        </ChartOverlay>
                        
                        {hasJuvenile && (
                            <ChartOverlay>
                                <PCAJuvenile2d visibilityMode={visibilityMode} data={selectedData} />
                            </ChartOverlay>
                        )}
                    </Box>

                    <Box style={{ paddingTop: '50px', display: 'flex', wrap: 'wrap', justifyContent: "space-evenly" }}>
                        <ChartOverlay>
                            <HistogramParticles visibilityMode={visibilityMode} data={selectedData} onOpen={() => setIsPopUpOpen(true)} />
                        </ChartOverlay>
                        <ChartOverlay>
                            <HistogramParticlesVolcanoes visibilityMode={visibilityMode} data={selectedData} onOpen={() => setIsPopUpOpen(true)}/>
                        </ChartOverlay>
                    </Box>
                </div>
            )}

            {!isPopUpOpen && !loading && selectedData.length > 0 && !displayNaturalData && (
                <div>
                    {/* Display charts and plots for experimental data */}
                    <Box style={{ paddingTop: '50px', display: 'flex', wrap: 'wrap', justifyContent: "space-evenly" }}>
                        <ChartOverlay>
                            <PieChart visibilityMode={visibilityMode} data={selectedData} title={'volc_name'} />
                        </ChartOverlay>
                        
                        <ChartOverlay>
                            <PieChart visibilityMode={visibilityMode} data={selectedData} title={'eruptive_style'} />
                        </ChartOverlay>
                    </Box>

                    <Box style={{ paddingTop: '50px', display: 'flex', wrap: 'wrap', justifyContent: "space-evenly" }}>
                        <ChartOverlay>
                            <PCAExperimentalData visibilityMode={visibilityMode} data={selectedData} />
                        </ChartOverlay>
                    </Box>
                </div>
            )}

            {!isPopUpOpen && !error && !loading && selectedData.length === 0 && (
                <div style={{ textAlign: 'center', paddingTop: '10px', paddingBottom: '0px' }}>
                    <h3>Sorry, there is no data to display!</h3>
                </div>
            )}
        </Container>
    );
};

export default Dashboard;
