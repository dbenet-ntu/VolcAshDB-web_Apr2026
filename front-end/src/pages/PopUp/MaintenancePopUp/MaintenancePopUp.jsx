import { Message, IconStyle } from './MaintenancePopUp.style';
import PopUp from '../popUp';
import maintenance_icon from '../../../assets/images/maintenance_icon.png'
 
/**
 * MaintenancePopUp Component:
 * Displays a pop-up containing a maintenance message.
 * 
 * @param {function} onClose - A function to close the pop-up.
 * @returns {JSX.Element} The rendered component displaying the two images.
 */
const MaintenancePopUp = ({onClose}) => {

    return (
        <PopUp onClose={onClose}>
            {/* Apply custom style from maintenancePopUpStyle */}
            <Message>
                <IconStyle src={maintenance_icon} alt="Maintenance Icon"/>
                <h1>Maintenance Incoming!</h1>
                <p>The webpage will be under maintenance from <strong>20/01/2025 10:00:00 (CET)</strong> to <strong>23/01/25 17:00:00 (CET)</strong>. Thank you for your understanding.</p>
            </Message>
        </PopUp>
    );
};

export default MaintenancePopUp;
