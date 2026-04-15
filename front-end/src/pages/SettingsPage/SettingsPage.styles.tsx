import { styled } from '@mui/styles'
import { createTheme } from '@mui/material/styles'
import { Button } from "@mui/material"

const theme = createTheme()

/**
 * Container style: Styles the outer container for the SettingsPage component.
 * 
 * @property {string} marginTop - Creates space between the top of the page and the content.
 * @property {string} display - Uses flexbox to center the content horizontally.
 * @property {string} justifyContent - Centers the form horizontally within the container.
 */
export const Container = styled('div')({
    marginTop: "100px", // Creates space between the introductory text and the form
    display: "flex",
    justifyContent: "center",
})

/**
 * form style: Styles the form container on the SettingsPage.
 * 
 * @property {string} display - Uses flexbox for layout.
 * @property {string} flexDirection - Aligns child elements vertically.
 * @property {string} alignItems - Centers the form elements horizontally.
 * @property {string} backgroundColor - Sets the background color of the form.
 * @property {string} borderRadius - Rounds the corners of the form.
 * @property {string} boxShadow - Adds a shadow effect to the form.
 * @property {string} padding - Adds padding inside the form.
 * @property {string} width - Sets the form width.
 * @property {object} [theme.breakpoints.down('xs')] - Adjusts form width for extra-small screens.
 */
export const Form = styled('form')({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    width: "400px",
    [theme.breakpoints.down('xs')]: {
        width: "300px",
    },
})

/**
 * h3 style: Styles the header inside the form.
 * 
 * @property {string} fontWeight - Makes the header text bold.
 * @property {string} marginBottom - Adds space below the header.
 */
export const Title = styled('h3')({
    fontWeight: "bold",
    marginBottom: "20px",
})

/**
 * formContent style: Styles each form content block.
 * 
 * @property {string} width - Ensures the content spans the full width.
 * @property {string} textAlign - Aligns text to the left.
 * @property {string} display - Uses flexbox for layout.
 * @property {string} justifyContent - Distributes space between child elements.
 * @property {string} alignItems - Aligns items to the baseline.
 */
export const FormContent = styled('div')({
    width: "100%",
    textAlign: "left", // Aligns form content to the left
    display: 'flex', 
    justifyContent: "space-between",
    alignItems: 'baseline',
})

/**
 * input style: Styles input fields and select elements within the form.
 * 
 * @property {string} border - Adds a border around the input fields.
 * @property {string} borderRadius - Rounds the corners of the input fields.
 * @property {string} padding - Adds padding inside the input fields.
 * @property {string} marginBottom - Adds space below each input field.
 * @property {string} marginLeft - Adds space to the left of the input fields.
 * @property {string} width - Sets the width of the input fields to 100%.
 */
export const Input = styled('input')({
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
    marginLeft: "15px",
    width: "100%",
})

/**
 * input style: Styles input fields and select elements within the form.
 * 
 * @property {string} border - Adds a border around the input fields.
 * @property {string} borderRadius - Rounds the corners of the input fields.
 * @property {string} padding - Adds padding inside the input fields.
 * @property {string} marginBottom - Adds space below each input field.
 * @property {string} marginLeft - Adds space to the left of the input fields.
 * @property {string} width - Sets the width of the input fields to 100%.
 */
export const Select = styled('select')({
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
    marginLeft: "15px",
    width: "100%",
})

/**
 * button style: Styles the submit button in the form.
 * 
 * @property {string} backgroundColor - Sets the button's background color.
 * @property {string} color - Sets the text color of the button.
 * @property {string} marginTop - Adds space above the button.
 * @property {string} padding - Adds padding inside the button.
 * @property {string} alignSelf - Centers the button horizontally within its container.
 * @property {string} borderRadius - Rounds the corners of the button.
 * @property {string} transition - Smoothens background color change on hover.
 * @property {object} "&:hover" - Changes background color when hovered over.
 * @property {string} border - Removes the default border of the button.
 */
export const SubmitButton = styled(Button)({
    backgroundColor: "#3f51b5",
    color: "white",
    marginTop: "20px",
    padding: "5px 15px",
    alignSelf: "center",
    borderRadius: "5px",
    transition: "background-color 0.3s",
    "&:hover": {
        backgroundColor: "#234681",
    },
    border: 0,
})

/**
 * error style: Styles the error message displayed after form submission.
 * 
 * @property {string} marginTop - Adds space above the error message.
 * @property {string} color - Sets the text color for error messages.
 * @property {string} backgroundColor - Sets the background color for error messages.
 * @property {string} border - Adds a border around the error message.
 * @property {string} padding - Adds padding inside the error message box.
 * @property {string} borderRadius - Rounds the corners of the error message box.
 * @property {string} textAlign - Centers the text within the error message box.
 */
export const Error = styled('div')({
    marginTop: "20px",
    color: "#B20E27",
    backgroundColor: "rgba(178,14,39,0.2)",
    border: "1px solid #B20E27",
    padding: "5px 15px",
    borderRadius: "5px",
    textAlign: "center",
})

/**
 * success style: Styles the success message displayed after successful form submission.
 * 
 * @property {string} marginTop - Adds space above the success message.
 * @property {string} color - Sets the text color for success messages.
 * @property {string} backgroundColor - Sets the background color for success messages.
 * @property {string} border - Adds a border around the success message.
 * @property {string} padding - Adds padding inside the success message box.
 * @property {string} borderRadius - Rounds the corners of the success message box.
 * @property {string} textAlign - Centers the text within the success message box.
 */
export const Success = styled('div')({
    marginTop: "20px",
    color: "#006837",
    backgroundColor: "rgba(0,104,55,0.2)",
    border: "1px solid #006837",
    padding: "5px 15px",
    borderRadius: "5px",
    textAlign: "center",
})