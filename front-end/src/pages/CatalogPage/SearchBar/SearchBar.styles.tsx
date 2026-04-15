import { styled } from '@mui/styles'
import { Select } from '@mui/material'

import { createTheme } from '@mui/material/styles'

const theme = createTheme()

/**
 * Style for the container of the search box.
 * 
 * @property {string} width - Full width of the container.
 * @property {string} display - Use flexbox for layout.
 * @property {string} alignItems - Center align items vertically.
 * @property {string} justifyContent - Space items evenly within the container.
 * @property {string} flexWrap - Allow items to wrap to the next line for responsiveness.
 */
export const SearchBoxContainer = styled('div')({
    width: '100%',
    display: "flex",
    alignItems: "center",
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
})

/**
 * Style for the container of the tabs.
 * 
 * @property {string} padding - Vertical padding for spacing.
 * @property {string} display - CSS display property for the tabs.
 */
export const Tabs = styled('div')({
    padding: "6px 0", 
    display: "contents"
})

/**
 * Style for the select elements.
 * 
 * @property {number} margin - Margin around the select component.
 * @property {string} fontSize - Font size for the select component.
 * @property {object} [theme.breakpoints.down('sm')] - Responsive style adjustments for small screens.
 * @property {string} fontSize - Reduce font size on small screens
 * @property {object} [theme.breakpoints.down('xs')] - Responsive style adjustments for extra-small screens.
 * @property {string} fontSize - Further reduce font size on extra-small screens
 */
export const SelectRender = styled(Select)({
    margin: 10, 
    fontSize: '0.8rem',
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.7rem', 
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: '0.6rem',
    },
})