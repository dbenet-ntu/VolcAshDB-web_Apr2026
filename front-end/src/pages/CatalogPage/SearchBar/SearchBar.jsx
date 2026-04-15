import { useState, useEffect } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { SearchBoxContainer } from './SearchBar.styles'; // Assuming you have Tabs styles
import { Switch } from '@mui/material';  // Import the Switch component from react-switch
import dataTemplate from "../Tags/Tags.json" // Import data template


const animatedComponents = makeAnimated();

const customStyles = {
    container: (provided) => ({
        ...provided,
        width: '80%', // Set the desired width of the container
    }),
    menu: (provided) => ({
        ...provided,
        width: '80%', // Ensure the menu width matches the container width
    })
};

/**
 * SearchBar: Component for selecting tags and toggling data types.
 * 
 * @param {string} searchTerm - Current search term.
 * @param {function} setSearchTerm - Function to update the search term.
 * @param {function} handleSubmit - Function to handle form submission.
 * @param {array} volcanoes - Array of volcano objects for search options.
 * @param {boolean} displayNaturalData - Toggle state for natural data.
 * @param {function} setDisplayNaturalData - Function to update natural data toggle state.
 * @param {array} selectedTags - Array of selected tags.
 * @param {function} setSelectedTags - Function to update selected tags.
 * @param {object} tagsRef - Reference to tag selector component.
 */
const SearchBar = ({ 
    searchTerm, 
    setSearchTerm, 
    handleSubmit, 
    volcanoes, 
    displayNaturalData, 
    setDisplayNaturalData, 
    selectedTags, 
    setSelectedTags, 
    tagsRef 
}) => {    
    
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    // Toggle between experimental and natural data
    const handleDataTypeToggleChange = (event) => {
        setDisplayNaturalData(event.target.checked);
        const updatedTags = selectedTags.filter(tag => tag !== "Volcano Name");
        setSelectedTags(updatedTags);
        if (tagsRef.current) {
            tagsRef.current.handleSelectChange(null, 1);  // Clear "Volcano Name" in the TagSelector
        }
    };
    
    useEffect(() => {
        // Extract volcano names from the volcanoes array
        const volcanoNames = volcanoes.map(volcano => volcano.volcano_details.volc_name);
        dataTemplate["volcanoName"].choices = volcanoNames;
    
        // Map dataTemplate to options for the Select component
        const initialOptions = Object.values(dataTemplate).map(tag => ({
            oriTag: tag.oriTag,
            options: tag.choices.map(choice => ({ 
                label: choice, 
                value: tag.oriTag === 'Grain Size' && choice.includes('-') 
                ? choice.replace('-', '') 
                : choice            
            })),
            id: tag.id,
            disabled: tag.id === 2,
        }));
    
        setOptions(initialOptions.flatMap(tag => tag.options)); // Flatten and set options
    }, [volcanoes, dataTemplate]);
    
    // Handle selection changes in the Select component
    const handleChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
        setSearchTerm(selectedOptions.map(option => option.value)); // Update search term based on selected options
    };
    
    // Handle Enter key press to submit search
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit(searchTerm);
        }
    };
    
    return (
        <SearchBoxContainer>
            <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                value={selectedOptions}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                options={options}
                placeholder="Search by Volcano Name, Particle Type, etc."
                styles={customStyles}
            />
            <div style={{ textAlign: 'center' }}>
                <Switch
                    onChange={handleDataTypeToggleChange}
                    checked={displayNaturalData}
                    color="secondary"
                    inputProps={{ 'aria-label': 'Natural/Experimental Data Toggle' }}
                    sx={{
                        '& .MuiSwitch-thumb': {
                            color: displayNaturalData ? '#006837' : '#ff9900',  // Customize thumb color
                        },
                        '& .MuiSwitch-track': {
                            backgroundColor: displayNaturalData ? '#006837' : '#ff9900',  // Customize track color
                        },
                        '& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track': {
                            backgroundColor: displayNaturalData ? '#006837' : '#ff9900',  // Customize track color
                        }
                    }}
                />
                <label>{displayNaturalData ? "Natural Data" : "Experimental Data"}</label>
            </div>
        </SearchBoxContainer>
    );
};

export default SearchBar;
