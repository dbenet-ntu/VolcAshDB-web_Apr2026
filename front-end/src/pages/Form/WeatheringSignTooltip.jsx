import { Tooltip } from '@mui/material';

/**
 * WeatheringSignTooltip: A tooltip component that provides additional information about weathering signs.
 * 
 * Utilizes Material-UI's `Tooltip` component to display a description when the user hovers over the wrapped element.
 * 
 * @param {object} props - The properties passed to the component.
 * @param {ReactNode} props.children - The child element(s) to which the tooltip will be attached.
 * 
 * @returns {JSX.Element} - The `Tooltip` component wrapping the provided children.
 */
const WeatheringSignTooltip = ({ children }) => (
    <Tooltip 
      title="Weathering signs refer to the presence of coatings of white minerals, dissolution textures, and evidence of recrystallization/devitrification." 
      arrow
    >
      	{children}
    </Tooltip>
);

export default WeatheringSignTooltip;
