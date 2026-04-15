import { styled } from '@mui/styles'
import { createTheme } from '@mui/material/styles'

const theme = createTheme()

/**
 * SearchContainer style: Styles the container for the search page.
 * 
 * @property {string} backgroundColor - Sets the background color to white.
 * @property {string} width - Ensures the container takes up full width.
 * @property {string} position - Sets the position to absolute.
 * @property {string} display - Uses flexbox for layout.
 * @property {string} alignContent - Aligns the content centrally.
 * @property {string} flexDirection - Aligns child elements in a column.
 * @property {string} alignItems - Centers items horizontally.
 */
export const SearchContainer = styled('div')({
    backgroundColor: "white",
    width: "100%",
    position: "absolute",
    display: "flex",
    alignContent: "center",
    flexDirection: "column",
    alignItems: "center",
})

/**
 * SearchTitle style: Styles the title of the search section.
 * 
 * @property {string} fontWeight - Sets the font weight to bold.
 * @property {string} color - Sets the text color to a dark gray.
 * @property {string} marginBottom - Adds margin below the title.
 * @property {string} marginTop - Adds margin above the title.
 * @property {string} width - Ensures the title takes up full width.
 * @property {string} textAlign - Centers the text horizontally.
 * @property {object} [theme.breakpoints] - Applies responsive font sizes based on screen size.
 * @property {string} fontSize - Sets font size for various breakpoints:
 *   - `xl` and `lg`: 3rem
 *   - `md` and `sm`: 2rem
 *   - `xs`: 1rem
 */
export const SearchTitle = styled('h1')({
    fontWeight: "bold",
    color: '#333',
    marginBottom: '1rem',
    marginTop: '1rem',
    width: "100%",
    textAlign: 'center',
    fontSize: '2rem',
    [theme.breakpoints.down('xl')]: {
        fontSize: "3rem",
    },
    [theme.breakpoints.down('lg')]: {
        fontSize: "3rem",
    },
    [theme.breakpoints.down('md')]: {
        fontSize: "2rem",
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: "2rem",
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: "1rem",
    },
})

/**
 * Container style for result items.
 * 
 * @property {string} width - Ensures the container takes up 40% of the screen width.
 * @property {string} paddingBottom - Adds padding below the progress bar.
 */
export const ProgressBar = styled('div')({
    width: "40%",
    paddingBottom: "1rem",
})