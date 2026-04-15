import { LoadingContainer, LoadingPoster, LoadingName, NameBox } from './loadingCard.style';


/**
 * LoadingCard: A component that displays a loading placeholder with a poster and name box.
 * Utilizes styles from `loadingStyle` to provide a skeleton loader.
 * 
 * @returns {JSX.Element} The LoadingCard component.
 */
function LoadingCard() {

    return (
        <LoadingContainer>
            {/* Placeholder for the poster image */}
            <LoadingPoster/>

            {/* Container for the name or title */}
            <NameBox>
                {/* Placeholder for the name text */}
                <LoadingName/>
            </NameBox>
        </LoadingContainer>
    );
}

export default LoadingCard;
