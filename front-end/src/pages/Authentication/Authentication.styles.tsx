import { styled } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import { Button } from '@mui/material';

const theme = createTheme();

/**
 * Container Styles for the overlay containers around the charts in the Dashboard.
 * 
 * @property {string} marginTop - Creates space between the introductory text and the form.
 * @property {string} display - Uses flexbox for layout.
 * @property {string} justifyContent - Centers the form horizontally.
 */
export const Container = styled('div')({
    marginTop: "100px",
    display: "flex",
    justifyContent: "center",
});

/**
 * Style for the separator line.
 * 
 * @property {string} alignSelf - Center the separator.
 * @property {number} marginTop - Space above the separator.
 * @property {number} marginBottom - Space below the separator.
 * @property {string} marginLeft - Margin from the left edge.
 * @property {string} marginRight - Margin from the right edge.
 * @property {string} width - Width of the separator.
 * @property {string} border - Light gray border.
 */
export const Separator = styled('hr')({
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 25,
    width: '80%',
    border: '1px solid #C0C0C0',
})

/**
 * form Styles for the overlay containers around the charts in the Dashboard.
 * 
 * @property {string} marginTop - Creates space between the introductory text and the form.
 * @property {string} display - Uses flexbox for layout.
 * @property {string} justifyContent - Centers the form horizontally.
 */
export const FormAuth = styled('form')({
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
});

/**
 * TitleForm Styles for the overlay containers around the charts in the Dashboard.
 * 
 * @property {string} fontWeight - Bold text for emphasis.
 * @property {string} marginBottom - Space below the header.
 */
export const TitleForm = styled('div')({
    fontWeight: "bold",
    marginBottom: "20px",
});

/**
 * ContentForm Style for form content areas.
 * 
 * @property {string} width - Full width of the form container.
 * @property {string} textAlign - Aligns form content to the left.
 * @property {string} display - Uses flexbox for layout.
 * @property {string} justifyContent - Space between label and input.
 * @property {string} alignItems - Centers items vertically.
 * @property {string} marginBottom - Space below each content block.
 */
export const ContentForm = styled('div')({
    width: "100%",
    textAlign: "left",
    display: 'flex',
    justifyContent: "space-between",
    alignItems: 'center',
    marginBottom: '10px',
});

/**
 * InputForm Style for input fields.
 * 
 * @property {string} border - Light gray border.
 * @property {string} borderRadius - Rounded corners.
 * @property {string} padding - Padding inside the input.
 * @property {string} marginLeft - Space between the label and the input.
 * @property {string} width - Full width of the container.
 */
export const InputForm = styled('input')({
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    marginLeft: "15px",
    width: "100%",
});

/**
 * SelectForm Style for input fields.
 * 
 * @property {string} border - Light gray border.
 * @property {string} borderRadius - Rounded corners.
 * @property {string} padding - Padding inside the input.
 * @property {string} marginLeft - Space between the label and the input.
 * @property {string} width - Full width of the container.
 */
export const SelectForm = styled('select')({
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    marginLeft: "15px",
    width: "100%",
});

/**
 * IconForm Style for icons, e.g., visibility toggle icons.
 * 
 * @property {string} cursor - Pointer cursor on hover.
 * @property {string} marginLeft - Space to the left of the icon.
 */
export const IconForm = styled('span')({
    cursor: 'pointer',
    marginLeft: theme.spacing(1),
});

/**
 * ButtonForm Style for buttons.
 * 
 * @property {string} backgroundColor - Primary button color.
 * @property {string} color - Button text color.
 * @property {string} marginTop - Space above the button.
 * @property {string} padding - Padding inside the button.
 * @property {string} alignSelf - Centers the button horizontally.
 * @property {string} borderRadius - Rounded corners.
 * @property {string} transition - Smooth transition for background color on hover.
 * @property {object} "&:hover" - Darker color on hover.
 * @property {string} backgroundColor - Change background colore for hover state.
 * @property {string} border - Removes default border.
 */
export const ButtonForm = styled(Button)({
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
});


/**
 * Style for SSO button.
 * 
 * @property {string} backgroundColor - Primary button color.
 * @property {string} color - Button text color.
 * @property {string} marginTop - Space above the button.
 * @property {string} padding - Padding inside the button.
 * @property {string} alignSelf - Centers the button horizontally.
 * @property {string} borderRadius - Rounded corners.
 * @property {string} transition - Smooth transition for background color on hover.
 * @property {object} "&:hover" - Darker color on hover.
 * @property {string} backgroundColor - Change background colore for hover state.
 * @property {string} border - Removes default border.
 */
export const SSOButton = styled(Button)({
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
});

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
 * forgotPassword Style for forgot password link.
 * 
 * @property {string} paddingTop - Space above the link.
 * @property {string} textDecoration - Underline the text.
 * @property {string} color - Link color.
 */
export const ForgotPasswordForm = styled('div')({
    paddingTop: "10px",
    textDecoration: "underline",
    color: "#234681",
});



