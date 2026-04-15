import { Overlay } from './VolcanoeTimeLine.styles';
import TimeLine from './Timeline';

/**
 * VolcanoTimeLine: A component that wraps the TimeLine component with volcano-specific data.
 * 
 * @param {object} props - Properties passed to the component.
 * @param {function} props.onGetEruptions - Function to retrieve eruption data.
 * @param {function} props.onGetVolcano - Function to retrieve volcano data.
 * @param {function} props.onGetAfes - Function to retrieve AFE (Ash Forming Events) data.
 * @param {object} props.visibilityMode - Object controlling visibility settings.
 * @param {function} props.handleSearch - Function to handle search actions.
 * @param {array} props.selectedTags - Array of selected tags.
 * @param {object} props.tagsRef - Ref to tag selection component.
 * @returns {JSX.Element} - The rendered component.
 */
const VolcanoTimeLine = (props) => {
    // Destructure props for easier access
    const eruptions = props.onGetEruptions;
    const volcanoes = props.onGetVolcanoes;
    const samples = props.onGetSamples;
    const afes = props.onGetAfes;
    const volc = props.onGetVolcanoes[0].volcano_details.volc_name; // Get the name of the volcano from the first item

    // Determine the volcano number based on the volcano name
    let volc_num = 0;
    for (const volcano of volcanoes) {
        if (volcano.volcano_details.volc_name === volc) {
            volc_num = volcano.volcano_details.volc_num;
            break; // Exit loop once the volcano number is found
        }
    }

    // Prepare dummy data for AFEs based on volcano number
    let AfesDummyData = [];
    for (const afe of afes) {
        if (afe['volc_num'] === volc_num) {
            if (afe['afe_dateBP']) {
                AfesDummyData.push({ date: afe['afe_dateBP'], item: afe });
            } else if (afe['afe_date'] && !afe['afe_dateBP']) {
                // Format date if afe_dateBP is not available
                let s = afe['afe_date'].substr(0, 4) + '.' + afe['afe_date'].substr(5, 7);
                AfesDummyData.push({ date: parseFloat(s), item: afe });
            }
        }
    }
    // Prepare dummy data for samples based on volcano number
    let samplesDummyData = [];
    for (const sample of samples) {
        // Only process the sample if it corresponds to the volcano number
        if (sample['volc_num'] === volc_num) {
            let date;
            
            // If sample_date is available, use it
            if (sample['sample_date']) {
                date = parseFloat(sample['sample_date'].substr(0, 4) + '.' + sample['sample_date'].substr(5, 7));
            } else {
                // If sample_date is not available, fall back to AFE logic
                const matchingAfe = afes.find(afe => afe['afe_code'] === sample['afe_code']);
                if (matchingAfe) {
                    if (matchingAfe['afe_dateBP']) {
                        date = matchingAfe['afe_dateBP'];
                    } else if (matchingAfe['afe_date'] && !matchingAfe['afe_dateBP']) {
                        let s = matchingAfe['afe_date'].substr(0, 4) + '.' + matchingAfe['afe_date'].substr(5, 7);
                        date = parseFloat(s);
                    }
                }
            }

            // If date is found, add the sample to samplesDummyData
            if (date) {
                samplesDummyData.push({ date, item: sample });
            }
        }
    }

    return (
        <Overlay>  
            <TimeLine 
                visibilityMode={props.visibilityMode} // Pass visibility mode to TimeLine
                onPassVolcName={() => volc_num} // Provide volcano number to TimeLine
                onEruptions={() => eruptions} // Provide eruption data to TimeLine
                onSamples={() => samplesDummyData} // Provide AFE data to TimeLine
                onAfes={() => AfesDummyData} // Provide AFE data to TimeLine
                tagsRef={props.tagsRef} // Reference for tag selection
                handleSearch={props.handleSearch} // Function to handle search actions
                selectedTags={props.selectedTags} // Array of selected tags
            /> 
        </Overlay>
    );
};

export default VolcanoTimeLine;
