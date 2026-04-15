import { useState } from 'react';
import axios from 'axios';
import * as constants from '../Constants';
import { useAuthContext } from './useAuthContext';

/**
 * Custom hook for OOD analysis workflow
 * 
 * @returns {Object} Functions and states for OOD analysis
 */
export const useFetchOOD = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [results, setResults] = useState(null);
	
	const { user } = useAuthContext();
	const proxy = constants.PROXY;

	/**
	 * Analyze OOD for uploaded ZIP file
	 * @param {File} zipFile - ZIP file containing particle images
	 */
	const analyzeOOD = async (zipFile) => {
		setIsLoading(true);
		setError(null);
		setResults(null);

		try {
			if (!user) {
				setError('Please login or create an account.');
				return;
			}

			if (!zipFile) {
				setError('Please select a file.');
				return;
			}

			const formData = new FormData();
			formData.append('file', zipFile);
			formData.append('email', user.email);

			const response = await axios.post(
				`${proxy}/ood/analyze`,
				formData,
				{
					headers: {
						'Authorization': `Bearer ${user.token}`,
						'Content-Type': 'multipart/form-data',
					},
					timeout: 300000, // 5 minutes
				}
			);

			if (response.status === 200) {
				setResults(response.data);
			} else {
				setError('Failed to analyze OOD');
			}

		} catch (err) {
			const errorMessage = err.response?.data?.error || err.message || 'Analysis failed';
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const clearError = () => {
		setError(null);
	};

	const clearResults = () => {
		setResults(null);
	};

	/**
	 * Download OOD analysis results as ZIP
	 * @param {string} sessionId - Session ID from analysis results
	 */
	const downloadZip = async (sessionId) => {
		try {
			if (!user) {
				setError('Please login or create an account.');
				return;
			}

			if (!sessionId) {
				setError('No session ID available.');
				return;
			}

			const response = await axios.get(
				`${proxy}/ood/download/${sessionId}`,
				{
					headers: {
						'Authorization': `Bearer ${user.token}`,
					},
					responseType: 'blob', // Important for downloading files
				}
			);

			// Create a download link
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			// Generate timestamp for filename
			const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
			link.setAttribute('download', `preclassification-check-${timestamp}.zip`);
			document.body.appendChild(link);
			link.click();
			link.parentNode.removeChild(link);
			window.URL.revokeObjectURL(url);

		} catch (err) {
			const errorMessage = err.response?.data?.error || err.message || 'Download failed';
			setError(errorMessage);
		}
	};

	return { analyzeOOD, downloadZip, isLoading, error, results, clearError, clearResults };
};
