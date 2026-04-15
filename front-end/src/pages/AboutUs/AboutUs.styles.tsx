import { Link } from '@mui/material'
import { styled } from '@mui/styles'
import { createTheme } from '@mui/material/styles'
import { Box } from '@mui/material'

const theme = createTheme()

/**
 * AboutUsContainer for the main container of the AboutUs component.
 * 
 * @property {string} backgroundColor - Background color of the container.
 * @property {string} color - Text color, adjusted to fit design requirements.
 * @property {string} textAlign - Aligns text to the left.
 * @property {string} padding - Padding around the content.
 * @property {string} borderRadius - Rounded corners for the container.
 * @property {object} [theme.breakpoints.down('md')] - Responsive font size for medium screens and smaller.
 * @property {string} fontSize - Set font size.
 * @property {object} [theme.breakpoints.down('sm')] - Responsive font size for small screens and smaller.
 * @property {string} fontSize - Maintain the same font size.
 * @property {object} [theme.breakpoints.down('xs')] - Responsive font size for extra-small screens.
 * @property {string} fontSize - Decrease font size.
 */
export const AboutUsContainer = styled('div')({
    backgroundColor: "white",
    color: "black",
    textAlign: "left",
    padding: '1rem',
    borderRadius: '5px',
    [theme.breakpoints.down('md')]: {
        fontSize: "1rem",
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: "1rem",
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: "0.8rem",
    },
})


/**
 * Styles for the footer section within the AboutUs component.
 * 
 * @param {object} theme - The Material-UI theme object for responsive design.
 * @returns {object} - The styles object for the AboutUs component.
 */
export const Footer = styled('div')({
    display: "flex",
    justifyContent: "center",
})


/**
 * Styles for legal information links in the footer.
 * 
 * @property {string} paddingRight - Space between legal information links.
 */
export const CustomLinkLegalInformation = styled(Link)({
    paddingRight: "10px"
})


/**
 * CustomImage: Styles images within the application.
 * 
 * @property {string} width - Sets width to auto to maintain aspect ratio.
 * @property {string} marginBottom - Adds space below the image.
 * @property {object} [theme.breakpoints] - Applies responsive height based on screen size.
 * @property {string} [theme.breakpoints.down] - Adjusts image height for different breakpoints:
 *   - `xl`, `lg`: 300px height
 *   - `md`: 200px height
 *   - `sm`: 160px height
 *   - `xs`: 80px height
 */
export const CustomImage = styled('img')({
    width: 'auto', // Sets width to auto to maintain aspect ratio
    marginBottom: "16px", // Adds space below the image
    [theme.breakpoints.down('xl')]: {
        height: '300px',
    },
    [theme.breakpoints.down('lg')]: {
        height: '300px',
    },
    [theme.breakpoints.down('md')]: {
        height: '200px',
    },
    [theme.breakpoints.down('sm')]: {
        height: '160px',
    },
    [theme.breakpoints.down('xs')]: {
        height: '80px',
    },
})


/**
 * TableContainer: Container style for the table.
 * 
 * @property {string} overflowX - Enables horizontal scrolling for large tables.
 * @property {string} display - Uses flexbox layout for centering the table.
 * @property {string} justifyContent - Centers the table horizontally within the container.
 */
export const TableContainer = styled('div')({
    overflowX: 'auto', // Enables horizontal scrolling for large tables
    display: 'flex', // Uses flexbox layout for centering the table
    justifyContent: 'center', // Centers the table horizontally within the container
})


/**
 * tableStyle: Style for the table.
 * 
 * @property {string} width - Sets the table width to 80% of its parent container.
 * @property {string} borderCollapse - Collapses table borders for a unified look.
 * @property {string} textAlign - Aligns text to the left within table cells.
 */
export const TableStyle = styled('table')({
    width: '80%', // Sets the table width to 80% of its parent container
    borderCollapse: 'collapse', // Collapses table borders for a unified look
    textAlign: 'left', // Aligns text to the left within table cells
})

/**
 * ThStyle: Style for the table header cells.
 * 
 * @property {string} padding - Adds padding inside the header cells for spacing.
 * @property {string} backgroundColor - Sets the background color of the header cells to a light grey.
 */
export const ThStyle = styled('th')({
    padding: '8px', // Adds padding inside the header cells for spacing
    backgroundColor: '#f0f0f0', // Sets the background color of the header cells to a light grey
})

/**
 * TdStyle: Style for the table data cells.
 * 
 * @property {string} padding - Adds padding inside the data cells for spacing.
 */
export const TdStyle = styled('td')({
    padding: '8px', // Adds padding inside the data cells for spacing
})

/**
 * CodeBlock: Styled code block component using MUI's Box.
 * 
 * @param {string} children - The code string to be displayed.
 * @returns {JSX.Element} - A styled <pre><code> block for displaying code snippets.
 */
export const CodeBlock = styled(Box)({
    backgroundColor: '#1e1e1e',
    color: '#dcdcdc',
    padding: 2,
    borderRadius: 2,
    overflowX: 'auto',
    fontSize: '0.875rem',
    fontFamily: 'Source Code Pro, monospace',
    marginTop: 1,
    marginBottom: 2,
})
