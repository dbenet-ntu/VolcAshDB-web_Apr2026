import { styled } from '@mui/styles'
import { createTheme } from '@mui/material/styles'
import { CircularProgress, Button} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info' 

const theme = createTheme()

export const Container = styled('div')({
	width: "80%",
	margin: "2rem auto",
})

/**
 * FilterDownloadButtons Style for the container holding the filter and download buttons.
 * 
 * @property {string} padding - Resets padding to default.
 */
export const FilterDownloadButtons = styled('div')({
    marginTop: '20px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-around',
    gap: '20px', 
    flexWrap: 'wrap', 
})

export const SubmitButton = styled(Button)({
	backgroundColor: "#388e3c",
    color: 'white',
    fontWeight: 700,
    height: 40,
    padding: 'revert',
    borderRadius: "20px",
    margin: "20px 30px",
})

export const SubmitAndLoading = styled('div')({
    display:"flex",
    float:"right",
    flexDirection:"row",
    marginTop:"20px"
})

export const Loading = styled(CircularProgress)({
    marginRight:"20px",
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