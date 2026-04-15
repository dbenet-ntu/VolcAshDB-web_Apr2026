import { Button, Typography } from '@mui/material'

import { styled } from '@mui/styles'


/**
 * FilterDownloadButtons Style for the container holding the filter and download buttons.
 * 
 * @property {string} padding - Resets padding to default.
 */
export const FilterDownloadButtons = styled('div')({
    marginTop: '20px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-around',
    gap: '20px', // Add gap between buttons
    flexWrap: 'wrap', // Allow buttons to wrap to the next line if needed
})

/**
 * FilterButton Style for the filter button.
 * 
 * @property {string} backgroundColor - Dark green background color.
 * @property {number} fontWeight - Bold text.
 * @property {number} height - Fixed height.
 * @property {string} padding - Resets padding to default.
 * @property {string} borderRadius - Rounded corners.
 * @property {string} color - White text color.
 * @property {string} margin - Margins around the button.
 * @property {object} [theme.breakpoints.down('xl')] - Font size for extra-large screens.
 * @property {string} fontSize - Set font size.
 * @property {object} [theme.breakpoints.down('lg')] - Font size for large screens.
 * @property {string} fontSize - Maintain the same font size.
 * @property {object} [theme.breakpoints.down('md')] - Font size for medium screens.
 * @property {string} fontSize - Maintain the same font size.
 * @property {object} [theme.breakpoints.down('sm')] - Font size for small screens.
 * @property {string} fontSize - Decrease font size.
 * @property {object} [theme.breakpoints.down('xs')] - Font size and margins for extra-small screens.
 * @property {string} fontSize - Decrease font size even more.
 * @property {string} margin - Decrease margins around the button.
 */
export const FilterButton = styled(Button)({
    backgroundColor: "#388e3c",
    color: 'white',
    fontWeight: 700,
    height: 40,
    padding: 'revert',
    borderRadius: "20px",
    margin: "20px 30px",
})

/**
 * DownloadButton Style for the download button.
 * 
 * @property {string} backgroundColor - Orange background color.
 * @property {number} fontWeight - Bold text.
 * @property {number} height - Fixed height.
 * @property {string} borderRadius - Rounded corners.
 * @property {string} color - White text color.
 * @property {string} margin - Margins around the button.
 * @property {object} [theme.breakpoints.down('xl')] - Font size for extra-large screens.
 * @property {string} fontSize - Set font size.
 * @property {object} [theme.breakpoints.down('lg')] - Font size for large screens.
 * @property {string} fontSize - Maintain the same font size.
 * @property {object} [theme.breakpoints.down('md')] - Font size for medium screens.
 * @property {string} fontSize - Maintain the same font size.
 * @property {object} [theme.breakpoints.down('sm')] - Font size for small screens.
 * @property {string} fontSize - Decrease font size.
 * @property {object} [theme.breakpoints.down('xs')] - Font size and margins for extra-small screens.
 * @property {string} fontSize - Decrease font size even more.
 * @property {string} margin - Decrease margins around the button.
 */
export const DownloadButton = styled(Button)({
    backgroundColor: "#f57c00",
    color: 'white',
    fontWeight: 700,
    height: 40,
    borderRadius: "20px",
    margin: "20px 30px",
    padding: 'revert'
})


/**
 * ErrorForm Style for error messages.
 * 
 * @property {string} marginBottom - Space below the error message.
 * @property {string} color - Red text color for errors.
 * @property {string} fontSize - Size of the text.
 */
export const ErrorMessage = styled(Typography)({
    marginBottom: 10, 
    color: '#C8102B', 
    fontSize: '20px'
})