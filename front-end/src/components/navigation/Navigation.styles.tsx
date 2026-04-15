import { AppBar, Toolbar, Link, Box, Button } from '@mui/material'
import { styled } from '@mui/styles'
import { createTheme } from '@mui/material/styles'

const theme = createTheme()

/**
 * CustomAppBar: Adjusts the width and margin based on the drawer state.
 * 
 * @property {function} width - Sets width to `auto` if drawer is open, otherwise full width.
 * @property {function} marginRight - Adds margin when the drawer is open.
 * @property {object} transition - Smooth transition for width and margin.
 */
export const CustomAppBar = styled(AppBar)({
    width: (drawerOpen) => (drawerOpen ? `auto` : '100%'),
    marginRight: (drawerOpen) => (drawerOpen ? 240 : 0),
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
})

/**
 * CustomToolBar: Ensures space between items in the toolbar.
 * 
 * @property {string} justifyContent - Aligns items with space between them.
 */
export const CustomToolBar = styled(Toolbar)({
    justifyContent: 'space-between',
})

/**
 * CustomGrid: Makes the navigation menu a flex container.
 * 
 * @property {string} display - Sets display to flex for the menu items.
 */
export const CustomBox = styled(Box)({
    display: 'flex',
})

/**
 * CustomLink: Sets the appearance of the logo, including responsive font sizes.
 * 
 * @property {string} color - Sets logo text color to white.
 * @property {string} fontSize - Default font size for the logo.
 * @property {object} [theme.breakpoints.down('sm')] - Adjusts font size for small screens.
 * @property {string} fontSize - Decrease font size of the button text.
 * @property {object} [theme.breakpoints.down('xs')] - Adjusts font size for extra small screens.
 * @property {string} fontSize - Decrease even more font size of the button text.
 * @property {string} alignItems - Aligns logo items centrally.
 * @property {string} fontWeight - Sets the font weight to bold.
 * @property {string} textDecoration - Removes underline from the logo text.
 */
export const CustomLink = styled(Link)({
    color: "white",
    fontSize: "1.5rem",
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: '0.6rem',
    },
    alignItems: "center",
    fontWeight: "bold",
    textDecoration: "none", 
})


/**
 * CustomButton: Styles the navigation buttons, including responsive padding and font sizes.
 * 
 * @property {string} minWidth - Sets minimum width of the button.
 * @property {string} borderRadius - Adds rounded corners to the button.
 * @property {string} whiteSpace - Prevents text from wrapping.
 * @property {string} padding - Adds padding inside the button.
 * @property {string} fontSize - Default font size of the button text.
 * @property {object} [theme.breakpoints.down('sm')] - Adjusts padding and font size for small screens.
 * @property {string} padding - Decrease padding inside the button.
 * @property {string} fontSize - Decrease font size of the button text.
 * @property {object} [theme.breakpoints.down('xs')] - Adjusts padding and font size for extra small screens.
 * @property {string} padding - Decrease padding inside the button.
 * @property {string} fontSize - Decrease font size of the button text.
 * @property {string} outline - Removes default outline on focus.
 * @property {string} border - Removes default border.
 * @property {string} cursor - Changes cursor to pointer on hover.
 * @property {string} transition - Smooth transition effect for hover.
 * @property {string} textDecoration - Removes underline from button text.
 * @property {object} '&:hover' - Styles for button hover state.
 * @property {object} background - Pass background color to white for hover state
 * @property {object} color - Pass text color to black for hover state
 * @property {object} color - Default white text color
 */
export const CustomButton = styled(Button)({
    minWidth: "50px",
    borderRadius: "20px",
    whiteSpace: "nowrap",
    padding: "10px 22px;",
    fontSize: "1rem",
    textAlign: "center",
    [theme.breakpoints.down('md')]: {
        padding: "7px 10px;",
        fontSize: '0.8rem',
    },
    [theme.breakpoints.down('sm')]: {
        padding: "7px 3px;",
        fontSize: '0.6rem',
    },
    [theme.breakpoints.down('xs')]: {
        padding: "5px 5px;",
        fontSize: '0.5rem',
    },
    outline: "none",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    textDecoration: "none",
    '&:hover': {
        background: "white",
        color: "black"
    },
    color: "white"
})