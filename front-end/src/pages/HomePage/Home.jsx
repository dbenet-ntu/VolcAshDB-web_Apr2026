import { useNavigate } from 'react-router'
import { BodyContainer, BodyContent, TitleWithBadges, IPGPLogo, EOSLogo, MainHeading, InfoIconStyle, ArchitectureIconStyle, PieChartIconStyle, MenuBookIconStyle, GoalText, LinkOptions, LinkContainer, ButtonRender, DescriptionText, PublicationsContainer, LatestPublications } from './Home.styles'
import IPGP_logo from '../../assets/images/IPGP_logo.png'
import EOS_logo from '../../assets/images/EOS_logo.png'
import WorldMap from './WorldMap'
import useFetchTotalParticles from '../../hooks/useFetchTotalParticles';

/**
 * Home: The main landing page component for the VolcAshDB platform.
 * 
 * Displays an introduction to the VolcAshDB platform, including high-level information about its purpose, goals, and features.
 * The component also provides navigation buttons to various parts of the application and displays citations and recent publications.
 * 
 * @param {object} props - The properties passed to the component.
 * 
 * @returns {JSX.Element} - The rendered Home page component.
 */
function Home() {

    const navigate = useNavigate(); // Hook to programmatically navigate
    const { totalParticles } = useFetchTotalParticles(); // Custom hook to fetch the total number of particles
    const formattedParticles = totalParticles.toLocaleString();

    return (
        <BodyContainer>
            <BodyContent>
                
                {/* Header section with logos and main heading */}
                <TitleWithBadges>
                    <IPGPLogo src={IPGP_logo} alt="Institution Badge Left"/>
                    <EOSLogo src={EOS_logo} alt="Institution Badge Right"/>
                    <MainHeading>The web-based platform Volcanic Ash DataBase (VolcAshDB)</MainHeading>
                </TitleWithBadges>

                {/* Introduction and description of VolcAshDB */}
                <GoalText>
                    VolcAshDB is a database of optical microscope images and physical characteristics (shape, texture and color) of volcanic ash particles. VolcAshDB's goal is to help establish a standardized methodology for volcanic ash particle classification. Hosting over {formattedParticles} high-resolution images from various magma compositions and eruptive styles, VolcAshDB enables comparative studies and aids in the creation of Machine Learning models for automated classification.
                    <br />
                    <br />
                    <span style={{ fontSize: '12px' }}>
                        Version 0.1 of Dataset published 2024 in Centre de données de l'Institut de Physique du Globe de Paris
                        <a style={{ paddingLeft: '5px' }} href="https://doi.org/10.18715/ipgp.2024.lx32oxw9" target="_blank" rel="noopener noreferrer">
                            https://doi.org/10.18715/ipgp.2024.lx32oxw9
                        </a>
                    </span>
                </GoalText>

                {/* Options section with icons and navigation buttons */}
                <LinkOptions>
                    <LinkContainer>
                        <ButtonRender variant="contained" onClick={() => navigate("/about")}> <InfoIconStyle/> VolcAshDB</ButtonRender>
                        <DescriptionText>About Section</DescriptionText>
                    </LinkContainer>
                    <LinkContainer>
                        <ButtonRender variant="contained" onClick={() => navigate("/catalogue")}> <MenuBookIconStyle/> Catalogue</ButtonRender>
                        <DescriptionText>Image browser</DescriptionText>
                    </LinkContainer>
                    <LinkContainer>
                        <ButtonRender variant="contained" onClick={() => navigate("/analytic")}> <PieChartIconStyle/>Plots</ButtonRender>
                        <DescriptionText>Data visualization</DescriptionText>
                    </LinkContainer>

                    <LinkContainer>
                        <ButtonRender variant="contained" onClick={() => navigate("/about")}><ArchitectureIconStyle/>Support</ButtonRender>
                        <DescriptionText>Database design and <br></br>glossary of terms</DescriptionText>
                    </LinkContainer>
                </LinkOptions>

                <WorldMap/>

                {/* Publications section with citation and recent publications */}
                <PublicationsContainer>
                    <LatestPublications>
                    <strong>To use our contents </strong> please cite: Benet, D., Costa, F., Migadel, K. Lee, D., D'Oriano, C., Pompilio, M., Nurfiani, D., Rifai, H., 2025. A repository-hosted dataset of volcanic ash particle images and features. Scientific Data, 12, 681.
                        <br />
                        <a href="https://doi.org/10.1038/s41597-025-04942-9" target="_blank" rel="noopener noreferrer">
                            https://doi.org/10.1038/s41597-025-04942-9
                        </a>
                        <h2>Latest Publications</h2>
                        <ul>
                            <li>
                                <strong>2025</strong> Benet, D., Costa, F., Migadel, K. Lee, D., D'Oriano, C., Pompilio, M., Nurfiani, D., Rifai, H., 2025. A repository-hosted dataset of volcanic ash particle images and features. <em>Scientific Data, 12, 681.</em>
                                <br />
                                <a href="https://doi.org/10.1038/s41597-025-04942-9" target="_blank" rel="noopener noreferrer">
                                    https://doi.org/10.1038/s41597-025-04942-9
                                </a>
                            </li>
                            <li>
                                <strong>2024</strong> Benet, D., Costa, F., Widiwijayanti, C. Volcanic ash classification through Machine Learning. <em>Geochemistry, Geophysics, Geosystems</em>.
                                <br />
                                <a href="https://doi.org/10.1029/2023GC011224" target="_blank" rel="noopener noreferrer">
                                    https://doi.org/10.1029/2023GC011224
                                </a>
                            </li>
                            <li>
                                <strong>2024</strong> Benet, D., Costa, F., Widiwijayanti, C., Pallister, J., Pedreros, G., Allard, P., Humaida, H., Aoki, Y., and Maeno, F. VolcAshDB: a Volcanic Ash DataBase of classified particle images and features. <em>Bulletin of Volcanology</em>, 86(1), pp.1-30.
                                <br />
                                <a href="https://doi.org/10.1007/s00445-023-01695-4" target="_blank" rel="noopener noreferrer">
                                    https://doi.org/10.1007/s00445-023-01695-4
                                </a>
                            </li>
                        </ul>
                    </LatestPublications>
                </PublicationsContainer>
            </BodyContent>
        </BodyContainer>
    );
}

export default Home;
