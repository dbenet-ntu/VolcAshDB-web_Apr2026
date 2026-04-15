import Tags from '../Tags/Tags'
import { Container } from './TagSelector.styles'

/**
 * TagSelector Component: Renders a tag selection interface.
 * 
 * @param {Array<string>} selectedTags - The currently selected tags.
 * @param {function} setSelectedTags - Function to update the selected tags.
 * @param {object} tagsRef - Ref object for accessing the Tags component.
 * @param {Array<object>} volcanoes - Array of volcano data objects.
 * @param {Array<object>} values_tags - Array of value-tag mappings.
 * 
 * @returns {JSX.Element} The rendered TagSelector component.
 */
const TagSelector = ({ selectedTags, setSelectedTags, tagsRef, volcanoes, particles, tagList, setTagList, values_tags, displayNaturalData }) => {
    // Use the custom styles for the TagSelector component

    // Array of predefined tags for selection
    const originalTags = [
        "Tectonic Setting",
        "Volcano Name",
        "Ash Forming Events",
        "Eruptive Style",
        "Grain Size",
        "Main Type",
        "Shape",
        "Crystallinity",
        "Color",
        "Hydrothermal Alteration Degree",
        "Juvenile Type",
        "Lithic Type",
        "Altered Material Type",
        "Free Crystal Type"
    ];

    return (
        <Container>
            {/* Render the Tags component with the necessary props */}
            <Tags 
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                tags={originalTags}
                setTags={() => {}}
                ref={tagsRef}
                volcanoes={volcanoes}
                particles={particles}
                displayNaturalData={displayNaturalData}
                tagList={tagList}
                setTagList={setTagList}
                values_tags={values_tags}
            />
        </Container>
    )
}

export default TagSelector
