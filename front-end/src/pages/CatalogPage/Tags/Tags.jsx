import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { TagsRender } from './Tags.styles';
import Select from 'react-select';
import dataTemplate from "./Tags.json" // Importing tag data template

/**
 * Tags: A component for selecting and filtering tags using react-select.
 * Utilizes forwardRef to allow parent components to control the tag selection.
 * 
 * @param {object} props - The properties passed to the component.
 * @param {object} ref - The ref object to expose methods to parent components.
 * @returns {JSX.Element} The rendered component.
 */
const Tags = forwardRef((props, ref) => {
    const tagsNamesRef = useRef(props.tags); // Reference to the tags array passed in props

    const [selectedTags, setSelectedTags] = useState({}); // State for holding selected tags
    const [tectonicSettingSelected, setTectonicSettingSelected] = useState(false); // State for holding selected tags

    // Function to generate options for tag filters dynamically
    const generateOptions = (tag, filteredParticles, filterKey, matchKey, labelCallback = (choice, count) => `${choice} (${count})`) => {
        let particlesAssociatedToAfe = [];
        if (filterKey === 'afe_code') {
            // Collect particle objects with valid 'afe_code' and date information
            particlesAssociatedToAfe = filteredParticles.filter(particle => 
                particle.afe_code && (particle.afe_date || particle.afe_dateBP)
            );

            // Map particle objects to string representation with volcano name and formatted date
            tag.choices = [...new Set(particlesAssociatedToAfe.map(particle => {
                let displayText;
                if (particle.afe_date) {
                    const date = new Date(particle.afe_date);
                    const day = date.getDate();
                    const month = date.toLocaleString('en-US', { month: 'short' });
                    const year = date.getFullYear();
                    displayText = `${particle.volc_name}: ${day} ${month}. ${year}`;
                } else if (particle.afe_dateBP) {
                    displayText = `${particle.volc_name}: ${-particle.afe_dateBP} BP`;
                } else {
                    displayText = null;
                }
                return displayText ? `${displayText}|${particle.afe_code}` : null;
            }).filter(afe => afe !== null))]; // Filter out any null values
        }

        return {
            oriTag: tag.oriTag,
            options: tag.choices.map(choice => {
                let matchingParticlesCount;
                if (filterKey === 'afe_code') {
                    const parts = choice.split("|");
                    const displayText = parts[0];
                    const afeCode = parts[1];

                    matchingParticlesCount = particlesAssociatedToAfe.filter(particle => 
                        particle.afe_code === afeCode
                    ).length;

                    return {
                        label: labelCallback(displayText, matchingParticlesCount),
                        value: afeCode
                    };

                } else {
                    if (matchKey === 'main_type') {
                        matchingParticlesCount = filteredParticles.filter(particle => 
                            Object.entries(particle.main_type).some(([key, value]) => key === choice && value === 100)
                        ).length;
                    } else if (matchKey === 'imgURL') {
                        const regex = new RegExp(choice, 'i'); // 'i' makes the regex case-insensitive
                        matchingParticlesCount = filteredParticles.filter(particle => 
                            regex.test(particle.imgURL)
                        ).length;
                    } else {
                        matchingParticlesCount = filteredParticles.filter(particle => 
                            filterKey ? particle[filterKey] === choice : particle[matchKey].includes(choice)
                        ).length;
                    }
                    return {
                        label: labelCallback(choice, matchingParticlesCount),
                        value: choice
                    };
                }
            }),
            id: tag.id,
        };
    };   

    useEffect(() => {


        const filterKeys = ['tectonic_settings', 'volc_name', 'imgURL', 'afe_code', 'eruptive_style', 'shape', 'crystallinity', 'color', 'hydro_alter_degree', 'sub_type']

        const volcanoNames = props.volcanoes.map(volcano => volcano.volcano_details.volc_name);
        dataTemplate["volcanoName"].choices = volcanoNames;

        const initialTags = Object.values(dataTemplate).map(tag => {

            let filteredParticles = props.particles;

            Object.values(selectedTags).forEach(filterValue => {
                // Check if the particle matches the selected filter based on its filterKey or matchKey
                filteredParticles = filteredParticles.filter(particle => {
                    // Apply filter based on main_type or a generic key in particle
                    if ((filterValue === 'free crystal') || (filterValue === 'altered material') || (filterValue === 'juvenile') || (filterValue === 'lithic')) {
                        return Object.entries(particle.main_type).some(([key, value]) => key === filterValue && value === 100);
                    } else if (['phi0phi1', 'phi1phi2', 'unsieved', 'mesh60', 'mesh120'].includes(filterValue)) {
                        // For specific size/matching filters, use regex
                        const regex = new RegExp(filterValue, 'i'); // 'i' for case-insensitive
                        return filterKeys.some(filterKey => regex.test(particle[filterKey] || ''));
                    } else {
                        return filterKeys.some(filterKey => particle[filterKey]?.includes(filterValue) || particle[filterKey] === filterValue);
                    }
                });
            });

            switch (tag.oriTag) {
                case 'Tectonic Setting':
                    return generateOptions(tag, filteredParticles, 'tectonic_settings');
                case 'Volcano Name':
                    return generateOptions(tag, filteredParticles, 'volc_name');
                case 'Ash Forming Events':
                    return generateOptions(tag, filteredParticles, 'afe_code');
                case 'Eruptive Style':
                    return generateOptions(tag, filteredParticles, 'eruptive_style');
                case 'Grain Size':
                    return generateOptions(tag, filteredParticles, null, 'imgURL');
                case 'Main Type':
                    return generateOptions(tag, filteredParticles, null, 'main_type', (choice, count) => `${choice} (${count})`);
                case 'Shape':
                    return generateOptions(tag, filteredParticles, 'shape');
                case 'Crystallinity':
                    return generateOptions(tag, filteredParticles, 'crystallinity');
                case 'Color':
                    return generateOptions(tag, filteredParticles, 'color');
                case 'Hydrothermal Alteration Degree':
                    return generateOptions(tag, filteredParticles, 'hydro_alter_degree');
                case 'Juvenile Type':
                    return generateOptions(tag, filteredParticles, 'sub_type');
                case 'Lithic Type':
                    return generateOptions(tag, filteredParticles, 'sub_type');
                case 'Altered Material Type':
                    return generateOptions(tag, filteredParticles, 'sub_type');
                case 'Free Crystal Type':
                    return generateOptions(tag, filteredParticles, 'sub_type');                        
                default:
                    return generateOptions(tag, filteredParticles);
            }
        });

        props.setTagList(initialTags);
    }, [tectonicSettingSelected, props.volcanoes, props.particles, selectedTags]);

    /**
     * handleSelectChange: Handles the change event of the select component.
     * Updates the tag list and selected tags based on the selected option.
     * 
     * @param {object} selectedOption - The selected option object from react-select.
     * @param {number} tagId - The ID of the tag being updated.
     */
    const handleSelectChange = (selectedOption, tagId) => {
        const updatedTagList = [...props.tagList];
        const updatedTags = [...tagsNamesRef.current];
        const newSelectedTags = { ...selectedTags };
        
        const selectedValue = selectedOption ? selectedOption.value : "";

        if (selectedValue === "") {
            // Remove the tag if the selected value is empty
            delete newSelectedTags[tagId];
            updatedTagList[tagId].currentChoice = null;

            if (tagId === 0) {
                // If tectonicSetting (tagId 0) is cleared, also clear volcanoName (tagId 1)
                delete newSelectedTags[1];
                setTectonicSettingSelected(!tectonicSettingSelected);
            }

            if (tagId === 1) {
                // If volcanoName (tagId 1) is cleared, also clear Ash Forming Events (tagId 2)
                delete newSelectedTags[2];
                updatedTagList[2].options = [];
            }

            if (tagId === 5) {
                // If main-type (tagId 5) is cleared, also clear sub types (tagId 10,11,12,13)
                delete newSelectedTags[10]; 
                delete newSelectedTags[11]; 
                delete newSelectedTags[12]; 
                delete newSelectedTags[13]; 
                updatedTagList.forEach(tag => {
                    if ([10, 11, 12, 13].includes(tag.id)) {
                        tag.disabled = false;
                        tag.currentChoice = null;
                    }
                });
            }
        } else {
            // Update selected tags and handle logic for disabling other tags
            updatedTagList[tagId].currentChoice = selectedValue;
            newSelectedTags[tagId] = selectedValue;
            
            if (tagId === 5) { 
                const mainType = selectedValue.toLowerCase();
                switch (mainType) {
                    case "free crystal":
                        updatedTagList.forEach(tag => {
                            if (tag.id === 13) { 
                                tag.disabled = false;
                            } else if ([10, 11, 12].includes(tag.id)) { 
                                tag.disabled = true;
                            }
                        });
                        break;
                    case "altered material":
                        updatedTagList.forEach(tag => {
                            if (tag.id === 12) { 
                                tag.disabled = false;
                            } else if ([10, 11, 13].includes(tag.id)) { 
                                tag.disabled = true;
                            }
                        });
                        break;
                    case "juvenile":
                        updatedTagList.forEach(tag => {
                            if (tag.id === 10) { 
                                tag.disabled = false;
                            } else if ([11, 12, 13].includes(tag.id)) { 
                                tag.disabled = true;
                            }
                        });
                        break;
                    case "lithic":
                        updatedTagList.forEach(tag => {
                            if (tag.id === 11) { 
                                tag.disabled = false;
                            } else if ([10, 12, 13].includes(tag.id)) { 
                                tag.disabled = true;
                            }
                        });
                        break;
                    default:
                        updatedTagList.forEach(tag => {
                            tag.disabled = false;
                        });
                        break;
                }
            }
        }

        if ([10, 11, 12, 13].includes(tagId)) {
            // Handle subtype selection and update the main_type tag
            updatedTagList.forEach(tag => {
                if ([10, 11, 12, 13].includes(tag.id)) {
                    if (tag.id === tagId) {
                        tag.disabled = false;
                    } else {
                        tag.disabled = true;
                    }
                }
            });

            switch (tagId) {
                case 10: // Juvenile Type
                    newSelectedTags[5] = "juvenile";
                    break;
                case 11: // Lithic Type
                    newSelectedTags[5] = "lithic";
                    break;
                case 12: // Altered Material Type
                    newSelectedTags[5] = "altered material";
                    break;
                case 13: // Free Crystal Type
                    newSelectedTags[5] = "free crystal";
                    break;
                default:
                    break;
            }
        }
        
        props.setTagList(updatedTagList);
        setSelectedTags(newSelectedTags);
        props.setSelectedTags(Object.values(newSelectedTags)); // Update parent component with selected tags
        props.setTags(updatedTags.filter(tag => !Object.values(newSelectedTags).includes(tag)));
    };

    // Expose handleSelectChange method to parent components via ref
    useImperativeHandle(ref, () => ({
        handleSelectChange: (tag, id) => {
            handleSelectChange(tag, id);
        }
    }));

    return (
        <TagsRender>
            {props.tagList.map(tag => (
                <div key={tag.id} style={{ marginLeft: '15px', marginTop: '15px' }}>
                    <Select
                        options={tag.options}
                        placeholder={tag.oriTag}
                        isDisabled={tag.disabled}
                        onChange={(selectedOption) => handleSelectChange(selectedOption, tag.id)}
                        value={tag.options.find(option => option.value === selectedTags[tag.id]) || null}
                        isClearable
                        style={{margin: 10, fontSize: '0.8rem'}}
                    />
                </div>
            ))}
        </TagsRender>
    );
});

export default Tags;
