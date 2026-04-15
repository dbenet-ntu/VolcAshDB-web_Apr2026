import { Typography } from '@mui/material'
import { styled } from '@mui/styles'
import { createTheme } from '@mui/material/styles'

const theme = createTheme()

/**
 * CustomTypography: Styles for the main text content in the Legal component.
 * 
 * @property {string} color - Sets text color to black.
 * @property {string} marginTop - Adds space above the text content.
 * @property {string} padding - Adds padding inside the text container.
 * @property {string} backgroundColor - Sets a semi-transparent background.
 * @property {string} borderRadius - Adds rounded corners to the text container.
 * @property {string} margin - Adds vertical margin to separate text blocks.
 * @property {string} marginLeft - Adds left margin to Typography components.
 */
export const CustomTypography = styled(Typography)({
    color: "black",
    marginTop: "20px",
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '5px',
    margin: '1rem 0',
    marginLeft: '50px',
})


/**
 * Container: Styles the main container of the Legal component.
 * 
 * @property {string} backgroundColor - Sets background color to white.
 * @property {string} color - Sets text color to black.
 * @property {string} textAlign - Aligns text to the left.
 * @property {string} padding - Adds padding around the content.
 * @property {string} display - Uses flexbox for layout.
 * @property {string} justifyContent - Centers content horizontally.
 * @property {object} [theme.breakpoints.down('md')] - Adjusts font size for medium screens and below.
 * @property {string} fontSize - Set font size.
 * @property {object} [theme.breakpoints.down('sm')] - Adjusts font size for small screens and below.
 * @property {string} fontSize - Maintain the same font size.
 * @property {object} [theme.breakpoints.down('xs')] - Adjusts font size for extra small screens.
 * @property {string} fontSize - Decrease font size.
 * @property {string} borderRadius - Adds rounded corners to the container.
 */
export const Container = styled('div')({
    backgroundColor: "white", // Sets background color to white
    color: "black",
    textAlign: "left",
    padding: '1rem',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
        fontSize: "1rem",
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: "1rem",
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: "0.8rem",
    },
    borderRadius: '5px',
})


/**
 * LegalContainer: Sets width of the container holding legal information.
 * 
 * @property {string} width - Sets width to 70% of the parent container.
 */
export const LegalContainer = styled('div')({
    width: '70%',
})


/**
 * Title: Styles for titles within the Legal component.
 * 
 * @property {string} textAlign - Centers the title text.
 * @property {string} marginBottom - Adds space below the title.
 * @property {string} padding - Adds padding around the title.
 */
export const Title = styled('h2')({
    textAlign: 'center',
    marginBottom: '20px',
    padding: '10px',
})

/**
 * Li: Styles list items within the Legal component.
 * 
 * @property {string} marginBottom - Adds space below each list item.
 */
export const Li = styled('li')({
    marginBottom: '10px',
})