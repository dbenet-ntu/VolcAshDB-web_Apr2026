import { styled } from '@mui/styles';

/**
 * LoadingContainerContainer for the loading card.
 * 
 * @property {string} display - Use flexbox for layout.
 * @property {string} flexDirection - Stack children vertically.
 * @property {string} width - Fixed width for the card.
 * @property {string} padding - Space inside the card.
 * @property {string} margin - Space outside the card.
 * @property {string} boxShadow - Subtle shadow for depth.
 * @property {string} borderRadius - Rounded corners.
 * @property {string} position - Positioned relative for any absolute positioning inside.
 * @property {string} overflow - Hide overflow content.
 */
export const LoadingContainer = styled('div')({
    display: "flex",
    flexDirection: "column",
    width: "200px",
    padding: "5px",
    margin: "5px",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    borderRadius: "10px",
    position: "relative",
    overflow: "hidden",
});

/**
 * LoadingPoster Placeholder for the poster image.
 * 
 * @property {string} borderRadius - Rounded corners for the poster.
 * @property {string} width - Full width of the container.
 * @property {string} height - Fixed height for the poster.
 * @property {string} backgroundColor - Light gray background.
 * @property {string} animation - Pulse animation.
 */
export const LoadingPoster = styled('div')({
    borderRadius: "10px",
    width: "100%",
    height: "200px",
    backgroundColor: "rgb(209 213 219)",
    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
});

/**
 * NameBox Container for the name or title.
 * 
 * @property {string} paddingLeft - Space on the left.
 * @property {string} paddingRight - Space on the right.
 * @property {string} paddingTop - Space on the top.
 * @property {string} paddingBottom - Space on the bottom.
 * @property {string} alignItems - Center items vertically.
 */
export const NameBox = styled('div')({
    paddingLeft: "24px",
    paddingRight: "24px",
    paddingTop: "16px",
    paddingBottom: "16px",
    alignItems: "center",
});

/**
 * LoadingName Placeholder for the name text.
 * 
 * @property {string} width - Fixed width for the name placeholder.
 * @property {string} height - Fixed height for the name placeholder.
 * @property {string} borderRadius - Rounded corners.
 * @property {string} backgroundColor - Light gray background.
 * @property {string} animation - Pulse animation.
 */
export const LoadingName = styled('div')({
    width: "100px",
    height: "20px",
    borderRadius: "5px",
    backgroundColor: "rgb(209 213 219)",
    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
});