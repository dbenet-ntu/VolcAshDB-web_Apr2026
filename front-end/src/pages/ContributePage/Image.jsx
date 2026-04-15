import React from "react"
import ClearIcon from '@mui/icons-material/Clear';

export default function Image({src,alt,onDelete}){
    return(
        <div>
            <ClearIcon onClick={onDelete}/>
            <img src={src} alt={alt}/>
        </div>
    )
}