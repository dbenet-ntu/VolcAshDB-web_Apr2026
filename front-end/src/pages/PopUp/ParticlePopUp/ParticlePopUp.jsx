import * as constants from '../../../Constants';
import { Container, Image, Grid, WarningMessage } from './ParticlePopUp.style';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useAddOpinion } from '../../../hooks/useAddOpinion';
import { useGetAnnotationDistribution } from '../../../hooks/useGetAnnotationDistribution'; // Hook to fetch opinion distribution data
import { useState, useEffect, useRef } from 'react';
import FormAnnotation from '../../Form/FormAnnotation';
import ParticleInformation from '../../ParticleInformation/ParticleInformation';

/**
 * ParticlePopUp: Component that renders detailed information about a particle 
 * and allows authenticated users to submit opinions based on certain attributes.
 * 
 * @param {object} props - The properties passed to the component.
 * @param {object} props.info - Information about the particle being displayed.
 * @param {function} props.refetchOpinions - Callback to refetch opinions after a new one is added.
 * @param {string} props.visibilityMode - Controls visibility of specific data in child components.
 * @returns {JSX.Element} - The rendered ParticlePopUp component.
 */
const ParticlePopUp = (props) => {
    // Define the proxy URL for image loading
    const proxy = constants.PROXY;
    const imgPath = "images/particles/" + props.info.imgURL;

    // State to manage user's opinion on particle attributes
    const [opinion, setOpinion] = useState({
        "altered material": 0,
        "lithic": 0,
        "juvenile": 0,
        "free crystal": 0
    });

    // States for individual particle attributes
    const [color, setColor] = useState("");
    const [luster, setLuster] = useState("");
    const [edge, setEdge] = useState("");
    const [shape, setShape] = useState("");
    const [crystallinity, setCrystallinity] = useState("");
    const [hydroAlterDegree, setHydroAlterDegree] = useState("");
    const [weatheringSign, setWeatheringSign] = useState(false);
    const [comments, setComments] = useState("");

    // State for error message
    const [errorMessage, setErrorMessage] = useState("");

    // Get the current user from context
    const { user } = useAuthContext();

    // Destructure functions and states from the useAddOpinion hook for handling form submission
    const { addOpinion, isLoading, success, message } = useAddOpinion();

    // Parse the user role from the JWT token
    const userRole = user ? JSON.parse(atob(user.token.split('.')[1])).role.toLowerCase() : null;

    // Destructure the getAnnotationDistribution function from the custom hook
    const { getAnnotationDistribution, result } = useGetAnnotationDistribution();

    // UseRef to persist the fetchOpinions function between renders
    const fetchOpinionsRef = useRef();

    // Define the fetchOpinions function for getting opinion distribution data
    fetchOpinionsRef.current = async () => {
        try {
            await getAnnotationDistribution(props.info._id);
        } catch (error) {
            console.error('Error fetching opinions:', error);
        }
    };

    // Effect to fetch opinion distribution data when the particle info or user role changes
    useEffect(() => {
        if (props.info && userRole === 'team member') {
            fetchOpinionsRef.current();
        }
    }, [props.info, userRole]);

    // Handle the submission of the opinion form
    const handleSubmit = async () => {
        // Ensure that the total confidence percentage equals 100%
        const totalConfidence = Object.values(opinion).reduce((acc, curr) => acc + parseFloat(curr || 0), 0);
        if (totalConfidence !== 100) {
            setErrorMessage("Total confidence percentage must equal 100%");
            return;
        }

        // Extract user ID and particle ID for form submission
        const userId = JSON.parse(atob(user.token.split('.')[1]))._id;
        const particleId = props.info._id;

        // Submit the opinion data using the addOpinion hook
        await addOpinion(
            userId,
            particleId,
            opinion,
            comments,
            color,
            luster,
            edge,
            shape,
            crystallinity,
            hydroAlterDegree,
            weatheringSign
        );

        // Refetch opinions after successful submission
        props.refetchOpinions();
    };

    // Effect to populate the form with existing opinion data if available
    useEffect(() => {
        const currentOpinion = props.result.opinions.find(opinion => opinion.particleId === props.info._id);
        if (currentOpinion) {
            setOpinion(currentOpinion.main_type || {
                "altered material": 0,
                "lithic": 0,
                "juvenile": 0,
                "free crystal": 0
            });
            setColor(currentOpinion.color || '');
            setLuster(currentOpinion.luster || '');
            setEdge(currentOpinion.edge || '');
            setShape(currentOpinion.shape || '');
            setCrystallinity(currentOpinion.crystallinity || '');
            setHydroAlterDegree(currentOpinion.hydro_alter_degree || '');
            setWeatheringSign(currentOpinion.weathering_sign || false);
            setComments(currentOpinion.comments || '');
        }
    }, [props.result, props.info]);

    // Handle changes in the opinion form fields
    const handleOpinionChange = (e) => {
        const { name, value } = e.target;
        setOpinion(prevOpinion => ({
            ...prevOpinion,
            [name]: parseInt(value) || 0
        }));
    };

    // Handlers for form input changes
    const handleColor = (e) => setColor(e.target.value);
    const handleLuster = (e) => setLuster(e.target.value);
    const handleEdge = (e) => setEdge(e.target.value);
    const handleShape = (e) => setShape(e.target.value);
    const handleCrystallinity = (e) => setCrystallinity(e.target.value);
    const handleHydroAlterDegree = (e) => setHydroAlterDegree(e.target.value);
    const handleWeatheringSign = (e) => setWeatheringSign(e.target.checked);
    const handleComments = (e) => setComments(e.target.value);

    return (
        <Container>
            {/* Lazy-loaded image of the particle */}
            <Image
                src={`${proxy}/${imgPath}`}
                threshold="500"
            />

            {/* Grid layout for particle information and annotation form */}
            <Grid>
                {/* Component to display particle information */}
                <ParticleInformation
                    info={props.info}
                    userRole={userRole}
                    result={result}
                    visibilityMode={props.visibilityMode}
                    size={260}
                    bgcolor={"white"}
                />

                {/* Render form for team members and annotators to submit opinions */}
                {['team member', 'annotator'].includes(userRole) && !props.result.error &&(
                    <FormAnnotation
                        opinion={opinion}
                        requiresDetailedAnnotation={props.info.requiresDetailedAnnotation}
                        color={color}
                        luster={luster}
                        edge={edge}
                        shape={shape}
                        crystallinity={crystallinity}
                        hydroAlterDegree={hydroAlterDegree}
                        weatheringSign={weatheringSign}
                        comments={comments}
                        handleOpinionChange={handleOpinionChange}
                        handleColor={handleColor}
                        handleLuster={handleLuster}
                        handleEdge={handleEdge}
                        handleShape={handleShape}
                        handleCrystallinity={handleCrystallinity}
                        handleHydroAlterDegree={handleHydroAlterDegree}
                        handleWeatheringSign={handleWeatheringSign}
                        handleComments={handleComments}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                        success={success}
                        message={message}
                        errorMessage={errorMessage}
                    />
                )}

                {['team member', 'annotator'].includes(userRole) && props.result.error &&(
                    <WarningMessage>{props.result.error}</WarningMessage>
                )}
            </Grid>
        </Container>
    );
};

export default ParticlePopUp;