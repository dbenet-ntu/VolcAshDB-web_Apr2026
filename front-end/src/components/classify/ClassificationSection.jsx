import { useState } from 'react';
import { useFetchClassify } from '../../hooks/useFetchClassify';
import {
	Typography,
	Box,
	Paper,
	Button,
	Chip,
	Link,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import ImageIcon from '@mui/icons-material/Image';
import LockIcon from '@mui/icons-material/Lock';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import { RiseLoader } from 'react-spinners';

import particleWithBackground from '../../assets/images/particle_with_background.png';
import particleWithTransparentBackground from '../../assets/images/particle_with_transparent_background.png';

/**
 * Classification Section Component
 * Allows users to upload ZIP or images for particle classification
 */
function ClassificationSection() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [fileError, setFileError] = useState(null);
	const [isDragging, setIsDragging] = useState(false);

	const { classify, isLoading, error, success } = useFetchClassify();

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		validateAndSetFile(file);
	};

	const validateAndSetFile = (file) => {
		setFileError(null);

		if (file) {
			const validExtensions = ['.zip', '.png', '.jpg', '.jpeg'];
			const fileName = file.name.toLowerCase();
			const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

			if (!isValid) {
				setFileError('Please select a valid file (ZIP, PNG, JPG, JPEG)');
				setSelectedFile(null);
				return;
			}

			const maxSize = 60 * 1024 * 1024; // 60 MB
			if (file.size > maxSize) {
				setFileError('File size exceeds 60 MB limit');
				setSelectedFile(null);
				return;
			}

			setSelectedFile(file);
		}
	};

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
		document.getElementById('classification-file-upload').click();
	};

	const handleRemoveFile = (e) => {
		e.stopPropagation();
		setSelectedFile(null);
		setFileError(null);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			handlePaperClick();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!selectedFile) {
			setFileError('Please select a file');
			return;
		}
		await classify(selectedFile);
	};

	const formatFileSize = (bytes) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
	};

	return (
		<Box sx={{ maxWidth: '900px', margin: '0 auto' }}>
			<Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
				Upload Images for Classification
			</Typography>

			{/* File Format Requirements */}
			<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
				<Chip 
					icon={<FolderZipIcon />} 
					label="ZIP file (recommended)" 
					color="primary" 
					variant="outlined"
					sx={{ fontWeight: 600, padding: '5px 10px' }}
				/>
				<Typography variant="body2" sx={{ color: '#666' }}>or</Typography>
				<Chip 
					icon={<ImageIcon />} 
					label="Single image (PNG, JPG, JPEG)" 
					color="secondary" 
					variant="outlined"
					sx={{ fontWeight: 600, padding: '5px 10px' }}
				/>
			</Box>

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
					
					<Box sx={{ mb: 2 }}>
						<Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
							Classification Assumptions
						</Typography>
						<Typography variant="body2" sx={{ color: '#666', pl: 3 }}>
							Our classifier has been specifically trained to recognize ash particles. By using this service, you acknowledge that submitted images are assumed to be ash particles.
						</Typography>
					</Box>
					
					<Box>
						<Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
							<PhotoLibraryIcon fontSize="small" /> Image Requirements
						</Typography>
						<Typography variant="body2" sx={{ color: '#666', pl: 3, mb: 2 }}>
							For optimal accuracy:
							<ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
								<li>The particle should occupy at least 70–80% of the image area. Our analysis shows that having less background improves classification accuracy.</li>
								<li>The background must be transparent.</li>
								<li>The image should be multi-focused (all regions in good focus).</li>
							</ul>
						</Typography>

						<Typography variant="body2" sx={{ color: '#666', pl: 3, mb: 2 }}>
							For background removal, you can use services such as{' '}
							<Link href="https://www.rembg.com/" target="_blank" rel="noopener noreferrer" sx={{ color: '#388e3c', fontWeight: 600 }}>
								rembg.com
							</Link>
						</Typography>

						{/* Image Examples */}
						<Box sx={{ pl: 3, display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
							<Box sx={{ textAlign: 'center', flex: '1 1 200px', maxWidth: '250px' }}>
								<Box sx={{ 
									border: '2px solid #B20E27', 
									borderRadius: '8px', 
									padding: '10px', 
									backgroundColor: '#fff',
									position: 'relative'
								}}>
									<CancelIcon sx={{ position: 'absolute', top: -12, right: -12, color: '#B20E27', fontSize: 30, backgroundColor: '#fff', borderRadius: '50%' }} />
									<img 
										src={particleWithBackground} 
										alt="Particle with background - incorrect" 
										style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }}
									/>
								</Box>
								<Typography variant="caption" sx={{ color: '#B20E27', fontWeight: 600, mt: 1, display: 'block' }}>
									❌ With Background (Incorrect)
								</Typography>
							</Box>

							<Box sx={{ textAlign: 'center', flex: '1 1 200px', maxWidth: '250px' }}>
								<Box sx={{ 
									border: '2px solid #388e3c', 
									borderRadius: '8px', 
									padding: '10px', 
									backgroundColor: '#fff',
									position: 'relative'
								}}>
									<CheckCircleOutlineIcon sx={{ position: 'absolute', top: -12, right: -12, color: '#388e3c', fontSize: 30, backgroundColor: '#fff', borderRadius: '50%' }} />
									<img 
										src={particleWithTransparentBackground} 
										alt="Particle with transparent background - correct" 
										style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }}
									/>
								</Box>
								<Typography variant="caption" sx={{ color: '#388e3c', fontWeight: 600, mt: 1, display: 'block' }}>
									✅ Transparent Background (Correct)
								</Typography>
							</Box>
						</Box>
					</Box>
				</AccordionDetails>
			</Accordion>

			{/* Upload Form */}
			<form onSubmit={handleSubmit}>
				<Paper 
					elevation={3} 
					onClick={handlePaperClick}
					onDragEnter={handleDragEnter}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					onKeyDown={handleKeyDown}
					tabIndex={0}
					role="button"
					aria-label="Upload file area"
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
						'&:focus': {
							outline: '2px solid #388e3c',
							outlineOffset: '2px',
						},
						mb: 3
					}}
				>
					<CloudUploadIcon sx={{ fontSize: 60, color: '#388e3c', mb: 2 }} />
					<Typography variant="h6" sx={{ mb: 1, color: '#333' }}>
						Click or drag & drop
					</Typography>
					<Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
						ZIP file or image (PNG, JPG, JPEG)
					</Typography>
					<Typography variant="caption" sx={{ color: '#999', display: 'block', mb: 1 }}>
						Maximum file size: 60 MB
					</Typography>
					<Typography variant="caption" sx={{ color: '#999', display: 'block', mb: 1 }}>
						Results are sent via email (7MB limit)
					</Typography>
					<Typography variant="caption" sx={{ color: '#888', fontStyle: 'italic', display: 'block' }}>
						✓ Images at ZIP root or in one folder
					</Typography>
					<Typography variant="caption" sx={{ color: '#888', fontStyle: 'italic' }}>
						✗ Multiple folders or nested structure
					</Typography>
					
					<input 
						type="file" 
						onChange={handleFileChange} 
						accept=".zip,image/png,image/jpeg,image/jpg"
						style={{ display: 'none' }}
						id="classification-file-upload"
					/>
					
					{selectedFile && (
						<Box sx={{ 
							mt: 2, 
							p: 2, 
							backgroundColor: '#e8f5e9', 
							borderRadius: '8px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: 2,
							border: '1px solid #388e3c'
						}}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<CheckCircleIcon sx={{ color: '#388e3c' }} />
								<Box>
									<Typography variant="body1" sx={{ fontWeight: 600, color: '#388e3c' }}>
										{selectedFile.name}
									</Typography>
									<Typography variant="caption" sx={{ color: '#666' }}>
										{formatFileSize(selectedFile.size)}
									</Typography>
								</Box>
							</Box>
							<Chip 
								label="Remove" 
								onClick={handleRemoveFile}
								onDelete={handleRemoveFile}
								size="small"
								sx={{ 
									cursor: 'pointer',
									'&:hover': { backgroundColor: '#d32f2f', color: '#fff' }
								}}
							/>
						</Box>
					)}
					
					{fileError && (
						<Box sx={{ 
							mt: 2, 
							p: 2, 
							backgroundColor: 'rgba(178,14,39,0.1)', 
							borderRadius: '8px',
							border: '1px solid #B20E27'
						}}>
							<Typography variant="body2" sx={{ color: '#B20E27', fontWeight: 500 }}>
								{fileError}
							</Typography>
						</Box>
					)}
				</Paper>
				
				<Button 
					variant='contained' 
					type="submit" 
					disabled={isLoading || !selectedFile}
					sx={{ width: '200px', display: 'block', margin: '0 auto' }}
				>
					{isLoading ? 'Processing...' : 'Upload & Classify'}
				</Button>
			</form>
			
			{/* Feedback */}
			{error && (
				<Box sx={{ mt: 2 }}>
					<Paper sx={{ p: 2, backgroundColor: '#ffebee', border: '1px solid #f44336' }}>
						<Typography sx={{ color: '#d32f2f' }}>{error}</Typography>
					</Paper>
				</Box>
			)}
			{success && (
				<Box sx={{ mt: 2 }}>
					<Paper sx={{ p: 2, backgroundColor: '#e8f5e9', border: '1px solid #4caf50' }}>
						<Typography sx={{ color: '#2e7d32' }}>{success}</Typography>
					</Paper>
				</Box>
			)}

			{/* Loading State */}
			{isLoading && (
				<Box sx={{ textAlign: 'center', mt: 4 }}>
					<Typography variant="h6" sx={{ mb: 2, color: '#388e3c' }}>
						Uploading and classifying images...
					</Typography>
					<Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
						This may take several minutes. Please don't close this page.
					</Typography>
					<RiseLoader
						cssOverride={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
						size={10}
						color={"#388e3c"}
						loading={isLoading}
					/>
				</Box>
			)}
		</Box>
	);
}

export default ClassificationSection;
