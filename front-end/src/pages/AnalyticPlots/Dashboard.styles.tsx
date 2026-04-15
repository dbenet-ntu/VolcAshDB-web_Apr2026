import { styled } from '@mui/styles';

export const Container = styled('div')({
	width: "80%",
	margin: "2rem auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: 'white',
    paddingTop: '10px',
})

/**
 * ChartOverlay Styles for the overlay containers around the charts in the Dashboard.
 * 
 * @property {string} color - Text color, adjusted to fit design requirements.
 * @property {string} marginTop - Space above the chart overlay.
 * @property {string} maxWidth - Maximum width of the chart overlay.
 * @property {string} textAlign - Centers the text within the overlay.
 * @property {string} padding - Padding around the content.
 * @property {string} backgroundColor - Semi-transparent background color for the overlay.
 * @property {string} borderRadius - Rounded corners for the overlay.
 * @property {string} margin - Margin top and bottom for spacing between overlays.
 * @property {string} boxShadow - Subtle shadow for depth effect.
 */
export const ChartOverlay = styled('div')({
    color: "black",
    marginTop: "20px",
    maxWidth: "900px",
    textAlign: "center",
    padding: '1rem',
    backgroundColor: '#e9e9e9f7',
    borderRadius: '5px',
    margin: '1rem',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

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