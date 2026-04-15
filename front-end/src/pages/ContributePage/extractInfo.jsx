export default function extractInfo(file,volc_num,filepath){
    const breakDown = file.split('_')
    if(breakDown.length!=8) {return undefined}
    if(breakDown[6].length!=8) {return undefined}
    if(breakDown[4][1]== undefined) {return undefined}
    const afe = {
        volc_num: volc_num,
        afe_id: breakDown[0]
    }
    const sample = {
        volc_num: volc_num,
        afe_id: breakDown[0],
        sample_id: parseInt(breakDown[1],10)
    }
    const particle = {
        volc_num: volc_num,
        afe_id: breakDown[0],
        sample_id: breakDown[1],
        id: breakDown[3],
        batch: breakDown[2],
        imgURL: filepath,
        
        magnification: breakDown[5][0]
    }
    if(breakDown[6]=="morephi0"){
        particle.gsLow = 0
        particle.gsUp = -1
    }else{
        particle.gsLow = breakDown[6][3]
        particle.gsUp = breakDown[6][7]
    }
    if(breakDown[4][0]=='b'){
        particle.instrument = "binocular";
        particle.index = breakDown[4][1]
        particle.multi_focus = false
    }else {
        particle.multi_focus = true
    }
    const label = breakDown[7]
    switch(label){
        case "PG": particle.main_type = "free crystal"; particle.sub_type = "plagioclase";break;
        case "PX": particle.main_type = "free crystal";particle.sub_type = "pyroxene";break;
        case "AMF": particle.main_type = "free crystal";particle.sub_type = "amfibole";break;
        case "SU": particle.main_type = "free crystal";particle.sub_type = "sulfide";break;
        case "OL": particle.main_type = "free crystal";particle.sub_type = "olivine";break;
        case "OT": particle.main_type = "free crystal";particle.sub_type = "others";break;
        default: 
            if(label[0]=='J'){
                particle.main_type = "juvenile"
                switch(label[1]){
                    case "J": particle.sub_type = "standard juvenile"; break;
                    case "H": particle.sub_type = "hydrothermally altered juvenile"; break;
                }

                switch(label.slice(2,4)){
                    case "tr": particle.color = "transparent"; break;
                    case "bl": particle.color = "black"; break;
                    default: particle.color = ""
                }
                switch(label.slice(4,6)){
                    case "lc": particle.crystallinity = "low"; break;
                    case "mc": particle.crystallinity = "mid"; break;
                    case "hc": particle.crystallinity = "high"; break;
                    default: particle.crystallinity = ""
                }
                let i
                if(label[1]=="J"){
                    i=6
                }else{
                    i=7
                    switch(label[6]){
                        case "n": particle.hydro_alter_degree = "none"; break;
                        case "l": particle.hydro_alter_degree = "slight"; break;
                        case "m": particle.hydro_alter_degree = "moderate"; break;
                        case "h": particle.hydro_alter_degree = "high"; break;
                        default: particle.hydro_alter_degree = ""
                    }
                }
                switch(label.slice(i)){
                    case "b": particle.shape = "blocky";break;
                    case "f": particle.shape = "fluidal";break;
                    case "s": particle.shape = "spongy";break;
                    case "hv": particle.shape = "highly vesicular";break;
                    case "mt": particle.shape = "microtubular";break;
                    case "p": particle.shape = "pumice";break;
                    default: particle.shape = "";break;
                }
            }else if(label[0]=="A"){
                particle.main_type = "altered material"
                switch(label[1]){
                    case "W": particle.sub_type = "weathered material";break;
                    case "H": particle.sub_type = "hydrothermally altered material";break;
                    default: particle.sub_type = ""
                }
                if(label[1]=="H"){
                    if(label[2]=="t" || label[2]=="b"){
                        switch(label.slice(2,4)){
                            case "tr": particle.color = "transparent"; break;
                            case "bl": particle.color = "black"; break;
                            default: particle.color = ""
                        }
                        switch(label.slice(4,6)){
                            case "lc": particle.crystallinity = "low"; break;
                            case "mc": particle.crystallinity = "mid"; break;
                            case "hc": particle.crystallinity = "high"; break;
                            default: particle.crystallinity = ""
                        }
                        switch(label[6]){
                            case "m": particle.hydro_alter_degree = "moderate"; break;
                            case "h": particle.hydro_alter_degree = "high"; break;
                            default: particle.hydro_alter_degree = ""
                        }
                    }else if(label[2]=="a"){
                        particle.shape = "aggregate"
                    }else{
                        switch(label[2]){
                            case "l": particle.hydro_alter_degree = "slight"; break;
                            case "m": particle.hydro_alter_degree = "moderate"; break;
                            case "h": particle.hydro_alter_degree = "high"; break;
                            default: particle.hydro_alter_degree = ""
                        }
                    }
                }
            }
            else{
                particle.main_type = "lithic"
                switch(label[1]){
                    case "L": particle.sub_type = "standard lithic"; break;
                    case "J": particle.sub_type = "recycled juvenile"; break;
                    default: particle.sub_type = ""
                }
                switch(label.slice(2,4)){
                    case "tr": particle.color = "transparent"; break;
                    case "bl": particle.color = "black"; break;
                    default: particle.color = ""
                }
                switch(label.slice(4,6)){
                    case "lc": particle.crystallinity = "low"; break;
                    case "mc": particle.crystallinity = "mid"; break;
                    case "hc": particle.crystallinity = "high"; break;
                    default: particle.crystallinity = ""
                }
                if(label[1]=="L"){
                    switch(label[6]){
                        case "n": particle.hydro_alter_degree = "none"; break;
                        case "l": particle.hydro_alter_degree = "slight"; break;
                        default: particle.hydro_alter_degree = ""
                    }
                }else{
                    switch(label.slice(6)){
                        case "b": particle.shape = "blocky";break;
                        case "f": particle.shape = "fluidal";break;
                        case "s": particle.shape = "spongy";break;
                        case "hv": particle.shape = "highly vesicular";break;
                        case "mt": particle.shape = "microtubular";break;
                        case "p": particle.shape = "pumice";break;
                        default: particle.shape = "";break;
                    }
                }
            }
            
    }
    Object.keys(particle).map(key=>{
        if(particle[key] == undefined) return undefined
    })
    const info = {
        afe: afe,
        sample: sample,
        particle: particle
    }
     return info;

}