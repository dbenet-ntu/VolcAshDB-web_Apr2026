import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';

import { useAuthContext } from './hooks/useAuthContext';

import Legal from './legal/Legal';

import Navigation from './components/navigation/Navigation';
import SideBar from './components/sidebar/SideBar';

import Home from './pages/HomePage/Home';
import CataloguePage from './pages/CatalogPage/CatalogPage';
import ClassifyPage from './pages/ContributePage/ClassifyPage';
import Dashboard from './pages/AnalyticPlots/Dashboard';
import AboutUs from './pages/AboutUs/AboutUs';
import Login from './pages/Authentication/Login';
import Signup from './pages/Authentication/Signup';
import UserPage from './pages/UserPage/UserPage';
import StatsPage from './pages/Stats/StatsPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import VerifyCode from './pages/Authentication/VerifyCode';
import ForgetPassword from './pages/Authentication/ForgetPassword';
import ResetPassword from './pages/Authentication/ResetPassword';
import MaintenancePopUp from './pages/PopUp/MaintenancePopUp/MaintenancePopUp';


/**
 * App Component: The main application component that handles routing and layout.
 * 
 * @returns {JSX.Element} - The rendered app component.
 */
function App() {

    // Authentication context hook to get the current user
    const { user } = useAuthContext();

    // State for managing visibility mode
    const [visibilityMode, setVisibilityMode] = useState('Default');

    // State for managing drawer (sidebar) visibility
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Maintenance mode state
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

    /**
     * Handles selection of visibility mode.
     * 
     * @param {string} mode - The selected visibility mode.
     */
    const handleVisibilitySelect = (mode) => {
        setVisibilityMode(mode);
    };

    /**
     * Toggles the state of the drawer (sidebar).
     */
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };
    
    /**
     * Protected route component for verify page - only accessible with INACTIVE status
     */
    const VerifyRoute = () => {
        if (user && user.status === 'INACTIVE') {
            return <VerifyCode />;
        }
        return <Navigate to="/" />;
    };

    return (
        <React.Fragment>
            {/* CssBaseline component to normalize styles across browsers */}
            <CssBaseline />
            
            {/* Router component to handle routing within the application */}
            <BrowserRouter>
                {/* Navigation component with drawer toggle and open state */}
                <Navigation 
                    toggleDrawer={toggleDrawer}
                    drawerOpen={drawerOpen}
                />
                
                {/* SideBar component with visibility mode and drawer controls */}
                <SideBar 
                    handleVisibilitySelect={handleVisibilitySelect} 
                    visibilityMode={visibilityMode} 
                    toggleDrawer={toggleDrawer}
                    drawerOpen={drawerOpen}
                />

                {/* Check if maintenance mode is enabled */}
                {isMaintenanceMode && 
                    <MaintenancePopUp onClose={() => setIsMaintenanceMode(false)} />
                }

                {!isMaintenanceMode &&
                    <Routes>
                        <Route index element={<Home />} />

                        <Route path='about' element={<AboutUs />} />

                        <Route path='catalogue' element={<CataloguePage visibilityMode={visibilityMode}/>} />
                        
                        <Route path='classify' element={!user ? <Navigate to="/login"/> : <ClassifyPage/>} />
                        
                        <Route path='analytic' element={<Dashboard visibilityMode={visibilityMode}/>} />
                        
                        <Route path='user' element={!user ? <Navigate to="/login"/> : <UserPage/>} />
                        
                        <Route path='login' element={!user ? <Login/> : <Navigate to="/"/>} />
                        
                        <Route path='signup' element={!user ? <Signup/> : <Navigate to="/"/>} />
                        
                        <Route path='verify' element={<VerifyRoute />} />
                        
                        <Route path='stats' element={user ? <StatsPage visibilityMode={visibilityMode}/> : <Navigate to="/"/>} />
                        
                        <Route path='settings' element={user ? <SettingsPage visibilityMode={visibilityMode}/> : <Navigate to="/"/>} />
                        
                        <Route path='legal' element={<Legal />} />
                        
                        <Route path='forget' element={<ForgetPassword />} />
                        
                        <Route path='reset/:token' element={!user ? <ResetPassword /> : <Navigate to="/"/>} />
                    </Routes>
                }
            </BrowserRouter>
        </React.Fragment>
    );
}

export default App;