import React, { useState,useEffect,useCallback } from 'react'
import FileUpload from './FileUpload.jsx'
import axios from 'axios';
import Table from './Table.jsx'
import { Box, TextField, Button, Card, CardContent, Typography, MenuItem, CircularProgress, Autocomplete } from '@mui/material';
import { contributeStyle } from './ContributePage.style.jsx';
import { useHistory } from 'react-router';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import DatePickerCustom from './DatePickerCustom.jsx';
import extractInfo from './extractInfo.jsx';

const gsValue = [0,1,2,3,4];
const bComps  = ["Free Crystal","Altered Material","Lithic","Juvenile"];
const jTypes = ["Recycled Juvenile","Hydrothermally Altered Juvenile","Juvenile"]
const cTypes = ["Plagioclase","Pyroxene", "Amfibole","Sulfur"]
const aTypes = ["Weathered Material", "Hydrothermally Altered Material"];
const crystallinity = ["Low Black", "Low Transparent", "Mid Black", "Mid Transparent","High Black", "High Transparent"];
const alterations = ["None", "Slight", "Moderate", "High"];
const shapes = ["Blocky", "Fluidal", "Microtubular","Highly vesicular","Spongy","Pumice"]
const dateFormatValues = ["mm/dd/yyyy", "mm/yyyy", "Year only", "Years BP", "Unknown"]
const booleanList = {
  "Yes": true,
  "No": false
}
function ContributePage(props) {
    const history= useHistory();
    const classes = contributeStyle();
    const navigate = useCallback(
      (url) => history.push(url),
      [history]
    );
    
    const [isLoading, setIsLoading] = useState(false)
    const [volcanoList, setVolcanoList] = useState([])
    useEffect(()=>{
      axios.get("/volcanoes/getVolcanoes")
      .then(response => {
        if(response.data.success){
          let newVolcanoList = []
          response.data.volcanoes.map(volcano=>{
            newVolcanoList.push({
              label: volcano.volc_name,
              id: volcano.volc_num
            })
          })
          setVolcanoList(newVolcanoList)
        } else{
          alert("Failed to fetch data")
        }
      })
    },[])
    const [volcName, setVolcName] = useState("");
    const [volcID,setVolcID] = useState()
    const [volcValid,setVolcValid] = useState({
        error:false,
        helperText:""
    })
    const [afeFormat, setAFEFormat] = useState("")
    const [afeDate,setAFEDate] = useState(null)
    const [afeYearsBP, setAFEYearsBP] = useState()
    const [sampleFormat, setSampleFormat] = useState("")
    const [sampleDate,setSampleDate] = useState(null)
    const [sampleYearsBP, setSampleYearsBP] = useState()
    const [eStartDate, setEStart] = useState({
      date:null,
      helperText:""
    })
    const [eStartValid,setEStartValid] =useState({
      error:false,
      helperText:""
    })
    const [eEndDate, setEEnd] = useState({
      date:null,
      helperText:""
    })
    const [eEndValid,setEEndValid] =useState({
      error:false,
      helperText:""
    })
    const [sampleLon,setSampleLon] = useState()
    const [sampleLat,setSampleLat] = useState()
    const [followConvention, setFollow] = useState(null)
    const [followValid,setFollowValid] = useState({
      error:false,
      helperText:""
  })
    const [magnification, setMg] = useState(null);
    const [magValid,setMagValid] = useState({
        error:false,
        helperText:""
    })
    const [gsLow,setGsLow] = useState();
    const [gsLowValid,setGsLowValid] = useState({
        error:false,
        helperText:""
    })
    const [gsUp,setGsUp] = useState();
    const [gsUpValid,setGsUpValid] = useState({
        error:false,
        helperText:""
    })
    const [bComp,setBComp] = useState("");
    const [cType,setCType] = useState("")
    const [aType,setAType] = useState("")
    const [jType,setJType] = useState("")
    const [crys,setCrys] = useState("");
    const [alteration, setAlt] = useState("");
    const [shape, setShape] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false)
    const [data,setData] = useState([])
    const [afeList,setAFEList] = useState([])
    const [sampleList, setSampleList] = useState([])
    const [Images, setImages] = useState([])
    const [addable, setAddable] = useState(false)
    useEffect(()=>{
      if(volcID && afeDate){
        console.log(afeDate)
        axios.get(`/volcanoes/eruption_by_date?date=${afeDate}&volc=${volcID}`)
        .then(res=>{
          if(res.data.length!=0){
            setEStart({
              date:res.data[0].ed_stime.slice(0,10), // change 2000-12-30T00:00:00.000Z to 2000-12-30
              helperText:""
            })
            setEEnd({
              date:res.data[0].ed_etime.slice(0,10), // change 2000-12-30T00:00:00.000Z to 2000-12-30
              helperText:""
            })
          }else{
            setEStart({
              date:null,
              helperText:"No Eruption Found"
            })
            setEEnd({
              date:null,
              helperText:""
            })
          }
        })
        .catch(err=>console.log(err))
      }
    },[volcID,afeDate])
    const onVolcChange = (newValue)=>{
      if(newValue){
        setVolcName(newValue.label);
        setVolcID(newValue.id)
      } 
    }
    const onAFEFormatChange = (event)=>{
      setAFEFormat(event.target.value)
    }
    const onAFEYearsBPChange = (event)=>{    
      let yearsBP = 0-Math.abs(event.target.value)
      setAFEYearsBP(yearsBP)
      var convertedDate = new Date()
      convertedDate.setFullYear(convertedDate.getFullYear()+yearsBP)
      setAFEDate(convertedDate)
    }
    const onSampleFormatChange = (event)=>{
      setSampleFormat(event.target.value)
    }
    const onSampleYearsBPChange = (event)=>{
      let yearsBP = 0-Math.abs(event.target.value)
      setSampleYearsBP(yearsBP)
      var convertedDate = new Date()
      convertedDate.setFullYear(convertedDate.getFullYear()+yearsBP)
      setSampleDate(convertedDate)
    }
    const onSampleLonChange = (event)=>{
      const value = event.target.value
      if (value >90){setSampleLon(90)}
      else if (value<0){setSampleLon(0)}
      else {setSampleLon(value)}
  }
  const onSampleLatChange = (event)=>{
      const value = event.target.value
      if (value >90){setSampleLat(90)}
      else if (value<0){setSampleLat(0)}
      else {setSampleLat(value)}
  }
    const onFollowChange = (event)=>{
      setFollow(event.target.value)
    }
    const onMgChange = (event)=>{
      setMg(event.target.value)
    } 
    const onGsLowChange = (event)=>{
        setGsLow(event.target.value)
    } 
    const onGsUpChange = (event)=>{
      setGsUp(event.target.value)
    } 
    const onBCompChange = (event)=>{
      setBComp(event.target.value)
    } 
    const onCTypeChange = (event)=>{
      setCType(event.target.value)
    } 
    const onATypeChange = (event)=>{
      setAType(event.target.value)
    } 
    const onJTypeChange = (event)=>{
      setJType(event.target.value)
    } 
    const onCrysChange = (event)=>{
      setCrys(event.target.value)
    } 
    const onAltChange = (event)=>{
      setAlt(event.target.value)
    } 
    const onShapeChange = (event)=>{
      setShape(event.target.value)
    } 
    const updateImages = (newImages) => {
        setImages(newImages)
    }

    const checkValidData = ()=>{
      let valid = true;
      const nullError={
        error:true,
        helperText:"This field cannot be blank"
      }
      const isValid={
        error:false,
        helperText:""
      }
      if(!volcName){setVolcValid(nullError);valid=false}
      else{
        setVolcValid(isValid);
      }
      if(eStartDate.date){
        if(eEndDate.date){
          if(eStartDate.date>eEndDate.date){
            setEStartValid({
              error:true,
              helperText:"Eruption Start Date cannot be later than End Date"
            })
            valid=false
          }else{
            if(afeDate>=eStartDate.date){
              setEStartValid(isValid)
            }else{
              setEStartValid({
                error:true,
                helperText:"Eruption Start Date cannot be after Ash Emission Date"
              })
              valid=false
            }
            if(afeDate<=eEndDate.date){
              setEEndValid(isValid)
            }else{
              setEEndValid({
                error:true,
                helperText:"Eruption End Date cannot be before Ash Emission Date"
              })
              valid=false
            }
          }
        }else{
          if(afeDate.date>eStartDate.date){
            setEStartValid({
              error:true,
              helperText:"Eruption Start Date cannot be after Ash Emission Date"
            })
            valid=false
          }else{
            setEStartValid(isValid)
          }
        }
      }else{
        if(eEndDate.date){
          setEEndValid({
            error:true,
            helperText:"Please fill Start Date first!"
          })
          valid=false
        }else{
          setEEndValid(isValid)
        }
      }
      if(followConvention==null){setFollowValid(nullError);valid=false}
      else{
        setFollowValid(isValid);
      }
      if(followConvention==false){
        if(magnification==null){setMagValid(nullError);valid=false}
        else{
          setMagValid(isValid);
        }

        if(gsLow==null){setGsLowValid(nullError);valid=false}
        else{
          setGsLowValid(isValid);
        }
        if(gsUp==null){setGsUpValid(nullError);valid=false}
        else{
          setGsUpValid(isValid);
        }
        if(gsLow!=null && gsUp!=null && gsLow>gsUp){
          setGsLowValid({
            error:true,
            helperText:"Lower Bound cannot not be greater than Lower Bound"
          })
          valid=false
        }
    }

      return valid;
    }
    const handleTableClick = ()=>{
      if(checkValidData()){
        setButtonClicked(true)
        if(followConvention==false){
          let newData = []
          for(var i =0;i<Images.length;i++){
              const particle={
                volc_name: volcName,
                mag: magnification,
                gsLow: gsLow,
                gsUp: gsUp,
                bComp: bComp,
                crys: crys,
                alteration: alteration,
                shape: shape,
                image_name:Images[i].split("_").slice(1).join("_").slice(0,-4),
                image_path:Images[i]
              }
              newData.push(particle)

          }
          setData(newData)
        }else if (followConvention==true){
          let newData = []
          let newAFEList = []
          let newSampleList = []
          for(var i=0;i<Images.length;i++){
            const image_path = Images[i]
            const image_name = Images[i].split("_").slice(1).join("_").slice(0,-4)
            const info = extractInfo(image_name,volcID,image_path)
            console.log(info)
            if (info == undefined) {alert (`Your file ${image_name} are not following our naming convention`)}
            else {
                const changeToPascalCase =(s)=>{
                let arr = s.split(" ")
                for(var i=0;i<arr.length;i++){
                    arr[i] = arr[i][0].toUpperCase() + arr[i].slice(1)
                }
                return arr.join(" ")
                }
                const par = info.particle
                newAFEList.push(info.afe)
                newSampleList.push(info.sample)
                const particle = {
                volc_name: volcName,
                id: par.id,
                mag: par.magnification,
                gsLow: par.gsLow,
                gsUp: par.gsUp,
                multi_focus: par.multi_focus,
                image_name: image_name,
                image_path:image_path
                }
                if(par.index){ particle.index = par.index}
                if(par.basic_component){ particle.bComp = changeToPascalCase(par.basic_component)}
                if(par.juvenile_type){ particle.jType = changeToPascalCase(par.juvenile_type)}
                if(par.crystal_type){ particle.cType = changeToPascalCase(par.crystal_type)}
                if(par.altered_material_type){ particle.aType = changeToPascalCase(par.altered_material_type)}
                if(par.crystallinity_and_color){ particle.crys = changeToPascalCase(par.crystallinity_and_color)}
                if(par.alteration_degree){ particle.alteration = changeToPascalCase(par.alteration_degree)}
                if(par.shape){ particle.shape = changeToPascalCase(par.shape)}
                newData.push(particle)
                
            }
          }
          setData(newData)
          setAFEList(newAFEList)
          setSampleList(newSampleList)
        }
      }
    }
    const groupData = (data)=>{
      let group = {}
      var idCounter = 0
      for (var i=0;i<data.length;i++){
        const breakDown = data[i].image_name.split("_")
        if(breakDown.length==1 || isNaN(breakDown[breakDown.length-1])){
          const key = data[i].image_name
            if(group[key]!==undefined){
              group[key].dataList[0] = data[i]
            }else{
              group[key]={}
              group[key].id = idCounter++
              group[key].dataList={
                "0": data[i]
              }
            }
        }else{
          const key = breakDown.slice(0,-1).join("_")
          const index = breakDown[breakDown.length-1]
          if(group[key]!==undefined){
            group[key].dataList[index] = data[i]
          }else{
            group[key]={}
              group[key].id = idCounter++
              group[key].dataList={}
              group[key].dataList[index] = data[i]
          }
        }
      }
      return group
    }
    const [failed,setFailed] = useState(false)
    const onSubmit = async(event) => {
        event.preventDefault();
        if(checkValidData()){
          setIsLoading(true)
          if(followConvention==false){
            const group = groupData(data)
            console.log(group)
            Object.keys(group).map(key=>{
              Object.keys(group[key].dataList).map(par=>{
                const parInfo = group[key].dataList[par]
                const particle ={
                  volc_num: volcID,
                  volc_name: parInfo.volc_name,
                  afe_id: "unknown",
                  sample_id:1,
                  id:group[key].id,
                  index:par,
                  instrument:"binocular",
                  imgURL:parInfo.image_path,
                  gsLow:parInfo.gsLow,
                  gsUp: parInfo.gsUp,
                  multi_focus: true,
                  magnification: parInfo.mag,
                  basic_component: parInfo.bComp.toLowerCase(), 
                  crystallinity_and_color:parInfo.crys.toLowerCase(), 
                  alteration_degree: parInfo.alteration.toLowerCase(), 
                  shape:parInfo.shape.toLowerCase()
                }
                if(parInfo.jType) particle.juvenile_type = parInfo.jType.toLowerCase();
                if(parInfo.cType) particle.crystal_type = parInfo.cType.toLowerCase();
                if(parInfo.aType) particle.altered_material_type = parInfo.aType.toLowerCase();
                axios.post("/volcanoes/particles/add", particle)
                  .catch(err=>console.log(err),setFailed(true))
                })
              })
            }else if(followConvention == true){
              for(var i=0;i<data.length;i++){
                console.log(data[i])
                const particle={
                  volc_num: volcID,
                  volc_name: data[i].volc_name,
                  afe_id: afeList? afeList[i].afe_id: "unknown",
                  sample_id:sampleList? sampleList[i].sample_id:"unknown",
                  id: data[i].id,
                  index: data[i].index,
                  instrument:"binocular",
                  imgURL:data[i].image_path,
                  gsLow:data[i].gsLow,
                  gsUp: data[i].gsUp,
                  multi_focus: data[i].multi_focus,
                  magnification: data[i].mag,
                  basic_component: data[i].bComp.toLowerCase(), 
                }
                if(data[i].crys) particle.crystallinity_and_color = data[i].crys.toLowerCase();
                if(data[i].alteration) particle.alteration_degree = data[i].alteration.toLowerCase();
                if(data[i].shape) particle.shape = data[i].shape.toLowerCase();
                if(data[i].jType) particle.juvenile_type = data[i].jType.toLowerCase();
                if(data[i].cType) particle.crystal_type = data[i].cType.toLowerCase();
                if(data[i].aType) particle.altered_material_type = data[i].aType.toLowerCase();
                console.log(particle)
                axios.post("/volcanoes/particles/add", particle)
                  .catch(err=>console.log(err),setFailed(true))
                if (afeList){
                const afe = {
                  volc_num : volcID,
                  afe_id : afeList[i].afe_id,
                }
                if(afeDate) afe.afe_date = afeDate
                axios.post("/volcanoes/afes/add",afe)
                 .catch(err=> console.log(err),setFailed(true))}
                if(sampleList){
                  const sample={
                    volc_num: volcID,
                    afe_id: sampleList[i].afe_id,
                    sample_id: sampleList[i].sample_id,
                  }
                  if(sampleDate) {sample.sample_date = sampleDate}
                  if (sampleLat) {sample.sample_loc_lat = sampleLat}
                  if (sampleLon) {sample.sample_loc_lon = sampleLon}
                  axios.post("/volcanoes/samples/add",sample)
                  .catch(err=> console.log(err),setFailed(true)) 
                }
              }
            }
          }
          if(addable){
            const eruption={
              in_GVP: false,
              ed_stime: eStartDate.date,
              volc_num: volcID,
            }
            if(eEndDate.date) {eruption.ed_etime = eEndDate.date}
            console.log(eruption)
            axios.post("/volcanoes/eruptions/add",eruption)
            .catch(err=> console.log(err),setFailed(true))
          }
          axios.post("/upload/mesureTool",{len:Images.length}).catch(err=>console.log(err))
          setIsLoading(false);
          if(!failed) {
            // navigate('/database/catalogue')
          }
          else{
            return alert("Upload failed! Please try again!")
          }
      }
      useEffect(()=>{
        console.log(volcanoList[3])
      },[volcanoList])
    return (
        <div style={{ maxWidth:"80%",margin: '2rem auto' }}>
            <Typography gutterBottom variant="h4" align="center" style={{fontWeight:"600"}} >
        Help Us Expand Our Database!
       </Typography>
      <Box>
        <Card style={{ maxWidth: "100%", padding: "20px 5px", margin: "0 auto" }}>
          <CardContent>

            <form>
            <div style={{padding: "20px 5px"}}>
                <FileUpload refreshFunction={updateImages}/>
            </div>
              <Box container spacing={2}>
                <Box xs={12} item={true}>
                <Autocomplete
                  disablePortal
                  options={volcanoList}
                  value={volcName}
                  onChange={(event,newValue)=>{onVolcChange(newValue)}} 
                  renderInput={(params) => 
                  <TextField 
                    {...params} 
                    placeholder="Enter volcano name" 
                    label="Volcano Name" 
                    variant="outlined"
                    fullWidth
                    error={volcValid.error} 
                    helperText={volcValid.helperText}
                    required />}
                />
                </Box>
                <Box xs ={12} sm={3} item={true}>
                  <Typography style={{fontWeight:600}}>Ash Emission Date:</Typography>
                </Box>
                <Box xs={12} item={true}>
                  <DatePickerCustom 
                  dateFormat={afeFormat} 
                  onFormatChange={onAFEFormatChange} 
                  values={dateFormatValues} 
                  label="Ash Emission Date" 
                  value ={afeDate}
                  yearsBP={afeYearsBP}
                  onYearsBPChange={onAFEYearsBPChange} 
                  setValue={setAFEDate}/>
                </Box>
                <Box xs ={12}  item={true}>
                  <Typography style={{fontWeight:600}}>Eruption:</Typography>
                </Box>
                <Box xs={12} sm={6} item={true}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label="Eruption Start Date"
                    value={eStartDate.date}
                    onChange={(newValue)=>{
                      setEStart({...eStartDate,date:newValue.toISOString().slice(0,10)}) //change format date
                    }}
                    readOnly={!addable}
                    renderInput={(params) => 
                    <TextField
                      {...params}
                      error={eStartValid.error}
                      variant="outlined" 
                      InputLabelProps={{
                        shrink: true
                      }}
                      helperText={!eStartDate.date?
                        (<div>
                          <p style={{display:"inline",color:"red"}}>{eStartDate.helperText}.</p>
                          {eStartDate.helperText?<p style={{display:"inline",color:"#0291c9",cursor:"pointer",textDecoration:"underline"}} onClick={()=>setAddable(true)}> Add a new Eruption</p>:null}
                        </div>):eStartValid.helperText}
                      fullWidth />}
                  />
                </LocalizationProvider>
                </Box>
                <Box xs={12} sm={6} item={true}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label="Eruption End Date" 
                    value={eEndDate.date}
                    onChange={(newValue)=>{
                      setEEnd({...eEndDate,date:newValue.toISOString().slice(0,10)}) //change format date
                    }}
                    readOnly={!addable}
                    renderInput={(params) => 
                    <TextField
                      {...params}
                      error={eEndValid.error}
                      variant="outlined" 
                      InputLabelProps={{
                        shrink: true
                      }}
                      helperText={eEndValid.helperText}
                      fullWidth />}
                  />
                </LocalizationProvider>
                </Box>
                <Box xs ={12}  item={true}>
                  <Typography style={{fontWeight:600}}>Sample infomation:</Typography>
                </Box>
                <Box xs={12} item={true}>
                  <DatePickerCustom 
                  dateFormat={sampleFormat} 
                  onFormatChange={onSampleFormatChange} 
                  values={dateFormatValues} 
                  label="Sample Collection Date" 
                  value ={sampleDate}
                  yearsBP={sampleYearsBP}
                  onYearsBPChange={onSampleYearsBPChange} 
                  setValue={setSampleDate} />
                </Box>
                <Box item={true} xs={12} sm={6}>
                    <TextField 
                        placeholder="Enter number from 0 to 90" 
                        label="Collection Location Longitude" 
                        variant="outlined" 
                        type="number"
                        value={sampleLon}
                        onChange={onSampleLonChange}
                        fullWidth>
                    </TextField>
                </Box>
                <Box item={true} xs={12} sm={6}>
                    <TextField 
                        placeholder="Enter number from 0 to 90" 
                        label="Collection Location Latitude" 
                        variant="outlined" 
                        type="number"
                        value={sampleLat}
                        onChange={onSampleLatChange}
                        InputProps={{
                          inputProps: { 
                              max: 90, min: 0 
                          }
                        }}
                        fullWidth>
                    </TextField>
                </Box>
                <Box xs ={12}  item={true}>
                  <Typography style={{fontWeight:600}}>Image infomation:</Typography>
                  <Typography style={{color:"#8f8f8f"}} >Tips: If you name your images following our naming convention. Our system will automatically get data from your filename.</Typography>
                </Box>
                <Box item={true} xs={4} >
                    <TextField 
                        label="Follow our Naming Convention" 
                        variant="outlined" 
                        select
                        value={followConvention}
                        onChange={onFollowChange}
                        error={followValid.error} 
                        helperText={followValid.helperText}
                        fullWidth 
                        required >
                            {Object.keys(booleanList).map(key => (
                            <MenuItem key = {key} value={booleanList[key]}>{key} </MenuItem>
                            ))}
                        </TextField>
                </Box>
                <Box item={true} xs={8}/>
                {followConvention==false?
                (<Box container xs={12} spacing={2} style={{paddingLeft:7}}><Box item={true} xs={12} sm={4}>
                    <TextField 
                        placeholder="Enter number only" 
                        label="Magnification" 
                        variant="outlined" 
                        type="number"
                        value={magnification}
                        onChange={onMgChange}
                        error={magValid.error} 
                        helperText={magValid.helperText}
                        fullWidth 
                        required >
                    </TextField>
                </Box>
                <Box item={true} xs={12} sm={4}>
                    <TextField 
                        label="Grain Size Lower Bound" 
                        variant="outlined" 
                        select
                        value={gsLow}
                        onChange={onGsLowChange}
                        fullWidth
                        error={gsLowValid.error} 
                        helperText={gsLowValid.error?gsLowValid.helperText:"Please ensure Upper Bound is greater than or equal to Lower Bound"}
                        required >
                            {gsValue.map(item => (
                            <MenuItem key = {item} value={item}>{item} </MenuItem>
                            ))}
                        </TextField>
                </Box>
                <Box item={true} xs={12} sm={4}>
                    <TextField 
                        label="Grain Size Upper Bound" 
                        variant="outlined" 
                        select
                        value={gsUp}
                        onChange={onGsUpChange}
                        error={gsUpValid.error} 
                        helperText={gsUpValid.helperText}
                        fullWidth 
                        required >
                            {gsValue.map(item => (
                            <MenuItem key = {item} value={item}>{item} </MenuItem>
                            ))}
                    </TextField>
                </Box>
                <Box item={true} xs={12} >
                    <Typography style={{fontWeight:600}}> Tell us more about your data (optional):</Typography>
                </Box>
                <Box item={true} xs={12} sm={6}>
                    <TextField 
                        label="Basic Component" 
                        variant="outlined" 
                        select
                        value={bComp}
                        onChange={onBCompChange}
                        fullWidth 
                        optional >
                            {bComps.map(item => (
                           <MenuItem key = {item} value={item}>{item} </MenuItem>
                            ))}
                    </TextField>
                </Box>
                {bComp == "Free Crystal"?
                <Box item={true} xs={12} sm={6}>
                    <TextField 
                        label="Crystal Type" 
                        variant="outlined" 
                        select
                        value={cType}
                        onChange={onCTypeChange}
                        fullWidth 
                        optional >
                            {cTypes.map(item => (
                           <MenuItem key = {item} value={item}>{item} </MenuItem>
                            ))}
                    </TextField>
                </Box>
                :bComp == "Altered Material"?
                <Box item={true} xs={12} sm={6}>
                  <TextField 
                      label="Altered Material Type" 
                      variant="outlined" 
                      select
                      value={aType}
                      onChange={onATypeChange}
                      fullWidth 
                      optional >
                          {aTypes.map(item => (
                        <MenuItem key = {item} value={item}>{item} </MenuItem>
                          ))}
                  </TextField>
                </Box>
                :bComp == "Juvenile"?
                <Box item={true} xs={12} sm={6}>
                  <TextField 
                      label="Juvenile Type" 
                      variant="outlined" 
                      select
                      value={jType}
                      onChange={onJTypeChange}
                      fullWidth 
                      optional >
                          {jTypes.map(item => (
                        <MenuItem key = {item} value={item}>{item} </MenuItem>
                          ))}
                  </TextField>
                </Box>:<Box item={true} xs ={12} sm={6}> </Box>}
                <Box item={true} xs={12} sm={4}>
                <TextField 
                        label="Shape" 
                        variant="outlined" 
                        select
                        value={shape}
                        onChange={onShapeChange}
                        fullWidth 
                        optional >
                            {shapes.map(item => (
                            <MenuItem key = {item} value={item}>{item} </MenuItem>
                            ))}
                    </TextField>
                </Box>
                <Box item={true} xs={12} sm={4}>
                <TextField 
                        label="Crystallinity and Color" 
                        variant="outlined" 
                        select
                        value={crys}
                        onChange={onCrysChange}
                        fullWidth 
                        optional >
                            {crystallinity.map(item => (
                            <MenuItem key = {item} value={item}>{item} </MenuItem>
                            ))}
                    </TextField>
                </Box>
                <Box item={true} xs={12} sm={4}>
                <TextField 
                        label="Alteration Degree" 
                        variant="outlined" 
                        select
                        value={alteration}
                        onChange={onAltChange}
                        fullWidth 
                        optional >
                            {alterations.map(item => (
                            <MenuItem key = {item} value={item}>{item} </MenuItem>
                            ))}
                    </TextField>
                </Box></Box>):null}
                <Box item={true} xs={12} >
                    <Typography style={{color:"#7d7d7d"}}> * means required</Typography>
                </Box>
              </Box>
            </form>
            {buttonClicked?<div>
                <Button
                        className={classes.tableButton}
                        variant="contained" 
                        color="success"
                        onClick={()=>{handleTableClick()}}
                        style={{marginBottom:"10px"}}
                >
                    Refresh Table
                </Button>
                    <Table data={data} setData={setData}/>
                    </div>:
                    <div>                
                    <Button
                        className={classes.tableButton}
                        variant="contained" 
                        color="success"
                        onClick={()=>{handleTableClick()}}
                        style={{marginBottom:"10px"}}
                >
                    Show in Table
                </Button></div>}
                <div className={classes.submitandLoading}>
                  {isLoading?<CircularProgress className={classes.loading} />:null}
                <Button
                  className={classes.submitButton}
                  variant="contained" 
                  onClick={onSubmit}
                  >
                  Submit
              </Button>
              </div>

                
          </CardContent>
        </Card>
      </Box>
        </div>
    )
}

export default ContributePage
