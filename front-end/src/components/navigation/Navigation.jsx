import { CustomAppBar, CustomToolBar, CustomBox, CustomButton, CustomLink } from './Navigation.styles'
import { Link as RouterLink } from "react-router"
import PersonIcon from '@mui/icons-material/Person';
import { IconButton } from '@mui/material'

/**
 * Navigation component for the app's top bar.
 * 
 * @param {function} toggleDrawer - Function to toggle the state of the drawer (sidebar).
 * @param {boolean} drawerOpen - State indicating if the drawer is open or closed.
 * @returns {JSX.Element} - The rendered navigation bar.
 */
export default function Navigation({ toggleDrawer, drawerOpen }) {

    return (
        <CustomAppBar position='static'>
            <CustomToolBar>
                
                {/* Logo that links to the homepage */}
                <CustomLink component={RouterLink} to="/">VolcAshDB</CustomLink>
                
                {/* Navigation buttons inside a Grid layout */}
                <CustomBox>
                    <CustomButton color='inherit' component={RouterLink} to="/">HOME</CustomButton>
                    <CustomButton color='inherit' component={RouterLink} to="/about">ABOUT</CustomButton>
                    <CustomButton color='inherit' component={RouterLink} to="/catalogue">CATALOGUE</CustomButton>
                    <CustomButton color='inherit' component={RouterLink} to="/classify">CLASSIFY</CustomButton>
                    <CustomButton color='inherit' component={RouterLink} to="/analytic">PLOTS</CustomButton>
                </CustomBox>
                
                {/* Icon button to toggle the drawer (sidebar) */}
                <IconButton color="inherit" onClick={toggleDrawer}>
                    {/* Display the Person icon only when the drawer is closed */}
                    {!drawerOpen ? <PersonIcon /> : null}
                </IconButton>
            </CustomToolBar>
        </CustomAppBar>
    );
}