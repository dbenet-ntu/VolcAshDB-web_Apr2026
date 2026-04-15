import { styled } from '@mui/styles'
import { createTheme } from '@mui/material/styles'
import { Box, Button} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info' 

const theme = createTheme()

export const Container = styled('div')({
	width: "80%",
	margin: "2rem auto",
})


export const FormContainer = styled(Box)({
    display: "flex",
    cursor: "pointer",
    margin: "30px 0",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderRadius: "5px",
})

export const SubmitButton = styled(Button)({
	backgroundColor: "#388e3c",
    color: 'white',
    fontWeight: 700,
    height: 40,
    padding: 'revert',
    borderRadius: "20px",
    margin: "20px 30px",
})

/**
 * infoIcon style: Styles for the info icon in the tooltip.
 * 
 * @property {string} marginLeft - Adds 5px of margin to the left of the icon.
 */
export const InfoIconRender = styled(InfoIcon)({
    marginBottom: "5px",
    marginRight: "5px"
})

/**
 * ErrorForm Style for error messages.
 * 
 * @property {string} marginTop - Space above the error message.
 * @property {string} color - Red text color for errors.
 * @property {string} backgroundColor - Light red background.
 * @property {string} border - Red border.
 * @property {string} padding - Padding inside the message.
 * @property {string} borderRadius - Rounded corners.
 * @property {string} textAlign - Center text horizontally.
 */
export const ErrorForm = styled('div')({
    marginTop: "20px",
    color: "#B20E27",
    backgroundColor: "rgba(178,14,39,0.2)",
    border: "1px solid #B20E27",
    padding: "5px 15px",
    borderRadius: "5px",
    textAlign: "center",
});

/**
 * SuccessForm Style for success messages.
 * 
 * @property {string} marginTop - Space above the success message.
 * @property {string} color - Green text color for success.
 * @property {string} backgroundColor - Light green background.
 * @property {string} border - Green border.
 * @property {string} padding - Padding inside the message.
 * @property {string} borderRadius - Rounded corners.
 * @property {string} textAlign - Center text horizontally.
 */
export const SuccessForm = styled('div')({
    marginTop: "20px",
    color: "#006837",
    backgroundColor: "rgba(0,104,55,0.2)",
    border: "1px solid #006837",
    padding: "5px 15px",
    borderRadius: "5px",
    textAlign: "center",
});

/**
 * InformationText style: Styles the text area for goals.
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
export const InformationText = styled('p')({
    color: "black", // Adjust the color to fit your design
    marginTop: "20px", // Creates space between the introductory text and the goal
    maxWidth: "900px", // Ensures the text does not stretch too wide
    textAlign: "center", // Centers the text
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent overlay for goal text
    borderRadius: '5px', // Rounded corners for the text box
    margin: '1rem', // Adds margin top and bottom
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