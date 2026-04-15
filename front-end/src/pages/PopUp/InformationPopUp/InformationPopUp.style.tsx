import { styled } from '@mui/styles';

/**
 * InformationPopUp style: Styles the main container for the pop-up.
 * 
 * @property {string} display - Uses flexbox to lay out child elements.
 * @property {string} justifyContent - Centers the images horizontally.
 * @property {string} flexWrap - Allows the items to wrap onto multiple lines if needed.
 */
export const InformationPopUpRender = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
});

/**
 * Image style: Styles the images within the pop-up.
 * 
 * @property {string} width - Sets the image width to 80% of its container.
 * @property {string} marginBottom - Adds a bottom margin of 150px to space out images.
 */
export const Image = styled('img')({
    width: "80%", 
    marginBottom: "150px"
});