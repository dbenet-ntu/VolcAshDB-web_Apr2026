import { Box } from '@mui/material'
import { styled } from '@mui/styles'

export const Container = styled('div')({
	width: "80%",
	margin: "2rem auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
})

/**
 * ResultContainer style: Styles the main container for the stats page.
 * 
 * @property {string} backgroundColor - Sets the background color to white.
 * @property {string} height - Sets the height of the container to 1200px.
 */
export const ResultContainer = styled('div')({
    backgroundColor: 'white', 
    height: "1200px"
})

/**
 * title style: Styles the title section of the stats page.
 * 
 * @property {string} textAlign - Centers the title text.
 * @property {string} paddingTop - Adds top padding of 10px.
 * @property {string} paddingBottom - Removes bottom padding.
 */
export const Title = styled('div')({
    textAlign: 'center',
    paddingTop: '10px',
    paddingBottom: '0px'
})

/**
 * ChartContainer style: Styles the container for charts and statistical data.
 * 
 * @property {string} paddingTop - Adds top padding of 50px.
 * @property {string} display - Uses flexbox layout.
 * @property {string} wrap - Ensures items wrap within the container.
 * @property {string} justifyContent - Space items evenly within the container.
 * @property {string} alignItems - Aligns items in the center.
 */
export const ChartContainer = styled(Box)({
    paddingTop: '50px', 
    display: 'flex', 
    wrap: 'wrap', 
    justifyContent: "space-evenly",
    alignItems: 'center'
})

/**
 * ChartOverlay style: Styles the overlay for each chart section.
 * 
 * @property {string} color - Sets the text color to black.
 * @property {string} marginTop - Adds top margin of 20px.
 * @property {string} maxWidth - Limits the maximum width to 900px.
 * @property {string} textAlign - Centers the text within the overlay.
 * @property {string} padding - Adds padding of 1rem.
 * @property {string} backgroundColor - Sets a semi-transparent background color.
 * @property {string} borderRadius - Rounds the corners of the overlay with a radius of 5px.
 * @property {string} margin - Adds vertical margin of 1rem.
 * @property {string} boxShadow - Adds a subtle shadow for depth.
 */
export const ChartOverlay = styled('div')({
    color: "black", // Adjust the color to fit your design
    marginTop: "20px", // Creates space between the introductory text and the goal
    maxWidth: "900px", // Ensures the text does not stretch too wide
    textAlign: "center", // Centers the text
    padding: '1rem',
    backgroundColor: '#e9e9e9f7', // semi-transparent overlay for goal text
    borderRadius: '5px', // rounded corners for the text box
    margin: '1rem', // add margin top and bottom
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // subtle shadow for depth
})

/**
 * ErrorMessage Style for error messages.
 * 
 * @property {string} marginTop - Space above the error message.
 * @property {string} color - Red text color for errors.
 * @property {string} backgroundColor - Light red background.
 * @property {string} border - Red border.
 * @property {string} padding - Padding inside the message.
 * @property {string} borderRadius - Rounded corners.
 * @property {string} textAlign - Center text horizontally.
 */
export const ErrorMessage = styled('div')({
    marginTop: "20px",
    color: "#B20E27",
    backgroundColor: "rgba(178,14,39,0.2)",
    border: "1px solid #B20E27",
    padding: "5px 15px",
    borderRadius: "5px",
    textAlign: "center",
    width: "30%",
});