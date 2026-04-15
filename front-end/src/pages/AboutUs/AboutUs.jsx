import { useState } from 'react';

import { Link as RouterLink } from 'react-router';

import * as constants from '../../Constants';

import { AboutUsContainer, Footer, CustomLinkLegalInformation, CustomImage, TableContainer, TableStyle, ThStyle, TdStyle, CodeBlock } from './AboutUs.styles';

import database_structure from '../../assets/images/database_structure.png'

import useFetchTotalParticles from '../../hooks/useFetchTotalParticles';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
	Box,
	Typography,
	Card,
	CardContent,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	List,
	ListItem,
	ListItemText,
	IconButton
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css'; // Import the CSS for styling


/**
 * Helper function to generate a valid HTML id for sub-items (no spaces, etc.).
 */
function makeSubId(catKey, choiceName) {
  	return `${catKey}-${choiceName.replace(/[^\w-]+/g, '-')}`;
}

const glossaryData = {
	eruptiveActivityType: {
		label: 'Eruptive Activity Type',
		choices: [
			{
				name: 'Phreatic',
				definition: (
					<span>
						Phreatic eruptions are steam-driven, often caused by heating of groundwater{' '}
						(<a
							href="https://en.wikipedia.org/wiki/Phreatic_eruption"
							target="_blank"
							rel="noopener noreferrer"
						>ref</a>).
					</span>
				),
			},
			{
				name: 'Dome explosion',
				definition: (
					<span>
						Dome explosions are usually triggered by gravitational instabilities or gas
						pressurization{' '}
						(<a
							href="https://en.wikipedia.org/wiki/Lava_dome#Dome_dynamics"
							target="_blank"
							rel="noopener noreferrer"
						>ref</a>).
					</span>
				),
			},
			{
				name: 'Lava fountaining',
				definition: (
					<span>
						Lava fountaining is the ejection of molten lava in a jet-like spray{' '}
						(<a
							href="https://volcanoes.usgs.gov/vsc/glossary/lava_fountain.html"
							target="_blank"
							rel="noopener noreferrer"
						>ref</a>).
					</span>
				),
			},
			{
				name: 'Subplinian',
				definition: (
					<span>
						Subplinian eruptions are explosive, sustained, and with relatively high columns but
						less (&lt; 20 km) than Plinian eruptions{' '}
						(<a
							href="https://www.nps.gov/articles/000/sub-plinian-eruptions.htm#:~:text=Sub%2DPlinian%20eruptions%20produce%20higher,and%20are%20unsteady%20but%20sustained."
							target="_blank"
							rel="noopener noreferrer"
						>ref</a>).
					</span>
				),
			},
			{
				name: 'Plinian',
				definition: (
					<span>
						Plinian eruptions are extremely explosive, more intense than Subplinian and have very
						high eruption columns, often over 20 km{' '}
						(<a
							href="https://www.nps.gov/articles/000/plinian-eruptions.htm?utm_source=article&utm_medium=website&utm_campaign=experience_more&utm_content=large"
							target="_blank"
							rel="noopener noreferrer"
						>ref</a>).
					</span>
				),
			}
		],
	},
	grainSize: {
		label: 'Grain Size',
		choices: [
			{
				name: 'Phi scale',
				definition: (
					<div style={{"paddingLeft": "10px"}}>
						<span>
							The Krumbein phi scale defines grain-size fractions as a logarithmic scale{' '}
							(<a
								href="https://en.wikipedia.org/wiki/Grain_size#Krumbein_phi_scale"
								target="_blank"
								rel="noopener noreferrer"
							>ref</a>).
						</span>
						<span>
							The formula is given by:
							<Latex>{`$\\space \\varphi = -\\log_2{\\left(\\frac{D}{D_0}\\right)}$`}</Latex>
							{/* <InlineMath math="\space \varphi = -\log_2{\left(\frac{D}{D_0}\right)}"/> */}

						</span>
						<span>
							Where:
							<ul>
								<li>
								<Latex>{`$\\varphi$`}</Latex> is the Krumbein phi scale.
								</li>
								<li>
								<Latex>{`$D$`}</Latex> is the diameter of the particle or grain in millimeters.
								</li>
								<li>
								<Latex>{`$D_0$`}</Latex> is a reference diameter, equal to 1 mm.
								</li>
							</ul>
						</span>
					</div>
				)
			},
			{
				name: 'Mesh scale',
				definition: (
					<div style={{"paddingLeft": "10px"}}>
						<span>
							The Mesh scale is a classification system used to describe particle size based on the number of
							openings per linear inch in a sieve. It is commonly used in sedimentology and
							material sciences {''}            
							(<a
								href="https://en.wikipedia.org/wiki/Mesh_(scale)"
								target="_blank"
								rel="noopener noreferrer"
							>ref</a>).
						</span>
						<span>
							The mesh number (n) corresponds to the number of openings per inch in the sieve:
							<Latex>{`$\\space D = \\frac{25.4}{n}$`}</Latex>
						</span>
						<span>
							Where:
							<ul>
								<li>
								<Latex>{`$D$`}</Latex> is the particle diameter in millimeters.
								</li>
								<li>
								<Latex>{`$n$`}</Latex> is the mesh size (openings per inch).
								</li>
								<li>25.4 is the conversion factor from inches to millimeters.</li>
							</ul>
						</span>
						<span>
							For example, a mesh size of 60 corresponds to 0.25 mm,
							while mesh 200 corresponds to 0.074 mm.
						</span>
						<hr/>
						<h3>Equivalences of our grain-size fractions</h3>
						<p>
							VolcAshDB uses specific tags to filter the particles into grain-size fractions as follows:
						</p>
						<table border="1" style={{borderCollapse: 'collapse', margin: 'auto'}}>
							<thead>
								<tr>
									<ThStyle style={{padding: '5px'}}>Fraction Tag</ThStyle>
									<ThStyle style={{padding: '5px'}}>Meaning</ThStyle>
									<ThStyle style={{padding: '5px'}}>Size in microns (µm)</ThStyle>
								</tr>
							</thead>
							<tbody>
								<tr>
									<TdStyle style={{padding: '5px'}}>morephi0</TdStyle>
									<TdStyle style={{padding: '5px'}}>Particles &gt; 0 phi</TdStyle>
									<TdStyle style={{padding: '5px'}}> &gt; 1000 µm</TdStyle>
								</tr>
								<tr>
									<TdStyle style={{padding: '5px'}}>phi0phi1</TdStyle>
									<TdStyle style={{padding: '5px'}}>Particles between 0–1 phi</TdStyle>
									<TdStyle style={{padding: '5px'}}>1000 – 500 µm</TdStyle>
								</tr>
								<tr>
									<TdStyle style={{padding: '5px'}}>phi1phi2</TdStyle>
									<TdStyle style={{padding: '5px'}}>Particles between 1–2 phi</TdStyle>
									<TdStyle style={{padding: '5px'}}>500 – 250 µm</TdStyle>
								</tr>
								<tr>
									<TdStyle style={{padding: '5px'}}>mesh60</TdStyle>
									<TdStyle style={{padding: '5px'}}>Particles passing 60 mesh</TdStyle>
									<TdStyle style={{padding: '5px'}}>≈ 250 µm</TdStyle>
								</tr>
								<tr>
									<TdStyle style={{padding: '5px'}}>mesh120</TdStyle>
									<TdStyle style={{padding: '5px'}}>Particles passing 120 mesh</TdStyle>
									<TdStyle style={{padding: '5px'}}>≈ 125 µm</TdStyle>
								</tr>
							</tbody>
						</table>
					</div>
				)
			}
		],
	},
	mainType: {
		label: 'Main Type',
		choices: [
			{
				name: 'Free Crystal',
				definition: 'Free crystals often exhibit planar structures (e.g., twinning) and well-faceted crystal habit. We typically find plagioclase and pyroxene, minor amphibole, and rarely native sulfur and olivine.',
			},
			{
				name: 'Altered material',
				definition: 'Altered particles typically have granular texture or form aggregates that are white, or yellowish to reddish. When weathered, these typically exhibit a loss in shine (dull luster), round edges, and modifications of the original groundmass.',
			},
			{
				name: 'Lithic',
				definition: 'Lithic particles are typically dull, dark, with sub-angular to rounded edges, and contain limited signs of weathering or hydrothermal alteration.',
			},
			{
				name: 'Juvenile',
				definition: 'Juvenile particles exhibit shiny gloss, sharp edges, smooth-skinned surface, and lack of weathering and alteration features.',
			}
		]
	},
	/** NEW SHAPES CATEGORY */
	shapes: {
		label: 'Shapes',
		choices: [
			{
				name: 'blocky',
				definition: 'Relatively equant particles with perpendicular to sub-perpendicular edges.'
			},
			{
				name: 'fluidal',
				definition: 'Smooth-surfaced particles with curved, rounded walls.'
			},
			{
				name: 'microtubular',
				definition: 'Particles characterized by elongated hollows (microtubes) throughout.'
			},
			{
				name: 'spongy',
				definition: 'Abundant, relatively small vesicles (e.g., 20 µm diameter) giving a sponge-like appearance.'
			},
			{
				name: 'highly vesicular',
				definition: 'Particles with less numerous but larger vesicles (e.g., ~150 µm diameter).'
			},
			{
				name: 'pumice',
				definition: 'Golden particles whose groundmass contains abundant, <10 µm vesicles throughout.'
			},
			{
				name: 'aggregate',
				definition: 'Mixture of coated crystals, glass and/or hydrothermal material stuck together.'
			},
		],
	}
};

/**
 * AboutUs Component: Provides information about the VolcAshDB project, including
 * details about the dataset, publications, contributors, and contact information.
 * 
 * @returns {JSX.Element} - The rendered AboutUs component.
 */
const AboutUs = () => {

    // Fetch total number of particles from the custom hook
    const { totalParticles } = useFetchTotalParticles();

	const proxy = constants.PROXY;  // Proxy URL for API calls

    // State variables for toggling sections
    const [siteGuideOpen, setSiteGuideOpen] = useState(false);
	const [apiDocumentationOpen, setApiDocumentationOpen] = useState(false);
    const [latestPublicationsOpen, setLatestPublicationsOpen] = useState(false);
    const [contributorsOpen, setContributorsOpen] = useState(false);
    const [contactUsOpen, setContactUsOpen] = useState(false);

    // Toggle functions
    const toggleSiteGuide = () => setSiteGuideOpen(!siteGuideOpen);
    const toggleApiDocumentation = () => setApiDocumentationOpen(!apiDocumentationOpen);
	const toggleLatestPublications = () => setLatestPublicationsOpen(!latestPublicationsOpen);
    const toggleContributors = () => setContributorsOpen(!contributorsOpen);
    const toggleContactUs = () => setContactUsOpen(!contactUsOpen);
	
	const [databaseDesignOpen, setDatabaseDesignOpen] = useState(false);
	const toggleDatabaseDesign = () => setDatabaseDesignOpen(!databaseDesignOpen);

	const [experimentalSamplesOpen, setExperimentalSamplesOpen] = useState(false);
	const toggleExperimentalSamples = () => setExperimentalSamplesOpen(!experimentalSamplesOpen);

	const formattedParticles = totalParticles.toLocaleString();

	// Each category has its own open/close state
	const [openItems, setOpenItems] = useState({});
	const toggleCategory = (e, catKey) => {
		e.preventDefault();
		setOpenItems((prev) => ({
		...prev,
		[catKey]: !prev[catKey],
		}));
	};

	return (
		<AboutUsContainer>
			{/* Main heading for the page */}
			<h1>About VolcAshDB</h1>
			
			{/* Paragraph describing the purpose and features of VolcAshDB */}
			<span>        
				We created the Volcanic Ash DataBase (VolcAshDB) to advance towards a more standardized approach in volcanic ash particle classification. The database hosts over {formattedParticles} high-resolution images of ash particles from diverse magma compositions and eruptive styles. Each particle has been classified into one of four groups: altered material, free crystal, juvenile and lithic. In addition, particles have been individually characterized through the extraction of features sensitive to the particle shape, texture, and color. VolcAshDB allows free access for users to filter and browse through ash particle images, visualize the particle features' distributions, and download images along with their feature values and metadata. This platform can be useful for comparative studies and offers a dataset suitable for training Machine Learning models to automatically classify ash particles.
			</span>
			
			{/* Paragraph with dataset version and publication link */}
			<span style={{fontSize: '12px'}}>
				Version 0.1 of Dataset published 2024 in Centre de données de l'Institut de Physique du Globe de Paris
				<a style={{paddingLeft: '5px'}} href="https://doi.org/10.18715/ipgp.2024.lx32oxw9" target="_blank" rel="noopener noreferrer">
					https://doi.org/10.18715/ipgp.2024.lx32oxw9
				</a>
			</span>

			{/* Section for glossary / Site Guide */}
			<h2 onClick={toggleDatabaseDesign} style={{ cursor: 'pointer' }}>
				Database Design
				<IconButton color="inherit">
					{siteGuideOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
				</IconButton>
			</h2>

			{databaseDesignOpen && (
				<div>
					<span>
						The VolcAshDB database is structured using MongoDB, a NoSQL database that organizes data into flexible,
						schema-less collections. Below is a schematic representation of the database structure and list of the fields in each collection:
					</span>

					{/* Display Database Structure Image */}
					<div style={{ textAlign: "center" }}>
						<CustomImage src={database_structure} alt="VolcAshDB Database Structure"/>
					</div>

					<TableContainer>
						<TableStyle border="1">
							<thead>
								<tr>
									<ThStyle>Field</ThStyle>
									<ThStyle>Type</ThStyle>
									<ThStyle>Optionality <br /> (O means Optional, M means Mandatory)</ThStyle>
									<ThStyle>Description</ThStyle>
								</tr>
							</thead>

							<tbody>
								{/* Volcanoes Collection */}
								<tr>
									<TdStyle>
										<em>Volcanoes Collection (source Smithsonian database)</em>
									</TdStyle>
								</tr>
								<tr>
									<TdStyle>_id</TdStyle>
									<TdStyle>ObjectId</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Document identifier</TdStyle>
								</tr>
								<tr>
									<TdStyle>volc_name</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Volcano name</TdStyle>
								</tr>
								<tr>
									<TdStyle>volc_num</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Volcano identifier</TdStyle>
								</tr>

								<tr>
									<TdStyle>volc_slat</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Volcano location (latitude)</TdStyle>
								</tr>

								<tr>
									<TdStyle>volc_slon</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Volcano location (longitude)</TdStyle>
								</tr>

								<tr>
									<TdStyle>volc_status</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Status of the volcano</TdStyle>
								</tr>

								<tr>
									<TdStyle>volc_type</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Type of volcano</TdStyle>
								</tr>

								<tr>
									<TdStyle>volc_country</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Country where the volcano is located</TdStyle>
								</tr>

								<tr>
									<TdStyle>volc_mcont</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Volcanic Region Group where the volcano is located</TdStyle>
								</tr>

								<tr>
									<TdStyle>volc_subreg</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Subregion where the volcano is located</TdStyle>
								</tr>

								<tr>
									<TdStyle>volc_loc</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Volcano Landform of the volcano</TdStyle>
								</tr>

								<tr>
									<TdStyle>volc_last_eruption</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Last known eruption date of the volcano</TdStyle>
								</tr>

								<tr>
									<TdStyle>volc_selev</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Elevation of the volcano</TdStyle>
								</tr>

								<tr>
									<TdStyle>tectonic_setting</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Tectonic setting of the volcano</TdStyle>
								</tr>

								<tr>
									<TdStyle>volc_rtype</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Dominant Rock Type of the volcano</TdStyle>
								</tr>

								<tr>
									<TdStyle>data_source</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Data source of the volcano</TdStyle>
								</tr>

								{/* Eruptions Collection */}
								<tr>
									<TdStyle>
										<em>Eruptions Collection (source Smithsonian database)</em>
									</TdStyle>
								</tr>

								<tr>
									<TdStyle>_id</TdStyle>
									<TdStyle>ObjectId</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Document identifier</TdStyle>
								</tr>

								<tr>
									<TdStyle>volc_num</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Volcano identifier</TdStyle>
								</tr>

								<tr>
									<TdStyle>volc_name</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Volcano name</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_num</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Eruption identifier</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_stime</TdStyle>
									<TdStyle>Date</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption start date</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_etime</TdStyle>
									<TdStyle>Date</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption end date</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_category</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption category</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_area</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Area of activity of the eruption</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_VEI</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption Volcanic Explosivity Index (VEI) of the eruption</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_VEI_mod</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption Volcanic Explosivity Index (VEI) modifier of the eruption</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_startyear</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Eruption start year</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_startyear_mod</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption start year modifier</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_startyear_unc</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption start year uncertainty</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_startmonth</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption start month</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_startday</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption start day</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_startday_mod</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption start day modifier</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_startday_unc</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption start day uncertainty</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_evidence</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption evidence</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_endyear</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption end year</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_endyear_mod</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption end year modifier</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_endyear_unc</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption end year uncertainty</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_endmonth</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption end month</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_endday</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption end day</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_endday_mod</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption end day modifier</TdStyle>
								</tr>

								<tr>
									<TdStyle>ed_endday_unc</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eruption end day uncertainty</TdStyle>
								</tr>

								<tr>
									<TdStyle>data_source</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Eruption data source</TdStyle>
								</tr>

								<tr>
									<TdStyle>imgURL</TdStyle>
									<TdStyle>ObjectId</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Link to the image of the volcano</TdStyle>
								</tr>

								{/* Ash-Forming Events Collection */}
								<tr>
									<TdStyle>
										<em>Ash-Forming Events Collection</em>
									</TdStyle>
								</tr>

								<tr>
									<TdStyle>_id</TdStyle>
									<TdStyle>ObjectId</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Document identifier</TdStyle>
								</tr>

								<tr>
									<TdStyle>afe_code</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Ash forming event identifier</TdStyle>
								</tr>

								<tr>
									<TdStyle>volc_num</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Volcano identifier</TdStyle>
								</tr>

								<tr>
									<TdStyle>afe_date</TdStyle>
									<TdStyle>Date</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Ash forming event date</TdStyle>
								</tr>

								<tr>
									<TdStyle>eruptive_style</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Description of eruption style</TdStyle>
								</tr>

								<tr>
									<TdStyle>afe_lat</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Ash forming event location (latitude)</TdStyle>
								</tr>

								<tr>
									<TdStyle>afe_lon</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Ash forming event location (longitude)</TdStyle>
								</tr>

								<tr>
									<TdStyle>afe_end_date</TdStyle>
									<TdStyle>Date</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Ash forming event end date</TdStyle>
								</tr>

								<tr>
									<TdStyle>afe_dateBP</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Ash forming event before present date</TdStyle>
								</tr>


								{/* Samples Collection */}
								<tr>
									<TdStyle>
										<em>Samples Collection</em>
									</TdStyle>
								</tr>

								<tr>
									<TdStyle>_id</TdStyle>
									<TdStyle>ObjectId</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Document identifier</TdStyle>
								</tr>

								<tr>
									<TdStyle>sample_code</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Sampling identifier</TdStyle>
								</tr>

								<tr>
									<TdStyle>afe_code</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Ash forming event identifier</TdStyle>
								</tr>

								<tr>
									<TdStyle>sample_lat</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Sampling coordinate latitude</TdStyle>
								</tr>

								<tr>
									<TdStyle>sample_lon</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Sampling coordinate longitude</TdStyle>
								</tr>

								<tr>
									<TdStyle>volc_num</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Volcano identifier</TdStyle>
								</tr>

								<tr>
									<TdStyle>sample_nat</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Sample are natural or experimental</TdStyle>
								</tr>

								<tr>
									<TdStyle>sample_date</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Sampling date</TdStyle>
								</tr>

								<tr>
									<TdStyle>temperature_lower_bound</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Temperature lower bound for experimental samples</TdStyle>
								</tr>

								<tr>
									<TdStyle>temperature_upper_bound</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Temperature upper bound for experimental samples</TdStyle>
								</tr>

								<tr>
									<TdStyle>experiment_duration</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Duration of the experiment</TdStyle>
								</tr>

								<tr>
									<TdStyle>oxygen_fugacity</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Oxygen fugacity for experimental samples</TdStyle>
								</tr>

								<tr>
									<TdStyle>sample_techn</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Sampling technique used to collect samples</TdStyle>
								</tr>

								<tr>
									<TdStyle>sample_surf</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Surface where the samples were collected</TdStyle>
								</tr>

								<tr>
									<TdStyle>sample_collector</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Type of collector used to collect the samples</TdStyle>
								</tr>


								{/* Particles Collection */}
								<tr>
									<TdStyle>
										<em>Particles Collection</em>
									</TdStyle>
								</tr>

								<tr>
									<TdStyle>_id</TdStyle>
									<TdStyle>ObjectId</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Document identifier</TdStyle>
								</tr>

								<tr>
									<TdStyle>imgURL</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Filename of the particle's image</TdStyle>
								</tr>

								<tr>
									<TdStyle>main_type</TdStyle>
									<TdStyle>Object</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Main type of the particle</TdStyle>
								</tr>

								<tr>
									<TdStyle>sub_type</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Sub type of the particle</TdStyle>
								</tr>

								<tr>
									<TdStyle>aspect_rat</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Aspect ratio of the particle</TdStyle>
								</tr>

								<tr>
									<TdStyle>blue_mean</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Mean value of blue channel (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>blue_mode</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Mode value of blue channel (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>blue_std</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Standard deviation of blue channel (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>circularity_cioni</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Circularity cioni</TdStyle>
								</tr>

								<tr>
									<TdStyle>circularity_dellino</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Circularity dellino</TdStyle>
								</tr>

								<tr>
									<TdStyle>color</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Color of the particle</TdStyle>
								</tr>

								<tr>
									<TdStyle>comp_elon</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Compactness elongation</TdStyle>
								</tr>

								<tr>
									<TdStyle>compactness</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Compactness</TdStyle>
								</tr>

								<tr>
									<TdStyle>contrast</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Contrast</TdStyle>
								</tr>

								<tr>
									<TdStyle>convexity</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Convexity</TdStyle>
								</tr>

								<tr>
									<TdStyle>correlation</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Correlation</TdStyle>
								</tr>

								<tr>
									<TdStyle>crystallinity</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Crystallinity</TdStyle>
								</tr>

								<tr>
									<TdStyle>dissimilarity</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Dissimilarity</TdStyle>
								</tr>

								<tr>
									<TdStyle>eccentricity_ellipse</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Ellipse eccentricity</TdStyle>
								</tr>

								<tr>
									<TdStyle>eccentricity_moments</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Eccentricity moments</TdStyle>
								</tr>

								<tr>
									<TdStyle>edge</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Edge</TdStyle>
								</tr>

								<tr>
									<TdStyle>elongation</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Elongation</TdStyle>
								</tr>

								<tr>
									<TdStyle>energy</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Energy</TdStyle>
								</tr>

								<tr>
									<TdStyle>faulty_image</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Is the image faulty</TdStyle>
								</tr>

								<tr>
									<TdStyle>green_mean</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Mean value of green channel (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>green_mode</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Mode value of green channel (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>green_std</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Standard deviation of green channel (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>gsLow</TdStyle>
									<TdStyle>Number/String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Lower grain size</TdStyle>
								</tr>

								<tr>
									<TdStyle>gsUp</TdStyle>
									<TdStyle>Number/String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Upper grain size</TdStyle>
								</tr>

								<tr>
									<TdStyle>homogeneity</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Homogeneity</TdStyle>
								</tr>

								<tr>
									<TdStyle>hue_mean</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Mean value of hue histogram (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>hue_mode</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Mode value of hue histogram (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>hue_std</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Standard deviation of hue histogram (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>hydro_alter_degree</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Standard deviation of hue histogram</TdStyle>
								</tr>

								<tr>
									<TdStyle>id</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Identifier of the particle among the sample</TdStyle>
								</tr>

								<tr>
									<TdStyle>instrument</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Identifier of the instrument used for analysis</TdStyle>
								</tr>

								<tr>
									<TdStyle>luster</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Luster of the particle</TdStyle>
								</tr>

								<tr>
									<TdStyle>magnification</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Magnification level of the particle</TdStyle>
								</tr>

								<tr>
									<TdStyle>multifocus</TdStyle>
									<TdStyle>Boolean</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Is the image multifocus?</TdStyle>
								</tr>

								<tr>
									<TdStyle>rect_comp</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Rectangular composition of the particle</TdStyle>
								</tr>

								<tr>
									<TdStyle>rectangularity</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Rectangularity of the particle</TdStyle>
								</tr>

								<tr>
									<TdStyle>red_mean</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Mean value of red channel (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>red_mode</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Mode value of red channel (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>red_std</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Standard deviation of red channel (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>roundness</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Roundness of the particle</TdStyle>
								</tr>

								<tr>
									<TdStyle>sample_code</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>M</TdStyle>
									<TdStyle>Sample code of the particle</TdStyle>
								</tr>

								<tr>
									<TdStyle>saturation_mean</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Mean value of saturation channel (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>saturation_mode</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Mode value of saturation channel (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>saturation_std</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Standard deviation of saturation channel (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>shape</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Shape of the particle (shape)</TdStyle>
								</tr>

								<tr>
									<TdStyle>solidity</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Solidity of the particle (shape)</TdStyle>
								</tr>

								<tr>
									<TdStyle>ultrasound</TdStyle>
									<TdStyle>Boolean</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>The particle has been subjected to ultrasound imaging?</TdStyle>
								</tr>

								<tr>
									<TdStyle>value_mean</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Mean value of lightness (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>value_mode</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Mode value of lightness (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>value_std</TdStyle>
									<TdStyle>Number</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Standard deviation of lightness (color)</TdStyle>
								</tr>

								<tr>
									<TdStyle>weathering_sign</TdStyle>
									<TdStyle>String</TdStyle>
									<TdStyle>O</TdStyle>
									<TdStyle>Indicates if there are signs of weathering</TdStyle>
								</tr>

							</tbody>
						</TableStyle>
					</TableContainer>
				</div>
			)}

			{/* Section for glossary / Site Guide */}
			<h2 onClick={toggleExperimentalSamples} style={{ cursor: 'pointer' }}>
				Experimental samples information
				<IconButton color="inherit">
					{siteGuideOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
				</IconButton>
			</h2>

			{experimentalSamplesOpen && (
				<div>
					<span>
						These samples were experimentally modified in the work by <a href="https://link.springer.com/article/10.1007/s00410-012-0839-0">D’Oriano et al. (2012).</a>
					</span>

					<TableContainer>
						<TableStyle border="1">
							<thead>
								<tr>
									<ThStyle>sample_lat</ThStyle>
									<ThStyle>sample_lon</ThStyle>
									<ThStyle>afe_code</ThStyle>
									<ThStyle>lab_procedure[0]</ThStyle>
									<ThStyle>lab_procedure[1]</ThStyle>
									<ThStyle>temperature_lower_bound</ThStyle>
									<ThStyle>temperature_upper_bound</ThStyle>
									<ThStyle>oxygen_fugacity</ThStyle>
									<ThStyle>experiment_duration</ThStyle>
									<ThStyle>sample_code</ThStyle>
								</tr>
							</thead>
							<tbody>
								<tr>
									<TdStyle>40.82</TdStyle>
									<TdStyle>14.43</TdStyle>
									<TdStyle>VE-00-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle></TdStyle>
									<TdStyle></TdStyle>
									<TdStyle></TdStyle>
									<TdStyle></TdStyle>
									<TdStyle>VE-00-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>40.82</TdStyle>
									<TdStyle>14.43</TdStyle>
									<TdStyle>VE-01-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>high</TdStyle>
									<TdStyle>1260</TdStyle>
									<TdStyle>VE-01-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>40.82</TdStyle>
									<TdStyle>14.43</TdStyle>
									<TdStyle>VE-02-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>high</TdStyle>
									<TdStyle>80</TdStyle>
									<TdStyle>VE-02-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>40.82</TdStyle>
									<TdStyle>14.43</TdStyle>
									<TdStyle>VE-03-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>low</TdStyle>
									<TdStyle>120</TdStyle>
									<TdStyle>VE-03-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>40.82</TdStyle>
									<TdStyle>14.43</TdStyle>
									<TdStyle>VE-04-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>high</TdStyle>
									<TdStyle>120</TdStyle>
									<TdStyle>VE-04-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>40.82</TdStyle>
									<TdStyle>14.43</TdStyle>
									<TdStyle>VE-05-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>high</TdStyle>
									<TdStyle>60</TdStyle>
									<TdStyle>VE-05-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>40.82</TdStyle>
									<TdStyle>14.43</TdStyle>
									<TdStyle>VE-08-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>low</TdStyle>
									<TdStyle>105</TdStyle>
									<TdStyle>VE-08-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>40.82</TdStyle>
									<TdStyle>14.43</TdStyle>
									<TdStyle>VE-10-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>1100</TdStyle>
									<TdStyle>1100</TdStyle>
									<TdStyle>low</TdStyle>
									<TdStyle>100</TdStyle>
									<TdStyle>VE-10-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>40.82</TdStyle>
									<TdStyle>14.43</TdStyle>
									<TdStyle>VE-11-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>1100</TdStyle>
									<TdStyle>1100</TdStyle>
									<TdStyle>high</TdStyle>
									<TdStyle>140</TdStyle>
									<TdStyle>VE-11-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>37.75</TdStyle>
									<TdStyle>15</TdStyle>
									<TdStyle>ET-00-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle></TdStyle>
									<TdStyle></TdStyle>
									<TdStyle></TdStyle>
									<TdStyle></TdStyle>
									<TdStyle>ET-00-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>37.75</TdStyle>
									<TdStyle>15</TdStyle>
									<TdStyle>ET-02-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>high</TdStyle>
									<TdStyle>81</TdStyle>
									<TdStyle>ET-02-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>37.75</TdStyle>
									<TdStyle>15</TdStyle>
									<TdStyle>ET-03-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>high</TdStyle>
									<TdStyle>175</TdStyle>
									<TdStyle>ET-03-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>37.75</TdStyle>
									<TdStyle>15</TdStyle>
									<TdStyle>ET-04-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>high</TdStyle>
									<TdStyle>976</TdStyle>
									<TdStyle>ET-04-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>37.75</TdStyle>
									<TdStyle>15</TdStyle>
									<TdStyle>ET-05-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>1100</TdStyle>
									<TdStyle>1100</TdStyle>
									<TdStyle>high</TdStyle>
									<TdStyle>60</TdStyle>
									<TdStyle>ET-05-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>37.75</TdStyle>
									<TdStyle>15</TdStyle>
									<TdStyle>ET-06-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>high</TdStyle>
									<TdStyle>60</TdStyle>
									<TdStyle>ET-06-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>37.75</TdStyle>
									<TdStyle>15</TdStyle>
									<TdStyle>ET-07-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>high</TdStyle>
									<TdStyle>103</TdStyle>
									<TdStyle>ET-07-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>37.75</TdStyle>
									<TdStyle>15</TdStyle>
									<TdStyle>ET-08-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>1100</TdStyle>
									<TdStyle>1100</TdStyle>
									<TdStyle>high</TdStyle>
									<TdStyle>30</TdStyle>
									<TdStyle>ET-08-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>37.75</TdStyle>
									<TdStyle>15</TdStyle>
									<TdStyle>ET-11-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>1100</TdStyle>
									<TdStyle>1100</TdStyle>
									<TdStyle>low</TdStyle>
									<TdStyle>70</TdStyle>
									<TdStyle>ET-11-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>37.75</TdStyle>
									<TdStyle>15</TdStyle>
									<TdStyle>ET-15-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>high</TdStyle>
									<TdStyle>70</TdStyle>
									<TdStyle>ET-15-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>37.75</TdStyle>
									<TdStyle>15</TdStyle>
									<TdStyle>ET-16-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>low</TdStyle>
									<TdStyle>180</TdStyle>
									<TdStyle>ET-16-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>37.75</TdStyle>
									<TdStyle>15</TdStyle>
									<TdStyle>ET-20-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>high</TdStyle>
									<TdStyle>1260</TdStyle>
									<TdStyle>ET-20-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>37.75</TdStyle>
									<TdStyle>15</TdStyle>
									<TdStyle>ET-29-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>low</TdStyle>
									<TdStyle>978</TdStyle>
									<TdStyle>ET-29-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>37.75</TdStyle>
									<TdStyle>15</TdStyle>
									<TdStyle>ET-30-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>low</TdStyle>
									<TdStyle>978</TdStyle>
									<TdStyle>ET-30-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>38.79</TdStyle>
									<TdStyle>15.21</TdStyle>
									<TdStyle>ST-00-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle></TdStyle>
									<TdStyle></TdStyle>
									<TdStyle></TdStyle>
									<TdStyle></TdStyle>
									<TdStyle>ST-00-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>38.79</TdStyle>
									<TdStyle>15.21</TdStyle>
									<TdStyle>ST-01-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>high</TdStyle>
									<TdStyle>660</TdStyle>
									<TdStyle>ST-01-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>38.79</TdStyle>
									<TdStyle>15.21</TdStyle>
									<TdStyle>ST-02-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>high</TdStyle>
									<TdStyle>80</TdStyle>
									<TdStyle>ST-02-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>38.79</TdStyle>
									<TdStyle>15.21</TdStyle>
									<TdStyle>ST-03-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>700</TdStyle>
									<TdStyle>low</TdStyle>
									<TdStyle>1140</TdStyle>
									<TdStyle>ST-03-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>38.79</TdStyle>
									<TdStyle>15.21</TdStyle>
									<TdStyle>ST-07-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>1100</TdStyle>
									<TdStyle>1100</TdStyle>
									<TdStyle>low</TdStyle>
									<TdStyle>210</TdStyle>
									<TdStyle>ST-07-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>38.79</TdStyle>
									<TdStyle>15.21</TdStyle>
									<TdStyle>ST-09-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>1000</TdStyle>
									<TdStyle>low</TdStyle>
									<TdStyle>120</TdStyle>
									<TdStyle>ST-09-EXP_1</TdStyle>
								</tr>
								<tr>
									<TdStyle>38.79</TdStyle>
									<TdStyle>15.21</TdStyle>
									<TdStyle>ST-11-EXP</TdStyle>
									<TdStyle>cleaning</TdStyle>
									<TdStyle>sieving</TdStyle>
									<TdStyle>1100</TdStyle>
									<TdStyle>1100</TdStyle>
									<TdStyle>high</TdStyle>
									<TdStyle>100</TdStyle>
									<TdStyle>ST-11-EXP_1</TdStyle>
								</tr>
							</tbody>
						</TableStyle>
					</TableContainer>
				</div>					
			)}

			{/* Collapsible Glossary Section */}
			<h2 onClick={toggleSiteGuide} style={{ cursor: 'pointer' }}>
				Glossary of terms
				<IconButton color="inherit">
					{siteGuideOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
				</IconButton>
			</h2>

			{siteGuideOpen && (
				<div>
					<span>Click a category to view definitions. Expand sub-items using the arrow.</span>
					<ul>
						{Object.entries(glossaryData).map(([catKey, { label, choices }]) => (
							<li key={catKey}>
								<a href={`#${catKey}`}><strong>{label}</strong></a>
								{choices && (
									<>
										<IconButton onClick={(e) => toggleCategory(e, catKey)} size="small">
											{openItems[catKey] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
										</IconButton>
										{openItems[catKey] && (
											<ul>
												{choices.map(({ name }) => (
													<li key={name}>
														<a href={`#${makeSubId(catKey, name)}`}>{name}</a>
													</li>
												))}
											</ul>
										)}
									</>
								)}
							</li>
						))}
					</ul>
					<hr />
					<div id="glossary-definitions">
						{Object.entries(glossaryData).map(([catKey, { label, choices }]) => (
							<div key={catKey} id={catKey}>
								<h3>{label}</h3>
								{choices.map(({ name, definition }) => (
									<div key={name} id={makeSubId(catKey, name)} style={{ marginLeft: '1.5rem' }}>
										<span><strong>{name}</strong>: {definition}</span>
									</div>
								))}
							</div>
						))}
					</div>
				</div>
			)}

			{/* Section for API Documentation */}
			<h2 onClick={toggleApiDocumentation} style={{ cursor: 'pointer' }}>
				API Documentation
				<IconButton color="inherit">
					{apiDocumentationOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
				</IconButton>
			</h2>

			{apiDocumentationOpen && (
				<Box sx={{ maxWidth: '1000px', margin: 'auto', padding: 4 }}>
					<Typography variant="h3" gutterBottom style={{textAlign: "center"}}>
					VolcAshDB API Documentation
					</Typography>

					<Typography variant="body1" color="text.secondary" paragraph>
					Welcome to the VolcAshDB API! This RESTful API provides access to volcano eruption data for research and visualization.
					</Typography>

					<Card sx={{ mb: 4 }}>
						<CardContent>
							<Typography variant="h5" gutterBottom>
							Base URL
							</Typography>
							<CodeBlock component="pre">
								<code>https://volcashdb.ipgp.fr/api</code>
							</CodeBlock>
						</CardContent>
						<CardContent>
							<Typography variant="h5" gutterBottom>Limit Rate</Typography>
							<Typography variant="body1" color="text.secondary" paragraph>
								To ensure fair usage and maintain server performance, the VolcAshDB API is rate-limited.
								Each IP address is allowed a maximum of <strong>20 requests every 5 minutes</strong>.
							</Typography>
							<Typography variant="body2" color="error">
								If this limit is exceeded, the server will respond with HTTP status code (<code>429 Too Many Requests</code>) and the following message:
							</Typography>
							<CodeBlock component="pre">
								<code>{`{\n\t"message": "Too many requests from this IP, please try again later."\n}`}</code>
							</CodeBlock>
						</CardContent>
						<CardContent>
							<Typography variant="h5" gutterBottom>Interact with API</Typography>
							<Typography variant="body1" color="text.secondary" paragraph>
								You can send requests directly from the webpage using the following link:
							</Typography>
							<CodeBlock component="pre">
								<code>https://volcashdb.ipgp.fr/api-docs</code>
							</CodeBlock>
						</CardContent>

					</Card>

					<Card sx={{ mb: 4 }}>
						<CardContent>
							<Typography variant="h5" gutterBottom>Status Codes</Typography>
							<List dense>
								<ListItem>
									<ListItemText primary="200 OK – The request was successfully processed and a valid response was returned."/>
								</ListItem>
								<ListItem>
									<ListItemText primary="400 Bad Request – The request could not be processed due to invalid or missing parameters."/>
								</ListItem>
								<ListItem>
									<ListItemText primary="404 Not Found – The requested resource could not be located on the server."/>
								</ListItem>
								<ListItem>
									<ListItemText primary="500 Internal Server Error – An unexpected error occurred on the server while processing the request."/>
								</ListItem>
							</List>
						</CardContent>
					</Card>

					<Card>
						<CardContent>
							<Typography variant="h5" gutterBottom>Tips & Notes</Typography>
							<List dense>
								<ListItem>
									<ListItemText primary="All API responses are returned in JSON format for easy integration."/>
								</ListItem>
								<ListItem>
									<ListItemText primary="Authentication is not required to access public endpoints."/>
								</ListItem>
								<ListItem>
									<ListItemText primary="You can use tools such as axios, fetch, curl, or Postman to interact with the API and test requests."/>
								</ListItem>
							</List>
						</CardContent>
					</Card>
				</Box>
			)}

			{/* Section for latest publications */}
			<h2 onClick={toggleLatestPublications} style={{ cursor: 'pointer' }}>
				Latest Publications
				<IconButton color="inherit">
					{latestPublicationsOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
				</IconButton>
			</h2>

			{latestPublicationsOpen && (
				<div>
					<p>
						Benet, D., Costa, F., Migadel, K. Lee, D., D'Oriano, C., Pompilio, M., Nurfiani, D., Rifai, H., 2025. A repository-hosted dataset of volcanic ash particle images and features. Scientific Data, 12, 681.
                        <br/>
                        <a href="https://doi.org/10.1038/s41597-025-04942-9" target="_blank" rel="noopener noreferrer">
                            https://doi.org/10.1038/s41597-025-04942-9
                        </a>
                    </p>
					
					<p>
						Benet, D., Costa, F., Widiwijayanti, C., 2024. Volcanic ash classification through Machine Learning. Geochemistry, Geophysics, Geosystems.
						<br/>
						<a href="https://doi.org/10.1029/2023GC011224" target="_blank" rel="noopener noreferrer">
							https://doi.org/10.1029/2023GC011224
						</a>
					</p>

					<p>
						Benet, D., Costa, F., Widiwijayanti, C., Pallister, J., Pedreros, G., Allard, P., Humaida, H., Aoki, Y. and Maeno, F., 2024. VolcAshDB: a Volcanic Ash DataBase of classified particle images and features. Bulletin of Volcanology, 86(1), pp.1-30.
						<br/>
						<a href="https://doi.org/10.1007/s00445-023-01695-4" target="_blank" rel="noopener noreferrer">
							https://doi.org/10.1007/s00445-023-01695-4
						</a>
					</p>
				</div>
			)}

			{/* Section for listing contributors */}
			<h2 onClick={toggleContributors} style={{ cursor: 'pointer' }}>
				Contributors
				<IconButton color="inherit">
					{contributorsOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
				</IconButton>
			</h2>
			{contributorsOpen && (
				<div>
					<strong>VolcAshDB Team</strong>
					<ul style={{listStyleType:"none"}}>
						<strong>Project Principal Investigator</strong>
						<ul style={{listStyleType:"none"}}>
							<li>Fidel Costa</li>
						</ul>     
						<strong>Coordinators</strong>
						<ul style={{listStyleType:"none"}}>
							<li>Damià Benet</li>
							<li>Kévin Migadel</li>
						</ul>  
						<strong>Web developer</strong>
						<ul style={{listStyleType:"none"}}>
							<li>Kévin Migadel</li>
						</ul>   
						<strong>Data analyst</strong>
						<ul style={{listStyleType:"none"}}>
							<li>Damià Benet</li>
						</ul>           
					</ul>

					<strong>Computer services support by SMV</strong>
					<ul style={{listStyleType:"none"}}>
						<li>David Waissenbach</li>
						<li>Michel Le Cocq</li>
					</ul>

					<strong>Previous developers</strong>
					<ul style={{listStyleType:"none"}}>
						<li>Charles Tran</li>
						<li>Khai Truong</li>
					</ul>

					<strong>Contributors</strong>
					<ul style={{listStyleType:"none"}}>
						<li>John Pallister</li>
						<li>Gabriela Pedredos</li>
						<li>Patrick Allard</li>
						<li>Hanik Humaida</li>
						<li>Yosuke Aoki</li>
						<li>Fukashi Maeno</li>
						<li>Daniel W. J. Lee</li>
						<li>Claudia D'Oriano</li>
						<li>Massimo Pompilio</li>
						<li>Dini Nurfiani</li>
						<li>Hamdi Rifai</li>
						<li>Florian Dugauquier</li>
					</ul>
				</div>
			)}

			{/* Section for contact information */}
			<h2 onClick={toggleContactUs} style={{ cursor: 'pointer' }}>
				Contact Us
				<IconButton color="inherit">
					{contactUsOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
				</IconButton>
			</h2>
			{contactUsOpen && (
				<div>
					<p>
						If you have any questions or would like to get in touch, contact us at:&nbsp;  
						<a href="mailto:volcashdb@ipgp.fr">volcashdb@ipgp.fr</a>
					</p>
				</div>
			)}

			{/* Footer with links to legal information, privacy policy, and license */}
			<Footer>
				<CustomLinkLegalInformation to='/legal' component={RouterLink} >
					Legal information
				</CustomLinkLegalInformation>
				<CustomLinkLegalInformation to='/legal' component={RouterLink}>
					Privacy policy / Data protection
				</CustomLinkLegalInformation>
				<CustomLinkLegalInformation to='/legal' component={RouterLink}>
					License
				</CustomLinkLegalInformation>
			</Footer>
		</AboutUsContainer>
    );
};

export default AboutUs;
