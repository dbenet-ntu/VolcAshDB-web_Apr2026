import { InformationPopUpRender, Image } from './InformationPopUp.style';
import table1 from '../../../assets/images/table1.png';
import table2 from '../../../assets/images/table2.png';

/**
 * InformationPopUp Component:
 * Displays a pop-up containing images of tables.
 * 
 * @returns {JSX.Element} The rendered component displaying the two images.
 */
const InformationPopUp = () => {

    return (
        <InformationPopUpRender>
            {/* Lazy load the first image (table1.png) with a threshold of 500px for loading */}
            <Image
                src={table1}
                threshold="500"
            />

            {/* Lazy load the second image (table2.png) with a threshold of 500px for loading */}
            <Image
                src={table2}
                threshold="500"
            />
        </InformationPopUpRender>
    );
};

export default InformationPopUp;
