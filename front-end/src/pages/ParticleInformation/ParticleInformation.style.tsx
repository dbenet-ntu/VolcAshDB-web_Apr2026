import { Link } from '@mui/material'

import { styled } from '@mui/styles'
import InfoIcon from '@mui/icons-material/Info' 

/**
 * h3 style: Styles for all h3 headings.
 * 
 * @property {number} fontWeight - Sets the font weight to 700 for bold text.
 */
export const Title = styled('h3')({
    fontWeight: 700,
})

/**
 * physicalChar style: Styles for physical characteristics elements inside content sections.
 * 
 * @property {number} fontWeight - Sets the font weight to 700 for bold text.
 * @property {string} marginLeft - Adds 10px of margin to the left of the span.
 * @property {number} marginBottom - Removes the bottom margin for tight spacing.
 */
export const PhysicalChar = styled('div')({
    fontWeight: 700,
    marginLeft: "10px",
    marginBottom: 0
})


/**
 * span style: Styles for span elements inside content sections.
 * 
 * @property {number} fontWeight - Sets the font weight to 700 for bold text.
 * @property {string} marginLeft - Adds 10px of margin to the left of the span.
 * @property {number} marginBottom - Removes the bottom margin for tight spacing.
 */
export const SpanRender = styled('span')({
    fontWeight: 700,
    marginLeft: "10px",
    marginBottom: 0
})

/**
 * spanInformation style: Styles for span elements inside content sections.
 * 
 * @property {string} display - Sets the display to flex for horizontal alignment.
 * @property {string} marginBottom - Adds 10px of bottom margin for spacing.
 */
export const SpanInformation = styled('div')({
    display: 'flex',
    marginBottom: '10px',
})

/**
 * span_main_type style: Styles for spans in the main_type section.
 * 
 * @property {number} fontWeight - Sets the font weight to 700 for bold text.
 * @property {string} marginLeft - Adds 25px of margin to the left of the span for indentation.
 */
export const MainTypeRender = styled('span')({
    fontWeight: 700,
    marginLeft: "25px",
})

/**
 * information style: Styles for the container of information headers.
 * 
 * @property {string} display - Sets the display to flex for horizontal alignment.
 * @property {string} alignItems - Vertically aligns child elements to the center.
 * @property {string} marginBottom - Adds 10px of bottom margin for spacing.
 */
export const Information = styled('div')({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
})

/**
 * h3information style: Styles for the h3 element in the information header.
 * 
 * @property {number} fontWeight - Sets the font weight to 700 for bold text.
 * @property {number} marginBottom - Removes the bottom margin for tight spacing.
 */
export const TitleInformation = styled('h3')({
    fontWeight: 700,
    marginBottom: 0,
})

/**
 * infoIcon style: Styles for the info icon in the tooltip.
 * 
 * @property {string} marginLeft - Adds 5px of margin to the left of the icon.
 */
export const InfoIconRender = styled(InfoIcon)({
    marginBottom: "5px",
    marginRight: "5px"
})

/**
 * Link style: Styles for the links inside the tooltip.
 * 
 * @property {string} marginRight - Adds 5px of margin to the right of the link for spacing.
 */
export const LinkRender = styled(Link)({
    marginRight: "5px",
})