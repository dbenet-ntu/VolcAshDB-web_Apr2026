import { useState, useEffect, useRef } from 'react';
import {
	Typography,
	Box,
	Paper,
	Button,
	LinearProgress,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Alert,
	CircularProgress,
	Slider,
	Tooltip,
	ToggleButton,
	ToggleButtonGroup,
	Accordion,
	AccordionSummary,
	AccordionDetails
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import CropIcon from '@mui/icons-material/Crop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DrawIcon from '@mui/icons-material/Draw';
import PanToolIcon from '@mui/icons-material/PanTool';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import { useFetchPreprocessing } from '../../hooks/useFetchPreprocessing';
import * as constants from '../../Constants';

/**
 * Preprocessing Section Component
 * Allows users to upload TIFF images, draw bounding boxes, and extract particles
 */
function PreprocessingSection() {
	// Hook for API calls
	const {
		uploadImage,
		processBboxes,
		getStatus,
		downloadZip,
		clearError,
		clearStatus,
		isLoading,
		error,
		uploadProgress,
		processingStatus,
	} = useFetchPreprocessing();

	// Local state
	const [selectedFile, setSelectedFile] = useState(null);
	const [fileError, setFileError] = useState(null);
	const [isDragging, setIsDragging] = useState(false);
	const [sessionInfo, setSessionInfo] = useState(null);
	const [bboxes, setBboxes] = useState([]);
	const [isDrawing, setIsDrawing] = useState(false);
	const [currentBbox, setCurrentBbox] = useState(null);
	const [startPoint, setStartPoint] = useState(null);

	// Zoom and pan state
	const [zoomLevel, setZoomLevel] = useState(1.0);
	const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
	const [isPanning, setIsPanning] = useState(false);
	const [panStart, setPanStart] = useState(null);
	const [interactionMode, setInteractionMode] = useState('draw'); // 'draw' or 'pan'
	const [previousMode, setPreviousMode] = useState('draw');

	// Zoom constants
	const MIN_ZOOM = 0.5;
	const MAX_ZOOM = 5.0;
	const ZOOM_STEP = 0.2;

	// Refs
	const canvasRef = useRef(null);
	const imageRef = useRef(null);
	const pollingInterval = useRef(null);

	// Handle file change
	const handleFileChange = (event) => {
		const file = event.target.files[0];
		validateAndSetFile(file);
	};

	// Validate and set file
	const validateAndSetFile = (file) => {
		setFileError(null);

		if (file) {
			// Validate file type
			const validExtensions = ['.tif', '.tiff', '.png', '.jpg', '.jpeg'];
			const fileName = file.name.toLowerCase();
			const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

			if (!isValid) {
				setFileError('Please select a valid TIFF, PNG, or JPEG file');
				setSelectedFile(null);
				return;
			}

			// Note: Removed size limit to support large TIFF files (2.4 GB test file)
			// Backend will handle size validation

			setSelectedFile(file);
		}
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
		document.getElementById('preprocessing-file-upload').click();
	};

	// Upload image
	const handleUpload = async () => {
		if (!selectedFile) {
			setFileError('Please select a file');
			return;
		}

		try {
			const data = await uploadImage(selectedFile);
			setSessionInfo(data);
			setBboxes([]);
			
			// Wait a bit for the image to be available
			setTimeout(() => {
				loadDisplayImage(data.displayUrl);
			}, 500);
		} catch (err) {
			console.error('Upload error:', err);
		}
	};

	// Load display image on canvas
	const loadDisplayImage = (displayUrl) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		const img = new Image();
		img.crossOrigin = 'anonymous';
		
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			imageRef.current = img;
			// Reset zoom when loading new image
			setZoomLevel(1.0);
			setPanOffset({ x: 0, y: 0 });
		};

		img.onerror = () => {
			setFileError('Failed to load image');
		};

		// Construct full URL using backend proxy
		const proxy = constants.PROXY;
		img.src = `${proxy}${displayUrl}`;
	};

	// Apply zoom transformation to canvas
	const applyZoomTransform = (ctx) => {
		// Reset transformation
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		// Apply pan and zoom
		ctx.translate(panOffset.x, panOffset.y);
		ctx.scale(zoomLevel, zoomLevel);
	};

	// Convert canvas coordinates to display coordinates (accounting for zoom/pan)
	const canvasToDisplayCoords = (canvasX, canvasY) => {
		const displayX = (canvasX - panOffset.x) / zoomLevel;
		const displayY = (canvasY - panOffset.y) / zoomLevel;
		return { x: displayX, y: displayY };
	};

	// Zoom handlers
	const handleZoomIn = () => {
		setZoomLevel(prev => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
	};

	const handleZoomOut = () => {
		setZoomLevel(prev => Math.max(MIN_ZOOM, prev - ZOOM_STEP));
	};

	const handleZoomReset = () => {
		setZoomLevel(1.0);
		setPanOffset({ x: 0, y: 0 });
	};

	const handleZoomSliderChange = (event, newValue) => {
		setZoomLevel(newValue);
	};

	// Wheel zoom - centered on mouse position
	const handleWheel = (e) => {
		e.preventDefault();
		
		if (!canvasRef.current) return;
		
		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();
		
		// Mouse position in canvas (display coordinates)
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		
		// Position in image space (before zoom)
		const imageX = (mouseX - panOffset.x) / zoomLevel;
		const imageY = (mouseY - panOffset.y) / zoomLevel;
		
		// Calculate new zoom level
		const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
		const newZoomLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel + delta));
		
		// Recalculate panOffset to keep the point under the mouse fixed
		const newPanX = mouseX - imageX * newZoomLevel;
		const newPanY = mouseY - imageY * newZoomLevel;
		
		// Apply new states
		setZoomLevel(newZoomLevel);
		setPanOffset({ x: newPanX, y: newPanY });
	};

	// Panning handlers
	const handlePanStart = (e) => {
		// Pan in pan mode or with middle button
		if (interactionMode === 'pan' || e.button === 1) {
			e.preventDefault();
			setIsPanning(true);
			setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
		}
	};

	const handlePanMove = (e) => {
		if (isPanning && panStart) {
			setPanOffset({
				x: e.clientX - panStart.x,
				y: e.clientY - panStart.y
			});
		}
	};

	const handlePanEnd = () => {
		setIsPanning(false);
		setPanStart(null);
	};

	// Canvas mouse handlers
	const handleMouseDown = (e) => {
		if (!sessionInfo) return;

		// Check for panning (middle button or pan mode)
		if (e.button === 1 || (e.button === 0 && interactionMode === 'pan')) {
			handlePanStart(e);
			return;
		}

		// Draw mode only
		if (interactionMode !== 'draw' || e.button !== 0) return;

		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;
		const canvasX = (e.clientX - rect.left) * scaleX;
		const canvasY = (e.clientY - rect.top) * scaleY;

		// Convert to display coordinates
		const displayCoords = canvasToDisplayCoords(canvasX, canvasY);

		setIsDrawing(true);
		setStartPoint(displayCoords);
		setCurrentBbox({ x: displayCoords.x, y: displayCoords.y, width: 0, height: 0 });
	};

	const handleMouseMove = (e) => {
		// Handle panning
		if (isPanning) {
			handlePanMove(e);
			redrawCanvas();
			return;
		}

		// Handle bbox drawing
		if (!isDrawing || !startPoint) return;

		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;
		const canvasX = (e.clientX - rect.left) * scaleX;
		const canvasY = (e.clientY - rect.top) * scaleY;

		// Convert to display coordinates
		const currentDisplayCoords = canvasToDisplayCoords(canvasX, canvasY);

		const width = currentDisplayCoords.x - startPoint.x;
		const height = currentDisplayCoords.y - startPoint.y;

		setCurrentBbox({
			x: startPoint.x,
			y: startPoint.y,
			width,
			height,
		});

		// Redraw canvas
		redrawCanvas();
	};

	const handleMouseUp = () => {
		// Handle pan end
		if (isPanning) {
			handlePanEnd();
			return;
		}

		// Handle bbox end
		if (isDrawing && currentBbox && Math.abs(currentBbox.width) > 10 && Math.abs(currentBbox.height) > 10) {
			// Normalize bbox (handle negative width/height)
			const normalizedBbox = {
				id: `bbox_${Date.now()}`,
				x: currentBbox.width < 0 ? currentBbox.x + currentBbox.width : currentBbox.x,
				y: currentBbox.height < 0 ? currentBbox.y + currentBbox.height : currentBbox.y,
				width: Math.abs(currentBbox.width),
				height: Math.abs(currentBbox.height),
			};

			setBboxes([...bboxes, normalizedBbox]);
		}

		setIsDrawing(false);
		setStartPoint(null);
		setCurrentBbox(null);
	};

	// Redraw canvas with all bboxes (with zoom applied)
	const redrawCanvas = () => {
		const canvas = canvasRef.current;
		if (!canvas || !imageRef.current) return;

		const ctx = canvas.getContext('2d');
		
		// Apply zoom transformation
		applyZoomTransform(ctx);
		
		// Clear and redraw
		ctx.clearRect(-panOffset.x / zoomLevel, -panOffset.y / zoomLevel, 
			canvas.width / zoomLevel, canvas.height / zoomLevel);
		ctx.drawImage(imageRef.current, 0, 0);

		// Draw all saved bboxes (in display coordinates)
		bboxes.forEach((bbox, index) => {
			ctx.strokeStyle = '#388e3c';
			ctx.lineWidth = 2 / zoomLevel;
			ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);
			
			// Draw label
			ctx.fillStyle = '#388e3c';
			ctx.fillRect(bbox.x, bbox.y - 20 / zoomLevel, 60 / zoomLevel, 20 / zoomLevel);
			ctx.fillStyle = '#fff';
			ctx.font = `${12 / zoomLevel}px Arial`;
			ctx.fillText(`#${index + 1}`, bbox.x + 5 / zoomLevel, bbox.y - 6 / zoomLevel);
		});

		// Draw current bbox being drawn (in display coordinates)
		if (currentBbox && isDrawing) {
			ctx.strokeStyle = '#ff9800';
			ctx.lineWidth = 2 / zoomLevel;
			ctx.setLineDash([5 / zoomLevel, 5 / zoomLevel]);
			ctx.strokeRect(currentBbox.x, currentBbox.y, currentBbox.width, currentBbox.height);
			ctx.setLineDash([]);
		}
	};

	// Effect to redraw when bboxes, zoom, or pan change
	useEffect(() => {
		redrawCanvas();
	}, [bboxes, currentBbox, isDrawing, zoomLevel, panOffset]);

	// Delete bbox
	const handleDeleteBbox = (index) => {
		const newBboxes = bboxes.filter((_, i) => i !== index);
		setBboxes(newBboxes);
	};

	// Clear all bboxes
	const handleClearAll = () => {
		setBboxes([]);
	};

	// Process bboxes
	const handleProcess = async () => {
		if (!sessionInfo || bboxes.length === 0) {
			setFileError('Please draw at least one bounding box');
			return;
		}

		try {
			await processBboxes(sessionInfo.sessionId, bboxes, 10);
			
			// Start polling for status
			startPolling();
		} catch (err) {
			console.error('Processing error:', err);
		}
	};

	// Polling for status
	const startPolling = () => {
		if (pollingInterval.current) {
			clearInterval(pollingInterval.current);
		}

		pollingInterval.current = setInterval(async () => {
			try {
				const status = await getStatus(sessionInfo.sessionId);
				
				if (status.status === 'completed' || status.status === 'error') {
					clearInterval(pollingInterval.current);
					pollingInterval.current = null;
				}
			} catch (err) {
				console.error('Polling error:', err);
				clearInterval(pollingInterval.current);
				pollingInterval.current = null;
			}
		}, 2000); // Poll every 2 seconds
	};

	// Cleanup polling on unmount
	useEffect(() => {
		return () => {
			if (pollingInterval.current) {
				clearInterval(pollingInterval.current);
			}
		};
	}, []);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e) => {
			// Ignore if user is typing in an input field
			if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

			switch(e.key) {
				case ' ': // Space - temporary pan mode
					if (!e.repeat && sessionInfo) {
						setPreviousMode(interactionMode);
						setInteractionMode('pan');
						e.preventDefault();
					}
					break;
				case 'd':
				case 'D':
					if (sessionInfo) {
						setInteractionMode('draw');
						e.preventDefault();
					}
					break;
				case 'h':
				case 'H':
					if (sessionInfo) {
						setInteractionMode('pan');
						e.preventDefault();
					}
					break;
				case '+':
				case '=':
					if (sessionInfo) {
						handleZoomIn();
						e.preventDefault();
					}
					break;
				case '-':
				case '_':
					if (sessionInfo) {
						handleZoomOut();
						e.preventDefault();
					}
					break;
				case '0':
					if (sessionInfo) {
						handleZoomReset();
						e.preventDefault();
					}
					break;
			}
		};

		const handleKeyUp = (e) => {
			if (e.key === ' ') {
				setInteractionMode(previousMode);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [interactionMode, previousMode, sessionInfo, handleZoomIn, handleZoomOut, handleZoomReset]);

	// Download ZIP
	const handleDownload = async () => {
		if (!sessionInfo) return;

		try {
			await downloadZip(sessionInfo.sessionId);
		} catch (err) {
			console.error('Download error:', err);
		}
	};

	// Reset all
	const handleReset = () => {
		setSelectedFile(null);
		setFileError(null);
		setSessionInfo(null);
		setBboxes([]);
		clearError();
		clearStatus();
		
		if (pollingInterval.current) {
			clearInterval(pollingInterval.current);
			pollingInterval.current = null;
		}
	};

	const formatFileSize = (bytes) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
	};

	return (
		<Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
			<Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
				<CropIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
				Processing Tool
			</Typography>

			<Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
				Upload a TIFF image containing multiple particles, draw bounding boxes around each particle,
				and extract them automatically with background removal.
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

			{/* Step 1: Upload */}
			{!sessionInfo && (
				<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
					<Typography variant="h6" gutterBottom>
						Step 1: Upload Image
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
							TIFF, PNG, or JPEG image
						</Typography>
						<Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
							Note: Large files (up to 2.5 GB) supported
						</Typography>

						<input
							type="file"
							onChange={handleFileChange}
							accept=".tif,.tiff,.png,.jpg,.jpeg,image/tiff,image/png,image/jpeg"
							style={{ display: 'none' }}
							id="preprocessing-file-upload"
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
							onClick={handleUpload}
							disabled={isLoading}
							sx={{ mt: 2, backgroundColor: '#388e3c' }}
						>
							{isLoading ? <CircularProgress size={24} /> : 'Upload Image'}
						</Button>
					)}

					{uploadProgress > 0 && uploadProgress < 100 && (
						<Box sx={{ mt: 2 }}>
							<LinearProgress variant="determinate" value={uploadProgress} />
							<Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
								Uploading: {uploadProgress}%
							</Typography>
						</Box>
					)}

					{error && (
						<Alert severity="error" sx={{ mt: 2 }}>
							{error}
						</Alert>
					)}
				</Paper>
			)}

			{/* Step 2: Draw Bounding Boxes */}
			{sessionInfo && !processingStatus?.status && (
				<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
					<Typography variant="h6" gutterBottom>
						Step 2: Select Particles
					</Typography>

					<Alert severity="info" sx={{ mb: 2 }}>
						Click and drag to draw bounding boxes. Use Shift+drag to pan, or scroll to zoom.
						{bboxes.length > 0 && ` (${bboxes.length} particle${bboxes.length > 1 ? 's' : ''} selected)`}
					</Alert>

				{/* Interaction Mode Selector */}
				<Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
					<Typography variant="subtitle2" gutterBottom>
						Interaction Mode
					</Typography>
					<ToggleButtonGroup
						value={interactionMode}
						exclusive
						onChange={(e, mode) => mode && setInteractionMode(mode)}
						size="small"
						sx={{ mb: 1 }}
					>
						<ToggleButton value="draw">
							<DrawIcon sx={{ mr: 1 }} fontSize="small" />
							Draw BBox
						</ToggleButton>
						<ToggleButton value="pan">
							<PanToolIcon sx={{ mr: 1 }} fontSize="small" />
							Pan
						</ToggleButton>
					</ToggleButtonGroup>
					<Alert severity="info" icon={false} sx={{ mt: 1, py: 0.5 }}>
						<Typography variant="caption" display="block">
							<strong>Keyboard shortcuts:</strong>
						</Typography>
						<Typography variant="caption" display="block">
							• <kbd style={{padding: '2px 4px', backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '3px'}}>Space</kbd> (hold): Temporary Pan mode
						</Typography>
						<Typography variant="caption" display="block">
							• <kbd style={{padding: '2px 4px', backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '3px'}}>D</kbd>: Draw mode | <kbd style={{padding: '2px 4px', backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '3px'}}>H</kbd>: Pan mode
						</Typography>
						<Typography variant="caption" display="block">
							• <kbd style={{padding: '2px 4px', backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '3px'}}>+</kbd> / <kbd style={{padding: '2px 4px', backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '3px'}}>-</kbd>: Zoom In/Out | <kbd style={{padding: '2px 4px', backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '3px'}}>0</kbd>: Reset
						</Typography>
						<Typography variant="caption" display="block">
							• Mouse wheel: Zoom to cursor
						</Typography>
					</Alert>
				</Paper>

				{/* Zoom Controls */}
				<Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
					<Typography variant="subtitle2" gutterBottom>
						Zoom Controls
					</Typography>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
						<Tooltip title="Zoom Out">
							<IconButton onClick={handleZoomOut} size="small" disabled={zoomLevel <= MIN_ZOOM}>
								<ZoomOutIcon />
							</IconButton>
						</Tooltip>
						
						<Box sx={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: 1 }}>
							<Typography variant="caption" sx={{ minWidth: '40px' }}>
								{(zoomLevel * 100).toFixed(0)}%
							</Typography>
							<Slider
								value={zoomLevel}
								onChange={handleZoomSliderChange}
								min={MIN_ZOOM}
								max={MAX_ZOOM}
								step={0.1}
								marks={[
									{ value: 0.5, label: '50%' },
									{ value: 1.0, label: '100%' },
									{ value: 2.0, label: '200%' },
									{ value: 5.0, label: '500%' }
								]}
								sx={{ flex: 1 }}
							/>
						</Box>
						
						<Tooltip title="Zoom In">
							<IconButton onClick={handleZoomIn} size="small" disabled={zoomLevel >= MAX_ZOOM}>
								<ZoomInIcon />
							</IconButton>
						</Tooltip>
						
						<Tooltip title="Reset Zoom & Pan">
							<IconButton onClick={handleZoomReset} size="small">
								<RestartAltIcon />
							</IconButton>
						</Tooltip>
					</Box>
				</Paper>

				<Box sx={{ 
					mb: 2, 
					overflow: 'auto', 
					maxHeight: '70vh',
					border: '1px solid #ccc', 
					borderRadius: '4px' 
				}}>
					<canvas
						ref={canvasRef}
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						onMouseLeave={handleMouseUp}
						onWheel={handleWheel}
						style={{ 
							display: 'block', 
							cursor: interactionMode === 'draw' ? 'crosshair' : (isPanning ? 'grabbing' : 'grab')
						}}
					/>
				</Box>

				{bboxes.length > 0 && (
					<Box sx={{ mb: 2 }}>
						<Typography variant="subtitle2" gutterBottom>
							Selected Particles ({bboxes.length}):
						</Typography>
						<List dense>
							{bboxes.map((bbox, index) => (
								<ListItem
									key={bbox.id}
									secondaryAction={
										<IconButton edge="end" onClick={() => handleDeleteBbox(index)}>
											<DeleteIcon />
										</IconButton>
									}
								>
									<ListItemText
										primary={`Particle #${index + 1}`}
										secondary={`Position: (${Math.round(bbox.x)}, ${Math.round(bbox.y)}), Size: ${Math.round(bbox.width)}×${Math.round(bbox.height)}px`}
									/>
								</ListItem>
							))}
						</List>
					</Box>
				)}

					<Box sx={{ display: 'flex', gap: 2 }}>
						<Button variant="outlined" onClick={handleClearAll} disabled={bboxes.length === 0}>
							Clear All
						</Button>
						<Button
							variant="contained"
							onClick={handleProcess}
							disabled={bboxes.length === 0 || isLoading}
							sx={{ backgroundColor: '#388e3c' }}
						>
							Process Particles
						</Button>
						<Button variant="outlined" color="error" onClick={handleReset}>
							Start Over
						</Button>
					</Box>
				</Paper>
			)}

			{/* Step 3: Processing Status */}
			{processingStatus && (
				<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
					<Typography variant="h6" gutterBottom>
						Step 3: Processing
					</Typography>

					{processingStatus.status === 'processing' && (
						<Box>
							<Typography variant="body2" sx={{ mb: 2 }}>
								Extracting particles and removing backgrounds...
							</Typography>
							<LinearProgress variant="determinate" value={processingStatus.progress || 0} />
							<Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
								{processingStatus.processedCount || 0} / {processingStatus.totalCount || 0} particles processed
								({processingStatus.progress || 0}%)
							</Typography>
						</Box>
					)}

					{processingStatus.status === 'completed' && (
						<Box>
							<Alert severity="success" sx={{ mb: 2 }}>
								Processing complete! {processingStatus.processedCount} particles extracted.
							</Alert>
							<Button
								variant="contained"
								startIcon={<DownloadIcon />}
								onClick={handleDownload}
								disabled={isLoading}
								sx={{ backgroundColor: '#388e3c', mr: 2 }}
							>
								Download ZIP
							</Button>
							<Button variant="outlined" onClick={handleReset}>
								Process Another Image
							</Button>
						</Box>
					)}

					{processingStatus.status === 'error' && (
						<Box>
							<Alert severity="error" sx={{ mb: 2 }}>
								Processing failed: {processingStatus.error || 'Unknown error'}
							</Alert>
							<Button variant="outlined" onClick={handleReset}>
								Try Again
							</Button>
						</Box>
					)}
				</Paper>
			)}
		</Box>
	);
}

export default PreprocessingSection;
