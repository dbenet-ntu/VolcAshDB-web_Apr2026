import { styled } from '@mui/styles'


/**
 * Container style: Styles the main container of the VolcanoCard.
 * 
 * @property {string} display - Sets the display to flex for flexible layout.
 * @property {string} flexDirection - Aligns child elements in a column.
 * @property {string} width - Fixed width of the container.
 * @property {string} padding - Padding inside the container.
 * @property {string} margin - Margin around the container.
 * @property {string} backgroundColor - Background color of the container.
 * @property {string} borderRadius - Rounded corners for the container.
 * @property {string} position - Positioning context for absolute children.
 * @property {string} overflow - Hides overflowing content.
 * @property {object} '&:hover' - Styles applied when hovering over the container.
 *     @property {object} "& $cardOver" - Transforms the overlay when the container is hovered.
 */
export const Container = styled('div')({
    display: "flex",
    flexDirection: "column",
    width: "200px",
    padding: "5px",
    margin: "5px 5px",
    backgroundColor: "#0c4aad",
    borderRadius: "10px",
    position: "relative",
    overflow: "hidden",
    '&:hover .card-overlay': {
        transform: "translateY(0%)"
    }
})

/**
 * Poster style: Styles the poster image within the VolcanoCard.
 * 
 * @property {string} borderRadius - Rounded corners for the image.
 */
export const Poster = styled('img')({
    borderRadius: "10px",
    width: "100%", 
    height: "200px",
    cursor: "pointer"
})

/**
 * Name style: Styles the name text inside the VolcanoCard.
 * 
 * @property {string} color - Sets the text color to white.
 * @property {string} width - Sets the width to 100% of the container.
 * @property {string} textAlign - Center aligns the text.
 * @property {string} fontSize - Sets the font size of the name.
 * @property {number} fontWeight - Sets the font weight for emphasis.
 * @property {string} padding - Adds vertical padding around the name.
 */
export const VolcanoName = styled('div')({
    color: "white",
    width: "100%",
    textAlign: "center",
    fontSize: "17px",
    fontWeight: 600,
    padding: "8px 0",
})

/**
 * Card overlay style: Styles the overlay that appears when the card is hovered over.
 * 
 * @property {string} backgroundColor - Background color of the overlay.
 * @property {string} opacity - Sets the transparency level of the overlay.
 * @property {string} position - Absolute positioning within the container.
 * @property {string} padding - Padding inside the overlay.
 * @property {string} bottom - Positioned at the bottom of the container.
 * @property {string} left - Positioned to the left of the container.
 * @property {string} right - Positioned to the right of the container.
 * @property {string} transform - Initially hides the overlay by translating it down.
 * @property {string} maxHeight - Limits the maximum height of the overlay.
 * @property {string} overflowY - Adds vertical scroll if content overflows.
 * @property {string} transition - Smooth transition effect for the overlay.
 */
export const CardOver = styled('div')({
    backgroundColor: "#C0C0C0",
    cursor: "pointer",
    opacity: "0.85",
    position: "absolute",
    paddingTop: "1rem",
    paddingBottom: "1.2rem",
    paddingLeft: "0.2rem",
    bottom: "0",
    left: "0",
    right: "0",
    transform: "translateY(100%)",
    maxHeight: "100%",
    overflowY: "scroll",
    transition: "transform 0.3s ease-in-out",
    fontSize: "10px"
})