import React, {useState} from "react";
import LoadingCard from '../LoadingCard/loadingCard';
import VolcanoCard from '../VolcanoCard/volcanoCard';
import VolcanoTimeLine from '../../VolcanoDetailPage/VolcanoeTimeLine';
import { Title, LoadingContainer, Separator, NoResults, SuggestLink, LoadingRender, InformationRender, SearchComponentRender, SeparatorSearchBar, ResultContainer, LoadMoreButton, LoadMoreParticles, ResultVolcano, VolcanoTimeLineRender, WorldMapRender } from './Results.styles';
import WorldMap from "../../HomePage/WorldMap"

/**
 * Results: Component to display search results for volcanoes and particles.
 * 
 * @param {object} props - Component props.
 * @returns {JSX.Element} The rendered component.
 */
const Results = ({
    isLoading,
    searchData,
    filterSubmit,
    visibilityMode,
    handleDoubleClick,
    tagsRef,
    selectedTags,
    handleSubmit,
    searchTerm,
    result,
    eruptions,
    samples,
    afes,
    volcanoes,
    particles,
    particlesExamples,
    suggest,
    searchSubmit,
    suggestSearch,
    setSearchTerm,
    setSearchSubmit,
    setFilterSubmit,
    getSearchResult
}) => {
    // Move useState to the main component
    const [page, setPage] = useState(1);
    const particlesPerPage = 50;

    /**
     * Renders the loading state with placeholder cards.
     * @returns {JSX.Element} Loading state component.
     */
    const renderLoading = () => (
        <div>
            <Title>VOLCANO</Title>
            <LoadingRender align='center'>
                Please note that the images may take one minute to load.
            </LoadingRender>
            <LoadingContainer>
                <LoadingCard />
            </LoadingContainer>

            <Separator/>

            <Title>PARTICLE</Title>
            {renderInformation()}
            <LoadingContainer>
                {Array.from({ length: 5 }, (_, index) => (
                    <LoadingCard key={index + 1} />
                ))}
            </LoadingContainer>
        </div>
    );

    /**
     * Renders the number of search results found.
     * @param {Array} particles - Array of particle results.
     * @returns {JSX.Element} Component displaying the number of results.
     */
    const renderResultsFound = (particles) => (
        <NoResults>
            {particles.length} search results for "{filterSubmit}":
        </NoResults>
    );

    /**
     * Renders a message when no results are found.
     * @returns {JSX.Element} Component displaying a no results message.
     */
    const renderNoResults = () => (
        <NoResults>
            Sorry! There is no result for "{filterSubmit}" in our database.
        </NoResults>
    );

    /**
     * Renders a suggestion for alternative search terms.
     * @returns {JSX.Element} Component displaying a suggestion for search.
     */
    const renderSuggestSearch = () => (
        <NoResults>
            Sorry! There is no result for "{searchSubmit}" in our database.
            <br />
            Did you mean{' '}
            <SuggestLink
                onClick={() => {
                    getSearchResult(suggestSearch.toLowerCase(), selectedTags);
                    setSearchTerm(suggestSearch);
                    setSearchSubmit(suggestSearch);
                    setFilterSubmit(
                        suggestSearch && selectedTags.length !== 0
                        ? suggestSearch + ', ' + selectedTags.join(',')
                        : suggestSearch + selectedTags.join(',')
                    );
                }}
            >
                {suggestSearch}
            </SuggestLink>
            ?
        </NoResults>
    );

    /**
     * Renders the search result message based on available data.
     * @returns {JSX.Element} Component displaying search results or messages.
     */
    function renderSearch(searchData, suggest) {
        if(searchData.particles && searchData.particles.length !== 0) {
            return renderResultsFound(searchData.particles);
        } else if(searchData.volcanoes && searchData.volcanoes.length !== 0) {
            return renderResultsFound(searchData.volcanoes);
        } else if (suggest) {
            return renderSuggestSearch();
        } else {
            return renderNoResults();
        }
    }

    /**
     * Renders the search result message based on available data.
     * @returns {JSX.Element} Component displaying search results or messages.
     */
    const renderSearchComponent = () => (
        <SearchComponentRender>{renderSearch(searchData, suggest)}</SearchComponentRender>
    );

    /**
     * Renders the information section with instructions.
     * @returns {JSX.Element} Component displaying instructions.
     */
    const renderInformation = () => (
        <div>
            <InformationRender align='center'>Double-click on the particle images for more information!</InformationRender>
            <SeparatorSearchBar/>
        </div>
    );

    /**
     * Checks if a volcano has opinions on all its particles.
     * @param {object} volcano - The volcano object to check.
     * @returns {boolean} True if all particles have opinions, otherwise false.
     */
    const checkVolcanoHasAllParticlesOpinion = (volcano) => {
        let check = false;

        if (result.success && particles.length > 0) {
            const particles_volc = particles.filter(p => p.volc_num === volcano.volc_num);
            if (particles_volc.length > 0) {
                check = particles_volc.every(p => result.opinions.some(o => o.particleId === p._id));
            }
        }
    
        return check;
    };

    /**
     * Renders the list of volcanoes.
     * @param {Array} volcanoes - Array of volcano data.
     * @param {boolean} isHomePage - Flag indicating if the component is on the home page.
     * @returns {JSX.Element} Component displaying volcano cards.
     */
    const renderVolcanoes = (volcanoes, isHomePage) => (
        <div>
            <ResultVolcano>
                <div>
                    <Title>VOLCANO</Title>
                    <ResultContainer>
                        {volcanoes.map((ele, index) => (
                            <VolcanoCard
                                key={index}
                                visibilityMode={visibilityMode}
                                onDoubleClick={() => handleDoubleClick(ele)}
                                tagsRef={tagsRef}
                                selectedTags={selectedTags}
                                handleSearch={() => handleSubmit(searchTerm)}
                                info={ele.volcano_details}
                                imgURL={"images/volcanoes/" + ele.volcano_details.imgURL}
                                type="volcanoes"
                                opinionResult={result}
                                hasAllParticlesOpinion={checkVolcanoHasAllParticlesOpinion(ele.volcano_details)}
                            />
                        ))}
                    </ResultContainer>
                </div>
                {!isHomePage && searchData.volcanoes.length === 1 && (
                    <VolcanoTimeLineRender>
                        <VolcanoTimeLine 
                            visibilityMode={visibilityMode} 
                            onGetEruptions={eruptions} 
                            onGetSamples={samples}
                            onGetAfes={afes} 
                            onGetVolcanoes={volcanoes} 
                            tagsRef={tagsRef} 
                            handleSearch={() => handleSubmit(searchTerm)} 
                            selectedTags={selectedTags}
                        />
                    </VolcanoTimeLineRender>
                )}
            </ResultVolcano>
            <Separator/>
        </div>
    );

    /**
     * Renders the list of particles with pagination.
     * @param {Array} particles - Array of particle data.
     * @returns {JSX.Element} Component displaying particle cards with pagination.
     */
    const renderParticles = (particles) => {

        // Calculate the particles to display based on the current page
        const displayedParticles = particles.slice(0, page * particlesPerPage);

        // Function to load the next page of particles
        const loadMoreParticles = () => {
            setPage(page + 1);
        };

        return (
            <div>
                <Title>PARTICLE</Title>
                {renderInformation()}
                <ResultContainer>
                    {displayedParticles.map((ele, index) => (
                        <VolcanoCard
                            key={index}
                            visibilityMode={visibilityMode}
                            onDoubleClick={() => handleDoubleClick(ele)}
                            info={ele}
                            imgURL={"images/particles/" + ele.imgURL}
                            type="particles"
                            opinionResult={result}
                        />
                    ))}
                </ResultContainer>
                <LoadMoreButton>
                    {/* Show the 'Load More' button if there are more particles to display */}
                    {displayedParticles.length < particles.length && (
                        <LoadMoreParticles
                            variant='contained' 
                            onClick={() => loadMoreParticles()}
                        >
                            Load More
                        </LoadMoreParticles>
                    )}
                </LoadMoreButton>
            </div>
        );
    };


    /**
     * Renders the results based on available volcanoes and particles data.
     * @returns {JSX.Element} Component displaying the results.
     */
    const renderResults = () => {
        const volcanoes = searchData.volcanoes;
        const particles = searchData.particles;

        return (
            <div>
                {volcanoes && volcanoes.length > 0 ? renderVolcanoes(volcanoes, false) : null}
                {volcanoes.length === 1 ?
                    <div>
                        <WorldMapRender>
                            <WorldMap 
                                volcanoes={volcanoes} 
                                samples={samples.filter(sample => sample.volc_num === volcanoes[0].volcano_details.volc_num)}
                                latitude={volcanoes[0].volcano_details.volc_slat}
                                longitude={volcanoes[0].volcano_details.volc_slon}
                                zoom={8}
                            />
                        </WorldMapRender>
                        <Separator/>
                    </div>
                    : null
                }
                
                {particles && particles.length > 0 ? renderParticles(particles) : null}
            </div>
        );
    };

    return (
        <ResultContainer>
            {
                isLoading ? (
                    <div>
                        {renderLoading()}
                    </div>
                ) : filterSubmit.length !== 0 ? (
                    <div>
                        {renderSearchComponent()}
                        {renderResults()}
                    </div>
                ) : (
                    <div>
                        {renderVolcanoes(volcanoes, true)}
                        {renderParticles(particlesExamples)}
                    </div>
                )
            }
        </ResultContainer>
    );
};

export default Results;
