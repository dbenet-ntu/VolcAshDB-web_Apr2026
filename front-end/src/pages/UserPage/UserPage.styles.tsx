import { styled } from '@mui/styles'
import { createTheme } from '@mui/material/styles'
import { Button } from '@mui/material'

const theme = createTheme()

/**
 * Container style: Styles the main container for the UserPage component.
 * 
 * @property {string} marginTop - Creates space between the top of the page and the content.
 * @property {string} display - Uses flexbox to center content.
 * @property {string} justifyContent - Centers the content horizontally.
 */
export const Container = styled('div')({
    marginTop: "100px", // Creates space between the top of the page and the content
    display: "flex", // Flexbox layout to center content
    justifyContent: "center", // Center content horizontally
})

/**
 * Form style: Styles the form element in the UserPage.
 * 
 * @property {string} display - Uses flexbox for layout of form elements.
 * @property {string} flexDirection - Stacks form elements vertically.
 * @property {string} alignItems - Centers form elements horizontally.
 * @property {string} backgroundColor - Sets the background color of the form.
 * @property {string} borderRadius - Rounds the corners of the form.
 * @property {string} boxShadow - Adds a subtle shadow for depth.
 * @property {string} padding - Adds padding inside the form.
 * @property {string} width - Sets the width of the form.
 * @property {object} [theme.breakpoints.down('xs')] - Adjusts the form width on extra-small screens.
 */
export const Form = styled('form')({
    display: "flex", // Flexbox layout for the form
    flexDirection: "column", // Stack form elements vertically
    alignItems: "center", // Center form elements horizontally
    backgroundColor: "#fff", // White background for the form
    borderRadius: "5px", // Rounded corners for the form
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
    padding: "20px", // Space inside the form
    width: "400px", // Fixed width for the form
    [theme.breakpoints.down('xs')]: {
      width: "300px", // Adjust width for extra-small screens
    },
})

/**
 * Heading style: Styles the heading (h3) element within the form.
 * 
 * @property {string} fontWeight - Sets the font weight to bold.
 * @property {string} marginBottom - Adds space below the heading.
 */
export const Title = styled('h3')({
    fontWeight: "bold", // Bold font for the heading
    marginBottom: "20px", // Space below the heading
})

/**
 * FormContent style: Styles the container for each form input group.
 * 
 * @property {string} width - Ensures the content takes up the full width of the form.
 * @property {string} textAlign - Aligns text to the left.
 * @property {string} display - Uses flexbox for layout of form content.
 * @property {string} justifyContent - Distributes space between items.
 * @property {string} alignItems - Aligns items to the baseline of text.
 */
export const FormContent = styled('div')({
    width: "100%", // Full width for form content
    textAlign: "left", // Align text to the left
    display: 'flex', // Flexbox layout for form content
    justifyContent: "space-between", // Space out items horizontally
    alignItems: 'baseline' // Align items to the baseline of text
})

/**
 * Input style: Styles form input elements.
 * 
 * @property {string} border - Sets a light gray border around inputs.
 * @property {string} borderRadius - Rounds the corners of the input fields.
 * @property {string} padding - Adds space inside the input fields.
 * @property {string} marginBottom - Adds space below each input field.
 * @property {string} marginLeft - Adds space to the left of each input field.
 * @property {string} width - Ensures the input fields take up the full width.
 */
export const Input = styled('input')({
    border: "1px solid #ccc", // Light gray border for inputs
    borderRadius: "5px", // Rounded corners for inputs
    padding: "10px", // Space inside the input
    marginBottom: "10px", // Space below each input
    marginLeft: "15px", // Space to the left of each input
    width: "100%", // Full width for inputs
})

/**
 * Styles form select elements.
 * 
 * @property {string} border - Sets a light gray border around inputs.
 * @property {string} borderRadius - Rounds the corners of the input fields.
 * @property {string} padding - Adds space inside the input fields.
 * @property {string} marginBottom - Adds space below each input field.
 * @property {string} marginLeft - Adds space to the left of each input field.
 * @property {string} width - Ensures the input fields take up the full width.
 */
export const Select = styled('select')({
    border: "1px solid #ccc", // Light gray border for inputs
    borderRadius: "5px", // Rounded corners for inputs
    padding: "10px", // Space inside the input
    marginBottom: "10px", // Space below each input
    marginLeft: "15px", // Space to the left of each input
    width: "100%", // Full width for inputs
})

/**
 * Button style: Styles the submit button.
 * 
 * @property {string} backgroundColor - Sets the background color of the button.
 * @property {string} color - Sets the text color of the button.
 * @property {string} marginTop - Adds space above the button.
 * @property {string} padding - Adds space inside the button.
 * @property {string} alignSelf - Centers the button horizontally within its container.
 * @property {string} borderRadius - Rounds the corners of the button.
 * @property {string} transition - Adds a smooth transition effect on hover.
 * @property {object} "&:hover" - Styles applied when the button is hovered over.
 * @property {string} border - Removes the default border.
 */
export const SubmitButton = styled(Button)({
    backgroundColor: "#3f51b5", // Blue background color for the button
    color: "white", // White text color for the button
    marginTop: "20px", // Space above the button
    padding: "5px 15px", // Space inside the button
    alignSelf: "center", // Center button horizontally
    borderRadius: "5px", // Rounded corners for the button
    transition: "background-color 0.3s", // Smooth transition for hover effect
    "&:hover": {
        backgroundColor: "#234681", // Darker blue on hover
    },
    border: 0, // Remove default border
})

/**
 * Error style: Styles the error message displayed to the user.
 * 
 * @property {string} marginTop - Adds space above the error message.
 * @property {string} color - Sets the text color for the error message.
 * @property {string} backgroundColor - Sets a light red background with transparency.
 * @property {string} border - Adds a red border around the error message.
 * @property {string} padding - Adds space inside the error message.
 * @property {string} borderRadius - Rounds the corners of the error message.
 * @property {string} textAlign - Centers the text inside the error message.
 */
export const Error = styled('div')({
    marginTop: "20px", // Space above the error message
    color: "#B20E27", // Red text color for error message
    backgroundColor: "rgba(178,14,39,0.2)", // Light red background with transparency
    border: "1px solid #B20E27", // Red border for error message
    padding: "5px 15px", // Space inside the error message
    borderRadius: "5px", // Rounded corners for the error message
    textAlign: "center" // Center text inside the error message
})

/**
 * Success style: Styles the success message displayed to the user.
 * 
 * @property {string} marginTop - Adds space above the success message.
 * @property {string} color - Sets the text color for the success message.
 * @property {string} backgroundColor - Sets a light green background with transparency.
 * @property {string} border - Adds a green border around the success message.
 * @property {string} padding - Adds space inside the success message.
 * @property {string} borderRadius - Rounds the corners of the success message.
 * @property {string} textAlign - Centers the text inside the success message.
 */
export const Success = styled('div')({
    marginTop: "20px", // Space above the success message
    color: "#006837", // Green text color for success message
    backgroundColor: "rgba(0,104,55,0.2)", // Light green background with transparency
    border: "1px solid #006837", // Green border for success message
    padding: "5px 15px", // Space inside the success message
    borderRadius: "5px", // Rounded corners for the success message
    textAlign: "center" // Center text inside the success message
})