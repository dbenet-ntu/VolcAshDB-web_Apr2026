import { styled } from '@mui/styles';

/**
 * Covers the entire screen and darkens the background.
 * 
 * @property {string} position - Positions the overlay fixed on the screen, ensuring it stays in place.
 * @property {string} backgroundColor - Applies a semi-transparent black background (0.7 opacity).
 * @property {string} display - Flexbox is used to center the modal both vertically and horizontally.
 * @property {string} alignItems - Vertically aligns modal in the center of the screen.
 * @property {string} justifyContent - Horizontally aligns modal in the center of the screen.
 * @property {string} width - Takes up the full width of the viewport.
 * @property {string} height - Takes up the full height of the viewport.
 */
export const Container = styled('div')({
    position: 'inherit',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Full width of the screen
    height: '100%', // Full height of the screen
});

/**
 * Styles the modal window content that appears inside the overlay.
 * 
 * @property {string} backgroundColor - Sets the modal's background to white.
 * @property {string} padding - Provides 20px padding inside the modal for spacing.
 * @property {string} borderRadius - Rounds the corners of the modal with 8px.
 * @property {string} position - Positions elements relative to the modal (used for the close button).
 * @property {string} width - The modal width is set to 80% of the viewport width.
 * @property {string} height - The modal height is set to 80% of the viewport height.
 * @property {string} overflowY - Allows vertical scrolling if content exceeds the modal's height.
 * @property {string} overflowX - Hides horizontal scrolling to maintain layout.
 */
export const SubContainer = styled('div')({
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    position: 'relative', // Necessary for positioning the close button inside the modal
    width: '80%', // Takes 80% of the screen width
    height: '80%', // Takes 80% of the screen height
    overflowY: 'scroll', // Enables vertical scrolling for long content
    overflowX: 'hidden', // Disables horizontal scrolling
});