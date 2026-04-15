import React, { useState } from 'react'
import { Container, UploadButton, CloudUpload, Image } from './FileUpload.style';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { LinearProgress, IconButton } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

function FileUpload(props) {
    const [Images, setImages] = useState([])
    const [progress, setProgress] = useState(0)
    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' },
            onUploadProgress : progressEvent => {
                setProgress(
                    parseInt(
                        Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    )
                );
            }
        }
        for(const element of files){
            formData.append("files",element)
        }
        //save the Image we chose inside the Node Server 
        axios.post('/upload/uploadImage', formData, config)
            .then(response => {
                if (response.data.success) {
                    setImages(Images.concat(response.data.image))
                    props.refreshFunction(Images.concat(response.data.image))
                } else {
                    console.log("failed")
                    alert('Failed to save the Image in Server')
                }
            })
        
    }


    const onDelete = (image) => {
        const currentIndex = Images.indexOf(image);
        
        let newImages = [...Images]
        newImages.splice(currentIndex, 1)

        setImages(newImages)
        props.refreshFunction(newImages)
    }

    return (
        <Container>
            <Dropzone
                onDrop={onDrop}
                multiple={true}
                maxSize={99999999999999999999999999999999}
            >
                {({getRootProps, getInputProps }) => (
                    <UploadButton variant='contained' startIcon={<CloudUpload/>} {...getRootProps()}>
                        <input {...getInputProps()} />
                        Browse File to Upload
                    </UploadButton>
                )}
            </Dropzone>
            {progress==100 && Images.map((image, index) => (
                <span style={{position:"relative",display:"inline-flex"}}>
                    <IconButton onClick={() => onDelete(image)} style={{position:"absolute",top:2,right:10, zIndex:1, width:"12px", height:"12px"}}>
                        <RemoveCircleIcon sx={{ color: "#FF0D86" }}/>
                    </IconButton>
                    <Image src={`/${image}`} alt={`Img-${index}`}/>
                </span>
            ))}
            {progress<100 && progress!=0 &&
                <LinearProgress variant="determinate" value={progress}/>
            }
        </Container>
    )
}

export default FileUpload
