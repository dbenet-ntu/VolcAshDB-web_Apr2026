import { Drawer } from '@mui/material'
import { styled } from '@mui/styles'
import { createTheme } from '@mui/material/styles'

const theme = createTheme()

/**
 * CustomDrawer: Styles the drawer (sidebar), adjusting the width based on its state.
 * 
 * @property {number} flexShrink - Prevents the drawer from shrinking.
 * @property {string} whiteSpace - Prevents text wrapping inside the drawer.
 * @property {object} transition - Smooth width transition for the drawer.
 * @property {function} width - Adjusts width based on drawer state.
 * @property {object} '& .MuiTypography-body1' - Styles for text inside the drawer.
 * @property {string} fontSize - Set font size of the drawer text.
 * @property {object} '& .MuiList-padding' - Removes padding from list items inside the drawer.
 * @property {string} paddingTop - Remove top padding for the list.
 * @property {string} paddingBottom - Remove bottom padding for the list.
 */
export const CustomDrawer = styled(Drawer)({
    flexShrink: 0,
    whiteSpace: 'nowrap',
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    width: (drawerOpen) => (drawerOpen ? 240 : 0),
    '& .MuiTypography-body1': {
        fontSize: '0.8rem',
    },
    '& .MuiList-padding': {
        paddingTop: '0px',
        paddingBottom: '0px',
    }
})
