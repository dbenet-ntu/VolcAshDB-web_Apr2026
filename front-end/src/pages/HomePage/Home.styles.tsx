import { Button, Typography } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import PieChartIcon from '@mui/icons-material/PieChart'
import ArchitectureIcon from '@mui/icons-material/Architecture'
import InfoIcon from '@mui/icons-material/Info'

import { styled } from '@mui/styles'

import { createTheme } from '@mui/material/styles'

const theme = createTheme()

/**
 * BodyContainer style: Styles the container for the main body content.
 * 
 * @property {string} backgroundColor - Sets the background color to white.
 * @property {string} display - Uses flexbox layout for centering content.
 * @property {string} justifyContent - Centers content horizontally.
 */
export const BodyContainer = styled('div')({
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
})

/**
 * BodyContent style: Styles the main content area.
 * 
 * @property {string} maxWidth - Sets a maximum width for the content.
 * @property {string} position - Positions the content absolutely.
 * @property {string} padding - Adds padding to the top and bottom.
 * @property {string} display - Uses flexbox layout for alignment.
 * @property {string} flexDirection - Arranges items in a column.
 * @property {string} alignItems - Centers items horizontally.
 */
export const BodyContent = styled('div')({
    maxWidth: "1200px",
    position: "absolute",
    padding: "8px 0px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
})

/**
 * titleWithBadges style: Styles the container for title and badges.
 * 
 * @property {string} display - Uses flexbox layout for alignment.
 * @property {string} justifyContent - Distributes space between badges and text.
 * @property {string} alignItems - Aligns items vertically in the center.
 * @property {string} flexWrap - Allows content to wrap for responsiveness.
 */
export const TitleWithBadges = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center', // Align badges and text vertically
    flexWrap: 'wrap', // Ensure responsiveness
})

/**
 * IPGP_logo style: Styles the IPGP logo.
 * 
 * @property {string} width - Sets the width of the logo.
 * @property {string} height - Maintains aspect ratio.
 * @property {string} paddingLeft - Adds space to the left of the logo.
 * @property {object} [theme.breakpoints] - Applies responsive styles based on screen size.
 * @property {string} [theme.breakpoints.down] - Adjusts padding and width for different breakpoints:
 *   - `xl`, `lg`, `md`: 180px width, 80px paddingLeft
 *   - `sm`: 130px width, 40px paddingLeft
 *   - `xs`: 130px width, 70px paddingLeft
 */
export const IPGPLogo = styled('img')({
    width: '100px', // Adjust based on your actual badge size
    height: 'auto', // Maintain aspect ratio
    [theme.breakpoints.down('xl')]: {
        paddingLeft: '80px',
        width: '180px',
    },
    [theme.breakpoints.down('lg')]: {
        paddingLeft: '80px',
        width: '180px',
    },
    [theme.breakpoints.down('md')]: {
        paddingLeft: '80px',
        width: '180px',
    },
    [theme.breakpoints.down('sm')]: {
        paddingLeft: '40px',
        width: '130px',
    },
    [theme.breakpoints.down('xs')]: {
        paddingLeft: '70px',
        width: '130px',
    },
})

/**
 * EOS_logo style: Styles the EOS logo.
 * 
 * @property {string} paddingRight - Adds space to the right of the logo.
 * @property {string} width - Sets the width of the logo.
 * @property {string} height - Maintains aspect ratio.
 * @property {object} [theme.breakpoints] - Applies responsive styles based on screen size.
 * @property {string} [theme.breakpoints.down] - Adjusts padding and width for different breakpoints:
 *   - `xl`, `lg`, `md`: 280px width, 80px paddingRight
 *   - `sm`: 200px width, 40px paddingRight
 *   - `xs`: 200px width, 70px paddingRight
 */
export const EOSLogo = styled('img')({
    paddingRight: '8px',
    width: '200px', // Adjust based on your actual badge size
    height: 'auto', // Maintain aspect ratio
    [theme.breakpoints.down('xl')]: {
        paddingRight: '80px',
        width: '280px',
    },
    [theme.breakpoints.down('lg')]: {
        paddingRight: '80px',
        width: '280px',
    },
    [theme.breakpoints.down('md')]: {
        paddingRight: '80px',
        width: '280px',
    },
    [theme.breakpoints.down('sm')]: {
        paddingRight: '40px',
        width: '200px',
    },
    [theme.breakpoints.down('xs')]: {
        paddingRight: '70px',
        width: '200px',
    },
})

/**
 * mainHeading style: Styles the main heading text.
 * 
 * @property {string} fontWeight - Makes the heading text bold.
 * @property {string} color - Sets the text color.
 * @property {string} marginBottom - Adds space below the heading.
 * @property {string} marginTop - Adds space above the heading.
 * @property {string} width - Ensures the heading takes full width.
 * @property {object} [theme.breakpoints] - Applies responsive font sizes and text alignment based on screen size.
 * @property {string} [theme.breakpoints.down] - Adjusts font size and text alignment for different breakpoints:
 *   - `xl`, `lg`: 3rem font size, center text alignment
 *   - `md`, `sm`: 2rem font size, center text alignment
 *   - `xs`: 1rem font size, center text alignment
 */
export const MainHeading = styled('h3')({
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1rem',
    marginTop: '1rem',
    width: "100%",
    textAlign: 'center',
    fontSize: "3rem",
    [theme.breakpoints.down('xl')]: {
        fontSize: "3rem",
        textAlign: 'center',
    },
    [theme.breakpoints.down('lg')]: {
        fontSize: "3rem",
        textAlign: 'center',
    },
    [theme.breakpoints.down('md')]: {
        fontSize: "2rem",
        textAlign: 'center',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: "2rem",
        textAlign: 'center',
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: "1rem",
        textAlign: 'center',
    },
})

/**
 * GoalText style: Styles the text area for goals.
 * 
 * @property {string} color - Sets the text color.
 * @property {string} marginTop - Adds space above the text.
 * @property {string} maxWidth - Limits the width of the text container.
 * @property {string} textAlign - Centers the text.
 * @property {string} padding - Adds padding inside the text container.
 * @property {string} backgroundColor - Sets a semi-transparent background color.
 * @property {string} borderRadius - Rounds the corners of the container.
 * @property {string} margin - Adds vertical margin.
 * @property {string} boxShadow - Adds a shadow for visual depth.
 * @property {object} [theme.breakpoints] - Applies responsive font sizes and max width based on screen size.
 * @property {string} [theme.breakpoints.down] - Adjusts font size and max width for different breakpoints:
 *   - `xl`, `lg`: 1rem font size, 900px max width
 *   - `md`: 1rem font size, 700px max width
 *   - `sm`: 1rem font size, 500px max width
 *   - `xs`: 0.8rem font size, 300px max width
 */
export const GoalText = styled(Typography)({
    color: "black", // Adjust the color to fit your design
    marginTop: "20px", // Creates space between the introductory text and the goal
    maxWidth: "900px", // Ensures the text does not stretch too wide
    textAlign: "center", // Centers the text
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent overlay for goal text
    borderRadius: '5px', // Rounded corners for the text box
    margin: '1rem 0', // Adds margin top and bottom
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    [theme.breakpoints.down('xl')]: {
        fontSize: "1rem",
        textAlign: 'center',
    },
    [theme.breakpoints.down('lg')]: {
        fontSize: "1rem",
        textAlign: 'center',
    },
    [theme.breakpoints.down('md')]: {
        fontSize: "1rem",
        textAlign: 'center',
        maxWidth: "700px", // Reduces max width for smaller screens
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: "1rem",
        textAlign: 'center',
        maxWidth: "500px", // Further reduces max width
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: "0.8rem",
        textAlign: 'center',
        maxWidth: "300px", // Narrowest width for smallest screens
    },
})

/**
 * BodyBtn style: Styles the container for buttons within the body.
 * 
 * @property {string} marginTop - Adds space above the button container.
 * @property {string} display - Uses flexbox layout for alignment.
 * @property {string} flexDirection - Arranges buttons in a column.
 * @property {string} alignItems - Centers the buttons horizontally.
 * @property {string} marginBottom - Adds space below the button container.
 */
export const BodyButton = styled('div')({
    marginTop: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
})

 /**
 * Btn style: Styles general button elements.
 * 
 * @property {string} background - Sets the button background color.
 * @property {string} borderRadius - Rounds the corners of the button.
 * @property {string} whiteSpace - Prevents text wrapping within the button.
 * @property {string} padding - Adds padding inside the button.
 * @property {string} fontSize - Sets the font size of the button text.
 * @property {string} outline - Removes the default outline.
 * @property {string} border - Removes the default border.
 * @property {string} cursor - Changes the cursor to a pointer on hover.
 * @property {string} transition - Adds smooth transition effects for hover state.
 * @property {string} textDecoration - Ensures no text decoration (e.g., underline).
 * @property {object} [theme.breakpoints] - Applies responsive font sizes based on screen size.
 * @property {string} [theme.breakpoints.down] - Adjusts font size for different breakpoints:
 *   - `sm`: 0.8rem font size
 *   - `xs`: 0.5rem font size
 * @property {string} '&:hover' - Styles for button hover state:
 *   - `background`: Changes background color
 *   - `color`: Changes text color
 *   - `transform`: Scales the button
 *   - `boxShadow`: Adds a shadow effect
 */
export const ButtonRender = styled(Button)({
    background: "#0c4aad",
    borderRadius: "10px",
    whiteSpace: "nowrap",
    padding: "10px 22px",
    fontSize: "16px",
    outline: "none",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out", // Smooth transition effect
    textDecoration: "none",
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem', // Reduces font size for smaller screens
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: '0.5rem', // Further reduces font size for extra small screens
    },
    '&:hover': {
        background: "#1976d2", // Slightly lighter color on hover
        color: "white",
        transform: 'scale(1.1)', // Scales the button on hover
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)' // Shadow effect on hover
    },
    color: "white",
})

/**
 * BodyOption style: Styles the container for body options or elements.
 * 
 * @property {string} display - Uses flexbox layout for alignment.
 * @property {string} justifyContent - Distributes space evenly between child elements.
 * @property {string} width - Ensures the container takes full width.
 * @property {string} alignItems - Aligns items vertically in the center.
 * @property {string} flexWrap - Ensures responsiveness by wrapping items as needed.
 * @property {string} marginBottom - Adds space below the container.
 */
export const LinkOptions = styled('div')({
    marginTop: "50px",
    display: "flex",
    justifyContent: "space-evenly",
    width: '100%',
    alignItems: 'flex-start', // Aligns items vertically
    flexWrap: 'wrap', // Ensures responsiveness
    marginBottom: '50px',
})

/**
 * iconStyle style: Styles icons within the application.
 * 
 * @property {string} width - Sets width to auto to maintain aspect ratio.
 * @property {string} marginBottom - Adds space below the icon.
 */
export const LinkContainer = styled('div')({
    textAlign: 'center',
    marginBottom: "30px", // Adds space below the icon
})

/**
 * iconStyle style: Styles icons within the application.
 * 
 * @property {string} width - Sets width to auto to maintain aspect ratio.
 * @property {string} marginBottom - Adds space below the icon.
 */
export const InfoIconStyle = styled(InfoIcon)({
    color: "white",
    fontSize: "xx-large",
    marginRight: "10px", // Adds space below the icon
})


/**
 * iconStyle style: Styles icons within the application.
 * 
 * @property {string} width - Sets width to auto to maintain aspect ratio.
 * @property {string} marginBottom - Adds space below the icon.
 */
export const MenuBookIconStyle = styled(MenuBookIcon)({
    color: "white",
    fontSize: "xx-large",
    marginRight: "10px", // Adds space below the icon
})

/**
 * iconStyle style: Styles icons within the application.
 * 
 * @property {string} width - Sets width to auto to maintain aspect ratio.
 * @property {string} marginRight - Adds space below the icon.
 */
export const PieChartIconStyle = styled(PieChartIcon)({
    color: "white",
    fontSize: "xx-large",
    marginRight: "10px", // Adds space below the icon
})

/**
 * iconStyle style: Styles icons within the application.
 * 
 * @property {string} width - Sets width to auto to maintain aspect ratio.
 * @property {string} marginRight - Adds space below the icon.
 */
export const ArchitectureIconStyle = styled(ArchitectureIcon)({
    color: "white",
    fontSize: "xx-large",
    marginRight: "10px", // Adds space below the icon
})



/**
 * descriptionText style: Styles the description text.
 * 
 * @property {string} color - Sets the text color.
 * @property {string} display - Ensures the text appears on a new line.
 * @property {string} textAlign - Centers the text.
 * @property {string} fontSize - Sets the font size of the text.
 * @property {string} marginTop - Adds space above the description text.
 */
export const DescriptionText = styled('span')({
    color: "#0c4aad", // Sets the color for the description text
    display: "block", // Ensures the text appears on a new line
    textAlign: "center", // Centers the text
    fontSize: "1rem", // Sets the size of the font
    marginTop: "0.5rem", // Space above the description text
})

/**
 * publicationsContainer style: Styles the container for publications.
 * 
 * @property {string} color - Sets the text color.
 * @property {string} marginTop - Adds space above the container.
 * @property {string} maxWidth - Limits the width of the container.
 * @property {string} textAlign - Aligns text within the container.
 * @property {string} padding - Adds padding inside the container.
 * @property {string} backgroundColor - Sets a semi-transparent background color.
 * @property {string} borderRadius - Rounds the corners of the container.
 * @property {string} boxShadow - Adds a shadow for visual depth.
 * @property {object} [theme.breakpoints] - Applies responsive font sizes and max width based on screen size.
 * @property {string} [theme.breakpoints.down] - Adjusts font size and max width for different breakpoints:
 *   - `md`: 1rem font size, 700px max width
 *   - `sm`: 1rem font size, 500px max width
 *   - `xs`: 0.8rem font size, 300px max width
 */
export const PublicationsContainer = styled('span')({
    color: "black", // Adjust the color to fit your design
    marginTop: "7rem", // Adds space above the container
    maxWidth: "1200px", // Ensures the container does not stretch too wide
    textAlign: "left", // Aligns text to the left
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent overlay
    borderRadius: '5px', // Rounded corners for the container
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    [theme.breakpoints.down('md')]: {
        fontSize: "1rem",
        maxWidth: "700px", // Reduces max width for smaller screens
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: "1rem",
        maxWidth: "500px", // Further reduces max width
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: "0.8rem",
        maxWidth: "300px", // Narrowest width for extra small screens
    },
})

 /**
 * LatestPublications style: Styles the container for the list of latest publications.
 * 
 * @property {string} marginTop - Adds space above the container.
 * @property {string} borderRadius - Rounds the corners of the container.
 * @property {object} '& ul' - Styles the unordered list:
 *   - `listStyleType`: Removes the default list bullet.
 *   - `padding`: Sets padding to 0.
 *   - `margin`: Sets margin to 0 to ensure no default margin.
 * @property {object} '& li' - Styles list items within the container:
 *   - `marginBottom`: Adds space between list items.
 *   - `& strong`: Styles strong elements (e.g., bold years):
 *     - `fontWeight`: Ensures the year is bold.
 *     - `marginRight`: Adds space after the year.
 *   - `& em`: Styles emphasized elements (e.g., italicized journal names):
 *     - `fontStyle`: Optionally italicizes journal names or other text.
 * @property {object} '& a' - Styles links within the container:
 *   - `color`: Sets the link color.
 *   - `textDecoration`: Removes underline from links.
 *   - `&:hover`: Styles for hover state:
 *     - `textDecoration`: Adds underline on hover.
 * @property {object} [theme.breakpoints] - Applies responsive font sizes and max width based on screen size.
 * @property {string} [theme.breakpoints.down] - Adjusts font size and max width for different breakpoints:
 *   - `md`: 1rem font size, 700px max width
 *   - `sm`: 1rem font size, 500px max width
 *   - `xs`: 0.8rem font size, 300px max width
 */
export const LatestPublications = styled('div')({
    marginTop: '1rem', // Adds space from the top
    borderRadius: '5px', // Rounds the corners of the container
    // Add styles for the unordered list
    '& ul': {
        listStyleType: 'none', // Removes the default list bullet
        padding: 0, // Removes default padding
        margin: 0, // Removes default margin
    },
    // Add styles for the list items
    '& li': {
        marginBottom: '10px', // Adds space between list items
        '& strong': {
            fontWeight: 'bold', // Ensures the year is bold
            marginRight: '5px', // Adds space after the year
        },
        '& em': {
            fontStyle: 'italic', // Optionally italicizes journal names or other text
        },
    },
    // Add styles for the links
    '& a': {
        color: '#007bff', // Sets the link color
        textDecoration: 'none', // Removes underline from links
        '&:hover': {
            textDecoration: 'underline', // Adds underline on hover
        },
    },
    [theme.breakpoints.down('md')]: {
        fontSize: "1rem", // Adjusts font size for medium screens
        maxWidth: "700px", // Limits width for medium screens
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: "1rem", // Adjusts font size for small screens
        maxWidth: "500px", // Limits width for small screens
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: "0.8rem", // Adjusts font size for extra small screens
        maxWidth: "300px", // Limits width for extra small screens
    },
})