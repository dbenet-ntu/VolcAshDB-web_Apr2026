import { Button } from '@mui/material'

import { styled } from '@mui/styles'
import { createTheme } from '@mui/material/styles'

const theme = createTheme()

/**
 * Opinion style: Styles the container for the opinion section.
 * 
 * @property {string} marginBottom - Adds a bottom margin to the container.
 */
export const Opinion = styled('div')({
    marginBottom: '100px',
})

/**
 * formContent style: Styles individual form content containers.
 * 
 * @property {string} width - Sets the width to 100% to occupy available space.
 * @property {string} textAlign - Aligns text to the left within the container.
 * @property {string} display - Uses flexbox layout for the container.
 * @property {string} justifyContent - Distributes space between child elements.
 * @property {string} alignItems - Aligns child elements to the center vertically.
 * @property {string} marginBottom - Adds a bottom margin to each form content item.
 */
export const FormContent = styled('div')({
    width: "100%",
    textAlign: "left",
    display: 'flex', 
    justifyContent: "space-between",
    alignItems: 'center',
    marginBottom: '10px'
})

/**
 * input style: Styles input fields and selects.
 * 
 * @property {string} border - Sets a light gray border around input fields.
 * @property {string} borderRadius - Rounds the corners of input fields.
 * @property {string} padding - Adds padding inside the input fields for better spacing.
 * @property {string} marginLeft - Adds space to the left of the input fields.
 * @property {string} width - Sets the width of the input fields to 100%.
 */
export const Input = styled('input')({
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    marginLeft: "15px",
    width: "100%",
})

/**
 * input style: Styles input fields and selects.
 * 
 * @property {string} border - Sets a light gray border around input fields.
 * @property {string} borderRadius - Rounds the corners of input fields.
 * @property {string} padding - Adds padding inside the input fields for better spacing.
 * @property {string} marginLeft - Adds space to the left of the input fields.
 * @property {string} width - Sets the width of the input fields to 100%.
 */
export const Select = styled('select')({
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    marginLeft: "15px",
    width: "100%",
})

/**
 * input style: Styles input fields and selects.
 * 
 * @property {string} border - Sets a light gray border around input fields.
 * @property {string} borderRadius - Rounds the corners of input fields.
 * @property {string} padding - Adds padding inside the input fields for better spacing.
 * @property {string} marginLeft - Adds space to the left of the input fields.
 * @property {string} width - Sets the width of the input fields to 100%.
 */
export const TextArea = styled('textarea')({
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    marginLeft: "15px",
    width: "100%",
})

/**
 * FilterButton style: Styles the submit button.
 * 
 * @property {string} width - Sets the button width to 100%.
 * @property {string} backgroundColor - Sets the button background color.
 * @property {string} fontWeight - Makes the button text bold.
 * @property {string} height - Sets the height of the button.
 * @property {string} borderRadius - Rounds the corners of the button.
 * @property {string} color - Sets the button text color.
 * @property {string} margin - Adds vertical margin to center the button.
 * @property {object} [theme.breakpoints] - Applies responsive font sizes based on screen size.
 * @property {string} fontSize - Sets font size for various breakpoints:
 *   - `xl`, `lg` and `md`: 1rem
 *   - `sm`: 0.8rem
 *   - `xs`: 0.6rem
 */
export const FilterButton = styled(Button)({
    width: '100%',
    backgroundColor:"#388e3c",
    fontWeight:700,
    height:40,
    borderRadius:"20px",
    color:"white",
    margin: "20px auto",
    [theme.breakpoints.down('xl')]: {
        fontSize: '1rem'
    },
    [theme.breakpoints.down('lg')]: {
        fontSize: '1rem'
    },
    [theme.breakpoints.down('md')]: {
        fontSize: '1rem'
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem'
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: '0.8rem',
    }
})

/**
 * error style: Styles the error message display.
 * 
 * @property {string} marginTop - Adds space above the error message.
 * @property {string} color - Sets the text color to a red shade.
 * @property {string} backgroundColor - Sets a light red background color with opacity.
 * @property {string} border - Adds a red border around the error message.
 * @property {string} padding - Adds padding inside the error message box.
 * @property {string} borderRadius - Rounds the corners of the error message box.
 * @property {string} textAlign - Centers the text inside the error message box.
 */
export const Error = styled('div')({
    marginTop: "20px",
    color: "#B20E27",
    backgroundColor: "rgba(178,14,39,0.2)",
    border: "1px solid #B20E27",
    padding: "5px 15px",
    borderRadius: "5px",
    textAlign: "center"
})

/**
 * success style: Styles the success message display.
 * 
 * @property {string} marginTop - Adds space above the success message.
 * @property {string} color - Sets the text color to a green shade.
 * @property {string} backgroundColor - Sets a light green background color with opacity.
 * @property {string} border - Adds a green border around the success message.
 * @property {string} padding - Adds padding inside the success message box.
 * @property {string} borderRadius - Rounds the corners of the success message box.
 * @property {string} textAlign - Centers the text inside the success message box.
 */
export const Success = styled('div')({
    marginTop: "20px",
    color: "#006837",
    backgroundColor: "rgba(0,104,55,0.2)",
    border: "1px solid #006837",
    padding: "5px 15px",
    borderRadius: "5px",
    textAlign: "center"
})