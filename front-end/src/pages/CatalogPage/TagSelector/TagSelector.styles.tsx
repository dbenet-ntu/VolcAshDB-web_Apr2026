import { styled } from '@mui/styles'

/**
     * SelectBox style: Styles the container for tag selection.
     * 
     * @property {string} display - Sets the display to flex for flexible layout.
     * @property {string} flexDirection - Aligns child elements in a row.
     * @property {string} flexWrap - Allows items to wrap onto multiple lines if necessary.
     */
export const Container = styled('div')({
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center", 
})

