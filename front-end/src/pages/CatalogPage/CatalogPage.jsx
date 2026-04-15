import { useState, useRef } from 'react'
import { LinearProgress, Typography } from '@mui/material';

import PopUp from '../PopUp/popUp'
import ParticlePopUp from '../PopUp/ParticlePopUp/ParticlePopUp'
import SearchBar from './SearchBar/SearchBar'
import TagSelector from './TagSelector/TagSelector'
import FilterAndDownloadButtons from './FilterAndDownloadButtons/FilterAndDownloadButtons'
import Results from './Results/Results'

import useSearch from '../../hooks/useSearch'
import useFetchData from '../../hooks/useFetchData'
import useFetchOpinions from '../../hooks/useFetchOpinions'

import { SearchContainer, SearchTitle, ProgressBar } from './CatalogPage.styles';

/**
 * CatalogPage: Main component for displaying and managing the catalog of particles and volcanoes.
 * 
 * @param {object} props - The component props.
 * @param {string} props.visibilityMode - Mode to control visibility of certain elements.
 * 
 * @returns {JSX.Element} - The rendered CatalogPage component.
 */
function CatalogPage({ visibilityMode }) {
    const tagsRef = useRef(null); // Ref to access the TagSelector component
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility
    const [particlePopUpInfo, setParticlePopUpInfo] = useState(null); // State to store particle info for the popup
    const [displayNaturalData, setDisplayNaturalData] = useState(true); // State to toggle experimental data display
    const [tagList, setTagList] = useState([]); // State for holding tags and their options
    const [progress, setProgress] = useState(0);  // State for progress bar

    // Custom hooks for fetching data and handling search
    const {
        particles,
        particlesExamples,
        volcanoes,
        eruptions,
        samples,
        afes,
        tags,
        isLoading: dataLoading
    } = useFetchData(displayNaturalData, setProgress);

    const {
        searchTerm,
        setSearchTerm,
        searchSubmit,
        setSearchSubmit,
        filterSubmit,
        setFilterSubmit,
        searchData,
        suggestSearch,
        suggest,
        selectedTags,
        setSelectedTags,
        isLoading,
        handleSubmit,
        getSearchResult
    } = useSearch(particles, volcanoes);

    const { fetchOpinions, result } = useFetchOpinions(displayNaturalData);

    /**
     * Handle double-click on a result item to open the particle popup.
     * 
     * @param {object} info - The information of the particle to be displayed in the popup.
     */
    const handleDoubleClick = (info) => {
        setParticlePopUpInfo(info);
        setIsPopupOpen(true);
    }

    return (
        <SearchContainer>
            {/* Title of the search section */}
            <SearchTitle>Explore the Database</SearchTitle>

            {/* Search bar component */}
            <SearchBar 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                volcanoes={volcanoes}
                handleSubmit={handleSubmit} 
                displayNaturalData={displayNaturalData}
                setDisplayNaturalData={setDisplayNaturalData} 
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                particles={particles}
                tagsRef={tagsRef}
            />

            {/* Tag selector component */}
            <TagSelector 
                selectedTags={selectedTags} 
                setSelectedTags={setSelectedTags} 
                tagsRef={tagsRef} 
                volcanoes={volcanoes}
                particles={particles}
                tagList={tagList}
                setTagList={setTagList}
                values_tags={tags}
                displayNaturalData={displayNaturalData}
            />

            {/* Filter and download buttons */}
            <FilterAndDownloadButtons
                filterSubmit={filterSubmit}
                searchTerm={searchTerm} 
                handleSubmit={handleSubmit} 
                searchData={searchData}
                isLoading={isLoading || dataLoading}
            />

            {dataLoading &&
                <ProgressBar>
                    <Typography variant="h6">Loading data...</Typography>
                    <LinearProgress variant="determinate" value={progress} />
                </ProgressBar>
            }

            {/* Results component showing the search results */}
            <Results
                isLoading={isLoading || dataLoading}
                searchData={searchData}
                filterSubmit={filterSubmit}
                visibilityMode={visibilityMode}
                handleDoubleClick={handleDoubleClick}
                tagsRef={tagsRef}
                selectedTags={selectedTags}
                handleSubmit={handleSubmit}
                searchTerm={searchTerm}
                result={result}
                eruptions={eruptions}
                samples={samples}
                afes={afes}
                volcanoes={volcanoes}
                particles={particles}
                particlesExamples={particlesExamples}
                suggest={suggest}
                searchSubmit={searchSubmit}
                suggestSearch={suggestSearch}
                setSearchTerm={setSearchTerm}
                setSearchSubmit={setSearchSubmit}
                setFilterSubmit={setFilterSubmit}
                getSearchResult={getSearchResult}
            />

            {/* Conditional rendering of the popup component */}
            {isPopupOpen &&
                <PopUp onClose={() => setIsPopupOpen(false)}>
                    <ParticlePopUp 
                        result={result} 
                        visibilityMode={visibilityMode} 
                        info={particlePopUpInfo} 
                        refetchOpinions={fetchOpinions} 
                        onClose={() => setIsPopupOpen(false)}
                    />
                </PopUp>
            }
        </SearchContainer>
    )
}

export default CatalogPage
