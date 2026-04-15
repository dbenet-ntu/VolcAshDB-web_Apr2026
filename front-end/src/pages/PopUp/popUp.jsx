import { Container, SubContainer } from './popUp.style';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';

/**
 * PopUp: A reusable modal component that renders its children inside a popup overlay.
 * The modal can be closed using the close button, which triggers the `onClose` function passed via props.
 * 
 * @param {object} props - The properties object.
 * @param {ReactNode} props.children - The content to be displayed inside the modal.
 * @param {function} props.onClose - A function to be called when the close button is clicked.
 * @returns {JSX.Element} - The rendered PopUp component.
 */
const PopUp = ({ children, onClose }) => {

    return (
        // The overlay that dims the background and centers the modal
        <Container>
            {/* The modal itself which contains the children content and close button */}
            <SubContainer>
                <IconButton aria-label="clearicon" onClick={() => onClose()}><ClearIcon/></IconButton>
                {children}
            </SubContainer>
        </Container>
    );
};

export default PopUp;