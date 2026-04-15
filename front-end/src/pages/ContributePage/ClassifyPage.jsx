import { useState } from 'react';
import { Typography, Box, Tabs, Tab } from '@mui/material';
import CropIcon from '@mui/icons-material/Crop';
import BiotechIcon from '@mui/icons-material/Biotech';
import CategoryIcon from '@mui/icons-material/Category';
import { Container } from './ClassifyPage.style';
import PreprocessingSection from '../../components/preprocessing/PreprocessingSection';
import PreClassificationSection from '../../components/preclassification/PreClassificationSection';
import ClassificationSection from '../../components/classify/ClassificationSection';

function TabPanel({ children, value, index }) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`classify-tabpanel-${index}`}
			aria-labelledby={`classify-tab-${index}`}
		>
			{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
		</div>
	);
}

function ClassifyPage() {
	const [activeTab, setActiveTab] = useState(0);

	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);
	};

	return (
		<Container>
			<Typography gutterBottom variant="h4" align="center" style={{ fontWeight: "600", mb: 3 }}>
				Classify your ash particles
			</Typography>

			<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
				<Tabs 
					value={activeTab} 
					onChange={handleTabChange} 
					centered
					sx={{
						'& .MuiTab-root': {
							fontSize: '1rem',
							fontWeight: 500,
							textTransform: 'none',
						}
					}}
				>
					<Tab 
						icon={<CropIcon sx={{ verticalAlign: 'middle', mr: 1 }} />} 
						iconPosition="start" 
						label="Processing Tool" 
						id="classify-tab-0"
						aria-controls="classify-tabpanel-0"
					/>
					<Tab 
						icon={<BiotechIcon sx={{ verticalAlign: 'middle', mr: 1 }} />} 
						iconPosition="start" 
						label="Pre-classification Check" 
						id="classify-tab-1"
						aria-controls="classify-tabpanel-1"
					/>
					<Tab 
						icon={<CategoryIcon sx={{ verticalAlign: 'middle', mr: 1 }} />} 
						iconPosition="start" 
						label="Classify" 
						id="classify-tab-2"
						aria-controls="classify-tabpanel-2"
					/>
				</Tabs>
			</Box>

			<TabPanel value={activeTab} index={0}>
				<PreprocessingSection />
			</TabPanel>

			<TabPanel value={activeTab} index={1}>
				<PreClassificationSection />
			</TabPanel>

			<TabPanel value={activeTab} index={2}>
				<ClassificationSection />
			</TabPanel>
		</Container>
    )
}

export default ClassifyPage