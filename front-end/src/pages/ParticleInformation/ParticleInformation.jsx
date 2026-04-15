import React, { useState } from 'react';
import AnnotationDistribution from '../AnalyticPlots/AnnotationDistribution';
import { Title, PhysicalChar, SpanRender, SpanInformation, MainTypeRender, Information, TitleInformation, InfoIconRender, LinkRender } from './ParticleInformation.style';
import { IconButton, Tooltip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

/**
 * ParticleInformation: Component that displays detailed information about particles.
 * Utilizes Material-UI and MUI components for UI elements and styling.
 * 
 * @param {object} props - The properties object.
 * @param {object} props.info - Contains various pieces of information about the particle.
 * @param {string} props.bgcolor - Background color for the AnnotationDistribution component.
 * @param {string} props.size - Size parameter for the AnnotationDistribution component.
 * @param {string} props.visibilityMode - Visibility mode for the AnnotationDistribution component.
 * @param {object} props.result - Contains distribution data for the AnnotationDistribution component.
 * @param {string} props.userRole - User role to determine visibility of certain elements.
 * @returns {JSX.Element} - The rendered ParticleInformation component.
 */
const ParticleInformation = (props) => {
    // State hooks for managing the visibility of different sections
    const [physicalCharOpen, setPhysicalCharOpen] = useState(false);
    const [particleInfOpen, setParticleInfOpen] = useState(true);
    const [metadataInfOpen, setMetadataInfOpen] = useState(true);

    /**
     * Toggles the visibility of the Metadata Information section.
     */
    const toggleMetadataInf = () => {
        setMetadataInfOpen(!metadataInfOpen);
    };

    /**
     * Toggles the visibility of the Particle Information section.
     */
    const toggleParticleInf = () => {
        setParticleInfOpen(!particleInfOpen);
    };

    /**
     * Toggles the visibility of the Physical Characteristics section.
     */
    const togglePhysicalChar = () => {
        setPhysicalCharOpen(!physicalCharOpen);
    };

    return (
        <div>
            {/* Metadata Information section */}
            <Information>
                <IconButton onClick={toggleMetadataInf}>
                    {metadataInfOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                </IconButton>
                <TitleInformation>Metadata</TitleInformation>
            </Information>

            {/* Conditionally rendered Metadata Information */}
            {metadataInfOpen && (
                <div>
                    <p>
                        <SpanRender>id: </SpanRender> 
                        {props.info.id}
                    </p>

                    {props.info.sample_code && 
                        <p>
                            <SpanRender>Sample code: </SpanRender> 
                            {props.info.sample_code}
                        </p>
                    }

                    {props.info.index && 
                        <p>
                            <SpanRender>index: </SpanRender> 
                            {props.info.index}
                        </p>
                    }
                    <p>
                        <SpanRender>volcano name: </SpanRender> 
                        {props.info.volc_name}
                    </p>
                    
                    {props.info.afe_code && 
                        <p>
                            <SpanRender>eruption code: </SpanRender> 
                            {props.info.afe_code}
                        </p>
                    }

                    {props.info.instrument && 
                        <p>
                            <SpanRender>instrument: </SpanRender> {props.info.instrument}
                        </p>
                    }

                    {props.info.magnification && 
                        <p>
                            <SpanRender>magnification: </SpanRender> {props.info.magnification}
                        </p>
                    }

                    {props.info.sample_nat && 
                        <p>
                            <SpanRender>type: </SpanRender> 
                            {props.info.sample_nat ? "natural" : "experimental"}
                        </p>
                    }

                    {props.info.sample_date && 
                        <p>
                            <SpanRender>date: </SpanRender> {new Date(props.info.sample_date).toISOString().substr(0, 10) }
                        </p>
                    }

                    {props.info.sample_lat && props.info.sample_lon && 
                        <p>
                            <SpanRender>Coordinate: </SpanRender> {props.info.sample_lat}, {props.info.sample_lon}
                        </p>
                    }

                    {props.info.lab_procedure && 
                        
                        <SpanInformation>
                            <p>
                                <SpanRender>Lab procedure:
                                    <Tooltip disableFocusListener disableTouchListener title={
                                        <p>Example of lab procedure (eg.: cleaning, sieving, leaching, etc.)</p>
                                    }>
                                        <InfoIconRender fontSize='revert'/>
                                    </Tooltip>
                                </SpanRender>
                                
                                 {props.info.lab_procedure.join(', ')}
                            </p>
                        </SpanInformation>
                        
                    }

                    {props.info.ultrasound && 
                        
                        <SpanInformation>
                            <p>
                                <SpanRender>Ultrasonically cleaned: 
                                    <Tooltip disableFocusListener disableTouchListener title={
                                        <p>Explain if the sample has been ultrasonically cleaned</p>
                                    }>
                                        <InfoIconRender fontSize='revert'/>
                                    </Tooltip>
                                </SpanRender> {props.info.ultrasound ? "True" : "False"}
                            </p>
                        </SpanInformation>
                        
                    }

                    {props.info.sample_surf && 
                        <SpanInformation>
                            <p>
                                <SpanRender>Surface: 
                                    <Tooltip disableFocusListener disableTouchListener title={
                                        <p>Type of surface where sample has been collected (eg.: Roof, Ground, etc.)</p>
                                    }>
                                        <InfoIconRender fontSize='revert'/>
                                    </Tooltip>
                                </SpanRender> {props.info.sample_surf}
                            </p>
                        </SpanInformation>
                    }

                    {props.info.sample_techn && 

                        <SpanInformation>
                            <p>
                                <SpanRender>Sampling Technique: 
                                    <Tooltip disableFocusListener disableTouchListener title={
                                        <p>Techniques/Tools used during sampling</p>
                                    }>
                                        <InfoIconRender fontSize='revert'/>
                                    </Tooltip>
                                </SpanRender> {props.info.sample_techn}
                            </p>
                        </SpanInformation>
                    }

                    {props.info.sample_collector && 
                        <SpanInformation>
                            <p>
                                <SpanRender>Collectors: 
                                    <Tooltip disableFocusListener disableTouchListener title={
                                        <p>Name of person who collected the sample</p>
                                    }>
                                        <InfoIconRender fontSize='revert'/>
                                    </Tooltip>
                                </SpanRender> {props.info.sample_collector}
                            </p>
                        </SpanInformation>
                    }

                    {props.info.experiment_duration && 
                        <SpanInformation>
                            <p>
                                <SpanRender>Experiment Duration: 
                                    <Tooltip disableFocusListener disableTouchListener title={
                                        <p>Duration of the experimentation in minutes</p>
                                    }>
                                        <InfoIconRender fontSize='revert'/>
                                    </Tooltip>
                                </SpanRender> {props.info.experiment_duration}
                            </p>
                        </SpanInformation>
                    }

                    {props.info.temperature_lower_bound && 
                        <SpanInformation>
                            <p>
                                <SpanRender>Temperature lower bound: 
                                    <Tooltip disableFocusListener disableTouchListener title={
                                        <p>Lower bound of the temperature used during experimentation (in °C)</p>
                                    }>
                                        <InfoIconRender fontSize='revert'/>
                                    </Tooltip>
                                </SpanRender> {props.info.temperature_lower_bound}
                            </p>
                        </SpanInformation>
                    }

                    {props.info.temperature_upper_bound && 
                        <SpanInformation>
                            <p>
                                <SpanRender>Temperature upper bound: 
                                    <Tooltip disableFocusListener disableTouchListener title={
                                        <p>Upper bound of the temperature used during experimentation (in °C)</p>
                                    }>
                                        <InfoIconRender fontSize='revert'/>
                                    </Tooltip>
                                </SpanRender> {props.info.temperature_upper_bound}
                            </p>
                        </SpanInformation>
                    }

                    {props.info.oxygen_fugacity && 
                        <SpanInformation>
                            <p>
                                <SpanRender>Oxygen fugacity: 
                                    <Tooltip disableFocusListener disableTouchListener title={
                                        <p>Oxygen fugacity used (eg.: low, high, etc.)</p>
                                    }>
                                        <InfoIconRender fontSize='revert'/>
                                    </Tooltip>
                                </SpanRender> {props.info.oxygen_fugacity}
                            </p>
                        </SpanInformation>
                    }
                </div>
            )}

            {/* Particle Information section */}
            <Information>
                <IconButton onClick={toggleParticleInf}>
                    {particleInfOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                </IconButton>
                <TitleInformation>Particle Information</TitleInformation>
            </Information>

            {/* Conditionally rendered Particle Information */}
            {particleInfOpen && (
                <div>
                    {props.info.main_type && 
                        <div>
                            <p><SpanRender>main type:</SpanRender></p>
                            {Object.entries(props.info.main_type).map(([key, value]) => (
                                <p key={key}><MainTypeRender>{key}:</MainTypeRender> {value}%</p>
                            ))}
                        </div>
                    }

                    {props.info.sub_type && 
                        <p>
                            <SpanRender>sub type: </SpanRender> {props.info.sub_type}
                        </p>
                    }

                    {props.info.color && 
                        <p>
                            <SpanRender>color: </SpanRender> {props.info.color}
                        </p>
                    }

                    {props.info.luster &&
                        <p>
                            <SpanRender>luster: </SpanRender> {props.info.luster}
                        </p>
                    }

                    {props.info.edge &&
                        <p>
                            <SpanRender>edge: </SpanRender> {props.info.edge}
                        </p>
                    }

                    {props.info.crystallinity &&
                        <p>
                            <SpanRender>crystallinity: </SpanRender> {props.info.crystallinity}
                        </p>
                    }

                    {props.info.hydro_alter_degree &&
                        <p>
                            <SpanRender>hydrothermally alteration degree: </SpanRender> {props.info.hydro_alter_degree}
                        </p>
                    }

                    {props.info.shape &&
                        <p>
                            <SpanRender>shape: </SpanRender> {props.info.shape}
                        </p>
                    }

                    {props.info.weathering_sign &&
                        <p>
                            <SpanRender>weathering sign: </SpanRender> {props.info.weathering_sign}
                        </p>
                    }

                    {props.info.eruptive_style && 
                        <p>
                            <SpanRender>eruptive style: </SpanRender> {props.info.eruptive_style}
                        </p>
                    }

                    {typeof props.info.gsLow !== "undefined" && typeof props.info.gsUp !== "undefined" &&
                        <p>
                            <SpanRender>grain size: </SpanRender> phi{props.info.gsLow}-phi{props.info.gsUp}
                        </p>
                    }
                </div>
            )}

            {/* Physical Characteristics section */}
            <Information>
                <IconButton onClick={togglePhysicalChar}>
                    {physicalCharOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                </IconButton>
                <TitleInformation>Physical characteristics
                    <Tooltip disableFocusListener disableTouchListener title={
                        <React.Fragment>
                            <p>References:</p>
                            <p> 
                                <LinkRender href="https://link.springer.com/article/10.1007/s00445-023-01695-4/tables/1">[1]</LinkRender> 
                                Particle properties definitions
                            </p>
                            <p>
                                <LinkRender href="https://link.springer.com/article/10.1007/s00445-023-01695-4/tables/2">[2]</LinkRender>
                                Calculating features
                            </p>
                        </React.Fragment>
                    }>
                        <InfoIconRender fontSize='revert'/>
                    </Tooltip>
                </TitleInformation>
                
            </Information>

            {/* Conditionally rendered Physical Characteristics */}
            {physicalCharOpen && (
                <PhysicalChar>
                    <Title>Shape features</Title>
                    {props.info.aspect_rat && <p><SpanRender>aspect ratio: </SpanRender>{props.info.aspect_rat.toFixed(2)}</p>}
                    {props.info.circularity_cioni && <p><SpanRender>circularity (Cioni): </SpanRender>{props.info.circularity_cioni.toFixed(2)}</p>}
                    {props.info.circularity_dellino && <p><SpanRender>circularity (Dellino): </SpanRender>{props.info.circularity_dellino.toFixed(2)}</p>}
                    {props.info.compactness && <p><SpanRender>compactness: </SpanRender>{props.info.compactness.toFixed(2)}</p>}
                    {props.info.convexity && <p><SpanRender>convexity: </SpanRender>{props.info.convexity.toFixed(2)}</p>}
                    {props.info.elongation && <p><SpanRender>elongation: </SpanRender>{props.info.elongation.toFixed(2)}</p>}
                    {props.info.rectangularity && <p><SpanRender>rectangularity: </SpanRender>{props.info.rectangularity.toFixed(2)}</p>}
                    {props.info.roundness && <p><SpanRender>roundness: </SpanRender>{props.info.roundness.toFixed(2)}</p>}
                    {props.info.solidity && <p><SpanRender>solidity: </SpanRender>{props.info.solidity.toFixed(2)}</p>}

                    <Title>Textural features</Title>
                    {props.info.asm && <p><SpanRender>asm: </SpanRender>{props.info.asm.toFixed(2)}</p>}
                    {props.info.contrast && <p><SpanRender>contrast: </SpanRender>{props.info.contrast.toFixed(2)}</p>}
                    {props.info.correlation && <p><SpanRender>correlation: </SpanRender>{props.info.correlation.toFixed(2)}</p>}
                    {props.info.dissimilarity && <p><SpanRender>dissimilarity: </SpanRender>{props.info.dissimilarity.toFixed(2)}</p>}
                    {props.info.energy && <p><SpanRender>energy: </SpanRender>{props.info.energy.toFixed(2)}</p>}
                    {props.info.homogeneity && <p><SpanRender>homogeneity: </SpanRender>{props.info.homogeneity.toFixed(2)}</p>}

                    <Title>Color features</Title>
                    {props.info.blue_mean && <p><SpanRender>blue mean: </SpanRender>{props.info.blue_mean.toFixed(2)}</p>}
                    {props.info.blue_mode && <p><SpanRender>blue mode: </SpanRender>{props.info.blue_mode.toFixed(2)}</p>}
                    {props.info.blue_std && <p><SpanRender>blue std: </SpanRender>{props.info.blue_std.toFixed(2)}</p>}
                    {props.info.green_mean && <p><SpanRender>green mean: </SpanRender>{props.info.green_mean.toFixed(2)}</p>}
                    {props.info.green_mode && <p><SpanRender>green mode: </SpanRender>{props.info.green_mode.toFixed(2)}</p>}
                    {props.info.green_std && <p><SpanRender>green std: </SpanRender>{props.info.green_std.toFixed(2)}</p>}
                    {props.info.hue_mean && <p><SpanRender>hue mean: </SpanRender>{props.info.hue_mean.toFixed(2)}</p>}
                    {props.info.hue_mode && <p><SpanRender>hue mode: </SpanRender>{props.info.hue_mode.toFixed(2)}</p>}
                    {props.info.hue_std && <p><SpanRender>hue std: </SpanRender>{props.info.hue_std.toFixed(2)}</p>}
                    {props.info.red_mean && <p><SpanRender>red mean: </SpanRender>{props.info.red_mean.toFixed(2)}</p>}
                    {props.info.red_mode && <p><SpanRender>red mode: </SpanRender>{props.info.red_mode.toFixed(2)}</p>}
                    {props.info.red_std && <p><SpanRender>red std: </SpanRender>{props.info.red_std.toFixed(2)}</p>}
                    {props.info.saturation_mean && <p><SpanRender>saturation mean: </SpanRender>{props.info.saturation_mean.toFixed(2)}</p>}
                    {props.info.saturation_mode && <p><SpanRender>saturation mode: </SpanRender>{props.info.saturation_mode.toFixed(2)}</p>}
                    {props.info.saturation_std && <p><SpanRender>saturation std: </SpanRender>{props.info.saturation_std.toFixed(2)}</p>}
                    {props.info.value_mean && <p><SpanRender>value mean: </SpanRender>{props.info.value_mean.toFixed(2)}</p>}
                    {props.info.value_mode && <p><SpanRender>value mode: </SpanRender>{props.info.value_mode.toFixed(2)}</p>}
                    {props.info.value_std && <p><SpanRender>value std: </SpanRender>{props.info.value_std.toFixed(2)}</p>}
                </PhysicalChar>
            )}  

            {/* Conditionally rendered AnnotationDistribution component */}
            {props.userRole === 'team member' && props.result.distribution.length > 0 && (
                <AnnotationDistribution bgcolor={props.bgcolor} size={props.size} visibilityMode={props.visibilityMode} data={props.result.distribution[0]} />
            )}
        </div>
    );
};

export default ParticleInformation;
