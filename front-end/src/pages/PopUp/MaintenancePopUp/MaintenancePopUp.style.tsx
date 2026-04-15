import { styled } from '@mui/styles';

import { createTheme } from '@mui/material/styles';

const theme = createTheme();

export const Message = styled('div')({
    textAlign: 'center', 
    marginTop: '10%'
});

/**
 * iconStyle style: Styles icons within the application.
 * 
 * @property {string} width - Sets width to auto to maintain aspect ratio.
 * @property {string} marginBottom - Adds space below the icon.
 * @property {object} [theme.breakpoints] - Applies responsive height based on screen size.
 * @property {string} [theme.breakpoints.down] - Adjusts icon height for different breakpoints:
 *   - `xl`, `lg`, `md`: 200px height
 *   - `sm`: 160px height
 *   - `xs`: 80px height
 */
export const IconStyle = styled('img')({
    width: 'auto', // Sets width to auto to maintain aspect ratio
    marginBottom: "16px", // Adds space below the icon
    [theme.breakpoints.down('xl')]: {
        height: '200px',
    },
    [theme.breakpoints.down('lg')]: {
        height: '200px',
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
});