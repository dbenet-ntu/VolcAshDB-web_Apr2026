import { Typography, Button } from '@mui/material'
import { styled } from '@mui/styles'
import { createTheme } from '@mui/material/styles'

const theme = createTheme()

/**
 * Style for section headers or titles.
 * 
 * @property {number} fontWeight - Set font weight to bold.
 * @property {string} fontSize - Larger font size for emphasis.
 * @property {string} marginBottom - Space below the title.
 * @property {string} textAlign - Center-align the text.
 */
export const Title = styled('h2')({
    fontWeight: 700,
    fontSize: '1.8rem',
    marginBottom: '20px',
    textAlign: 'center',
})

/**
 * Style for the container during the loading state.
 * 
 * @property {string} display - Use flexbox for layout.
 * @property {string} flexDirection - Arrange items in a row.
 * @property {string} flexWrap - Allow items to wrap to the next line.
 * @property {string} justifyContent - Center items horizontally.
 */
export const LoadingContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
})

/**
 * Style for the separator line.
 * 
 * @property {string} alignSelf - Center the separator.
 * @property {number} marginTop - Space above the separator.
 * @property {number} marginBottom - Space below the separator.
 * @property {string} marginLeft - Margin from the left edge.
 * @property {string} marginRight - Margin from the right edge.
 * @property {string} width - Width of the separator.
 * @property {string} border - Light gray border.
 */
export const Separator = styled('hr')({
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 50,
    marginLeft: '40%',
    marginRight: '25%',
    width: '20%',
    border: '1px solid #C0C0C0',
})

/**
 * Style for the no results message.
 * 
 * @property {number} marginBottom - Space below the message.
 */
export const NoResults = styled('span')({
    marginBottom: 10,
})

/**
 * Style for the no results message.
 * 
 * @property {number} marginBottom - Space below the message.
 */
export const LoadingRender = styled(Typography)({
    marginBottom: 10, 
    color: '#C8102B', 
    fontSize: '20px'
})

/**
 * Style for the no results message.
 * 
 * @property {number} marginBottom - Space below the message.
 */
export const InformationRender = styled(Typography)({
    marginBottom: 10, 
    color: '#C8102B', 
    fontSize: '12px'
})

/**
 * Style for the no results message.
 * 
 * @property {number} marginBottom - Space below the message.
 */
export const SearchComponentRender = styled(Typography)({
    marginLeft: 25, 
    paddingBottom: 20,
    textAlign: 'center'
})

/**
 * Style for the suggested search link.
 * 
 * @property {string} textDecoration - Underline the text.
 * @property {string} color - Blue color for the link.
 * @property {string} cursor - Pointer cursor on hover.
 */
export const SuggestLink = styled('span')({
    textDecoration: "underline",
    color: "#1890ff",
    cursor: "pointer",
})

/**
 * Style for the search bar separator.
 * 
 * @property {string} margin - Center the separator.
 * @property {string} width - Width of the separator.
 * @property {string} border - Light gray border.
 * @property {string} marginBottom - Space below the separator.
 */
export const SeparatorSearchBar = styled('hr')({
    margin: "auto",
    width: "50%",
    border: "1px solid #C0C0C0",
    marginBottom: "20px",
})

/**
 * Container style for result items.
 * 
 * @property {string} display - Use flexbox for layout.
 * @property {string} flexDirection - Arrange items in a row.
 * @property {string} flexWrap - Allow items to wrap to the next line.
 * @property {string} justifyContent - Center items horizontally.
 */
export const ResultContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
})

/**
 * Style for the container holding the load more particles button.
 * 
 * @property {string} display - Use flexbox for layout.
 * @property {string} justifyContent - Center items horizontally.
 * @property {string} padding - Resets padding to default.
 */
export const LoadMoreButton = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    padding: 'revert',
    margin: '20px'
})

/**
 * Style of the button for loading more particles.
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
export const LoadMoreParticles = styled(Button)({
    backgroundColor: "#388e3c",
    fontWeight: 700,
    height: 40,
    padding: 'revert',
    borderRadius: "20px",
    color: "white",
    margin: "20px 30px",
    [theme.breakpoints.down('xl')]: {
        fontSize: '1rem',
    },
    [theme.breakpoints.down('lg')]: {
        fontSize: '1rem',
    },
    [theme.breakpoints.down('md')]: {
        fontSize: '1rem',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: '0.6rem',
        margin: "20px 15px",
    }
})

/*
 * Style for the volcano result section.
 * 
 * @property {string} display - Use flexbox for layout.
 * @property {string} flexDirection - Arrange items in a row.
 * @property {string} flexWrap - Allow items to wrap to the next line.
 * @property {string} justifyContent - Center items horizontally.
 * @property {object} [theme.breakpoints.down('sm')] - Responsive styles for small screens.
 * @property {string} flexDirection - Stack items vertically on small screens.
 * @property {string} justifyContent - Center items vertically on small screens.
 * @property {string} display - Adjust display for small screens.
 * @property {object} [theme.breakpoints.down('xs')] - Responsive styles for extra-small screens.
 * @property {string} flexDirection - Stack items vertically on extra-small screens.
 * @property {string} justifyContent - Center items vertically on extra-small screens.
 * @property {string} width - Fixed width for extra-small screens.
 * @property {string} display - Adjust display for extra-small screens.
 */
export const ResultVolcano = styled('div')({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
        display: 'contents'
    },
    [theme.breakpoints.down('xs')]: {
        justifyContent: 'center',
        width: "300px",
        display: 'contents'
    }
})

/**
 * Style for the volcano timeline section.
 * 
 * @property {string} display - Use flexbox for layout.
 * @property {string} justifyContent - Center items horizontally.
 * @property {object} [theme.breakpoints.down('xs')] - Responsive styles for extra-small screens.
 * @property {string} display - Maintain flex display on extra-small screens.
 * @property {string} justifyContent - Reset justify-content for extra-small screens.
 */
export const VolcanoTimeLineRender = styled('div')({
    display: 'flex', 
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
        display: 'flex', 
        justifyContent: 'unset',
    }
})

export const WorldMapRender = styled('div')({
    display: "flex",
    position: "sticky",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center"
})