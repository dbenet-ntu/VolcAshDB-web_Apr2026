import React, { useState } from 'react'
import { TableRow } from '@mui/material'

export default function Table({data,setData}){
    const colums =[{
        title:"Volcano Name", field: "volc_name", editable:"never"
    },{
        title:"Magnification", field:"mag",type:"numeric", validate: rowData =>{
            if(!rowData.mag) {return "Required"}
            return true
        }
    },{
        title: "GS Lower Bound", field:"gsLow",lookup:{0:"0",1:"1",2:"2",3:"3",4:"4"},type:"numeric", validate: rowData =>{
            if(!rowData.gsLow) {return "Required"}
            return true
        }
    },{
        title: "GS Upper Bound", field:"gsUp",lookup:{1:"1",2:"2",3:"3",4:"4"},type:"numeric", validate: rowData =>{
            if(!rowData.gsUp) {return "Required"}
            return true
        }
    },{
        title:"Main Type", field:"mType", lookup:{"Free Crystal":"Free Crystal","Altered Material":"Altered Material","Lithic":"Lithic","Juvenile":"Juvenile"}
        ,validate: rowData => ({ isValid: true, helperText: "Optional" })
    },{
        title:"Sub Type", field:"sType", lookup:{"Plagioclase":"Plagioclase","Pyroxene":"Pyroxene","Amfibole":"Amfibole","Sulfide":"Sulfide","Others":"Others","Recycled Juvenile":"Recycled Juvenile","Hydrothermally Altered Juvenile":"Hydrothermally Altered Juvenile","Standard Juvenile":"Standard Juvenile","Weathered Material":"Weathered Material","Hydrothermally Altered Material":"Hydrothermally Altered Material","Standard Lithic":"Standard Lithic"}
        ,validate: rowData => ({ isValid: true, helperText: "Optional" })
    },{
        title:"Crystallinity", field:"crys", lookup:{"Low":"Low", "Mid":"Mid", "High":"High"}
        ,validate: rowData => ({ isValid: true, helperText: "Optional" })
    },{
        title:"Color", field:"color", lookup:{"Black":"Black", "Transparent":"Tranparent"}
        ,validate: rowData => ({ isValid: true, helperText: "Optional" })
    },{
        title:"Hydrothermally Alteration Degree", field:"hydro_alter_degree", lookup:{"None":"None", "Slight":"Slight","Moderate":"Moderate","High":"High"}
        ,validate: rowData => ({ isValid: true, helperText: "Optional" })
    },{
        title:"Shape", field:"shape", lookup:{"Blocky":"Blocky", "Fluidal":"Fluidal", "Microtubular":"Microtubular", "Highly Vesicular":"Highly Vesicular", "Spongy":"Spongy", "Pumice":"Pumice","Aggregate":"Aggregate"}
        ,validate: rowData => ({ isValid: true, helperText: "Optional" })
    },{
        title: "Image name", field:"image_name", editable:"never"
    }]
    return (
        <TableRow
            title={<h2 style={{fontWeight:600}}> Uploaded Image </h2>}
            editable={{
                onRowUpdate:(newRow,oldRow) => new Promise((res,rej)=>{
                    const newData = [...data]
                    newData[oldRow.tableData.id] = newRow
                    setData(newData)
                    setTimeout(()=>res(),500)
                }),
                onRowDelete:(selectedRow) => new Promise((res,rej)=>{
                    const newData  = [...data]
                    newData.splice(selectedRow.tableData.id,1)
                    setData(newData)
                    setTimeout(()=>res(),500)
                })
            }}
            data={data}
            columns={colums}
            options={{
                exportButton:true,
                addRowPosition:"first",
                rowStyle:(data,index) =>index%2==0?{background:"#f5f5f5"}:null,
                headerStyle:{background:"#096fe3",fontWeight:600,color:"white"},
            }}
        />
    )
}