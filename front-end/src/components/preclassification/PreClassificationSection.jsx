import { useState } from 'react';
import { useFetchOOD } from '../../hooks/useFetchOOD';
import { PROXY } from '../../Constants';
import {
	Typography,
	Box,
	Paper,
	Button,
	Alert,
	Table,
	TableBody,
	TableCell,
	TableRow,
	LinearProgress,
	Accordion,
	AccordionSummary,
	AccordionDetails
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BiotechIcon from '@mui/icons-material/Biotech';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';

/**
 * Pre-Classification Check Section Component
 * Allows users to upload ZIP files for Out-of-Distribution analysis
 */
function PreClassificationSection() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [fileError, setFileError] = useState(null);
	const [isDragging, setIsDragging] = useState(false);
	
	const { 
		analyzeOOD,
		downloadZip,
		isLoading, 
		error, 
		results,
		clearResults
	} = useFetchOOD();

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		validateAndSetFile(file);
	};

	const validateAndSetFile = (file) => {
		if (!file) return;
		
		if (!file.name.toLowerCase().endsWith('.zip')) {
			setFileError('Please select a ZIP file');
			setSelectedFile(null);
			return;
		}

		const maxSize = 150 * 1024 * 1024; // 150 MB
		if (file.size > maxSize) {
			setFileError('File size exceeds 150 MB limit');
			setSelectedFile(null);
			return;
		}
		
		setSelectedFile(file);
		setFileError(null);
	};

	// Drag and drop handlers
	const handleDragEnter = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const file = e.dataTransfer.files[0];
		if (file) {
			validateAndSetFile(file);
		}
	};

	const handlePaperClick = () => {
		document.getElementById('ood-file-upload').click();
	};

	const handleSubmit = async () => {
		if (!selectedFile) {
			setFileError('Please select a file');
			return;
		}

		await analyzeOOD(selectedFile);
	};

	const handleReset = () => {
		setSelectedFile(null);
		setFileError(null);
		clearResults();
	};

	const formatFileSize = (bytes) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
	};

	return (
		<Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
			<Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
				<BiotechIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
				Pre-classification Check
			</Typography>

			<Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
				Upload a ZIP containing particle images to check if they are similar 
				to the training dataset. This helps identify unusual or out-of-domain particles 
				before running the full classification.
			</Typography>

			{/* Important Information */}
			<Accordion defaultExpanded sx={{ mb: 3, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
				<AccordionSummary 
					expandIcon={<ExpandMoreIcon />}
					sx={{ backgroundColor: '#f5f5f5' }}
				>
					<Typography sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
						<LockIcon fontSize="small" color="primary" />
						Important Information
					</Typography>
				</AccordionSummary>
				<AccordionDetails sx={{ padding: '20px' }}>
					<Box sx={{ mb: 2 }}>
						<Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
							<LockIcon fontSize="small" /> Data Handling
						</Typography>
						<Typography variant="body2" sx={{ color: '#666', pl: 3 }}>
							All data and images sent through this page will not be stored or retained. Your privacy is protected.
						</Typography>
					</Box>
				</AccordionDetails>
			</Accordion>

			{/* Upload Section */}
			{!results && (
				<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
					<Typography variant="h6" gutterBottom>
						Upload Particle Images
					</Typography>

					<Paper
						elevation={0}
						onClick={handlePaperClick}
						onDragEnter={handleDragEnter}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						sx={{
							padding: '40px',
							textAlign: 'center',
							backgroundColor: isDragging ? '#c8e6c9' : '#f5f5f5',
							border: isDragging ? '2px solid #388e3c' : '2px dashed #ccc',
							borderRadius: '10px',
							cursor: 'pointer',
							transition: 'all 0.3s ease',
							'&:hover': {
								backgroundColor: '#e8f5e9',
								borderColor: '#388e3c',
							},
						}}
					>
						<CloudUploadIcon sx={{ fontSize: 60, color: '#388e3c', mb: 2 }} />
						<Typography variant="h6" sx={{ mb: 1 }}>
							Click or drag & drop
						</Typography>
						<Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
							ZIP file containing particle images
						</Typography>
						<Typography variant="caption" sx={{ color: '#999', display: 'block', mb: 1 }}>
							Maximum file size: 150 MB
						</Typography>

						<input
							type="file"
							onChange={handleFileChange}
							accept=".zip"
							style={{ display: 'none' }}
							id="ood-file-upload"
						/>

						{selectedFile && (
							<Box
								sx={{
									mt: 2,
									p: 2,
									backgroundColor: '#e8f5e9',
									borderRadius: '8px',
									display: 'inline-flex',
									alignItems: 'center',
									gap: 1,
								}}
							>
								<CheckCircleIcon sx={{ color: '#388e3c' }} />
								<Box>
									<Typography variant="body2" sx={{ fontWeight: 600 }}>
										{selectedFile.name}
									</Typography>
									<Typography variant="caption" sx={{ color: '#666' }}>
										{formatFileSize(selectedFile.size)}
									</Typography>
								</Box>
							</Box>
						)}

						{fileError && (
							<Alert severity="error" sx={{ mt: 2 }}>
								{fileError}
							</Alert>
						)}
					</Paper>

					{selectedFile && (
						<Button
							variant="contained"
							onClick={handleSubmit}
							disabled={isLoading}
							sx={{ mt: 2, backgroundColor: '#1976d2' }}
						>
							{isLoading ? 'Analyzing...' : 'Analyze'}
						</Button>
					)}

					{error && (
						<Alert severity="error" sx={{ mt: 2 }}>
							{error}
						</Alert>
					)}

					{isLoading && (
						<Box sx={{ mt: 2 }}>
							<LinearProgress />
							<Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#666' }}>
								This may take a few minutes depending on the number of images...
							</Typography>
						</Box>
					)}
				</Paper>
			)}

			{/* Results Section */}
			{results && (
				<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
					<Typography variant="h6" gutterBottom>
						Analysis Results
					</Typography>

					{/* Summary Table */}
					<Table size="small" sx={{ mb: 3 }}>
						<TableBody>
							<TableRow>
								<TableCell><strong>Total images analyzed</strong></TableCell>
								<TableCell align="right"><strong>{results.total_images}</strong></TableCell>
							</TableRow>
							<TableRow sx={{ backgroundColor: '#e8f5e9' }}>
								<TableCell>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#4caf50' }} />
										<strong>GREEN</strong>
									</Box>
								</TableCell>
								<TableCell align="right">
									{results.summary.green.count} ({results.summary.green.percentage.toFixed(1)}%)
								</TableCell>
							</TableRow>
							<TableRow sx={{ backgroundColor: '#fff8e1' }}>
								<TableCell>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff9800' }} />
										<strong>AMBER</strong>
									</Box>
								</TableCell>
								<TableCell align="right">
									{results.summary.amber.count} ({results.summary.amber.percentage.toFixed(1)}%)
								</TableCell>
							</TableRow>
							<TableRow sx={{ backgroundColor: '#ffebee' }}>
								<TableCell>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f44336' }} />
										<strong>RED</strong>
									</Box>
								</TableCell>
								<TableCell align="right">
									{results.summary.red.count} ({results.summary.red.percentage.toFixed(1)}%)
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>

					<Alert severity="info" sx={{ mb: 3 }}>
						<strong>What do these colors mean?</strong>
						<ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
							<li><strong>GREEN:</strong> Images similar to training data (within 95th percentile)</li>
							<li><strong>AMBER:</strong> Moderately different (95th-99th percentile) - review recommended</li>
							<li><strong>RED:</strong> Significantly different (&gt;99th percentile) - manual review suggested</li>
						</ul>
					</Alert>

					{/* UMAP Visualization */}
					{results.umap_plot_url && (
						<Box sx={{ mb: 3, textAlign: 'center' }}>
							<Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
								UMAP Visualization
							</Typography>
							<Typography variant="caption" sx={{ display: 'block', mb: 2, color: '#666' }}>
								2D projection showing distribution of your images (colored dots) relative to training data (gray)
							</Typography>
							<Box sx={{ 
								border: '1px solid #ccc', 
								borderRadius: '8px', 
								overflow: 'hidden',
								display: 'inline-block'
							}}>
								<img 
									src={`${PROXY}${results.umap_plot_url}`}
									alt="UMAP Plot" 
									style={{ maxWidth: '100%', display: 'block' }}
								/>
							</Box>
						</Box>
					)}

					{/* Download Reports */}
					<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
						<Button
							variant="contained"
							startIcon={<DownloadIcon />}
							onClick={() => downloadZip(results.sessionId)}
							sx={{ backgroundColor: '#388e3c' }}
						>
							Download Complete Analysis (ZIP)
						</Button>
						<Button
							variant="outlined"
							onClick={handleReset}
						>
							Analyze Another File
						</Button>
					</Box>
				</Paper>
			)}
		</Box>
	);
}

export default PreClassificationSection;
