import { styled } from '@mui/styles'
import { Button, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export const Container = styled(Box)({
    display: "flex",
    cursor: "pointer",
    margin: "30px 0",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderRadius: "5px",
})

export const CloudUpload = styled(CloudUploadIcon)({
    fontSize: "xxx-large",
})


export const UploadButton = styled(Button)({
	backgroundColor: "#388e3c",
    color: 'white',
    fontWeight: 700,
    height: 40,
    padding: 'revert',
    borderRadius: "20px",
    margin: "20px 30px",
})

export const Image = styled('img')({
    width: '100px',
    height: '100px',
    marginRight:"10px",
    '&:hover':{
        transform:"scale(1.2)",
    }
})

