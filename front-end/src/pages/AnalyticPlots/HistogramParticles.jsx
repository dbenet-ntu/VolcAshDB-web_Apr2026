import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import RiseLoader from "react-spinners/RiseLoader";
import { useLoading } from '../../hooks/useLoading';
import * as constants from "../../Constants";
import InfoIcon from '@mui/icons-material/Info'; 
import { Tooltip } from '@mui/material';

/**
 * HistogramParticles Component: Renders a histogram of particle features with dynamic selection.
 * 
 * @param {object} props - The component props.
 * @param {Array} props.data - The data to be plotted in the histogram.
 * @param {string} props.visibilityMode - Mode for determining visibility colors.
 * @param {function} props.onOpen - Function to handle opening of additional information.
 */
const HistogramParticles = (props) => {
    const { data, visibilityMode, onOpen } = props;
    const [plotData, setPlotData] = useState([]); // State for storing processed plot data
    const [selectedFeature, setSelectedFeature] = useState("convexity"); // State for selected feature to display
    const { load, loading } = useLoading(); // Custom hook for handling loading state

    /**
     * Effect hook for loading data when component mounts or data changes.
     */
    useEffect(() => {
        load([data]);
    }, [load, data]);

    /**
     * Effect hook for processing data and updating plotData when data or selectedFeature changes.
     */
    useEffect(() => {
        if (selectedFeature !== "" && !loading) { // Proceed only if a feature is selected and not loading
            const feature = data.map(d => d[selectedFeature]);
            const mainTypes = Object.keys(data[0]?.main_type || {}); // Get unique main types

            // Handle missing or non-numeric values in the feature array
            for (let i = 0; i < feature.length; i++) {
                if (isNaN(feature[i]) || feature[i] === null || feature[i] === undefined) {
                    feature[i] = 0;
                }
            }

            // Prepare histogram data for each main type
            const histogramData = mainTypes.map(mainType => {
                const mainTypeFeatureValues = data.filter(d => d.main_type[mainType]).map(d => d[selectedFeature]);
                return {
                    x: mainTypeFeatureValues,
                    type: 'histogram',
                    mode: 'overlay',
                    name: mainType,
                    opacity: 0.5,
                    marker: { 
                        color: constants.visibilityColors[visibilityMode][mainType] // Set color based on visibility mode
                    },
                    line: {
                        shape: 'spline', // Smooth line shape
                    },
                };
            });
            setPlotData(histogramData);
        }		
    }, [data, selectedFeature, loading, visibilityMode]);

    /**
     * Handles the change in selected feature from the dropdown.
     * 
     * @param {object} event - The change event from the dropdown.
     */
    const handleActivityTypeChange = (event) => {
        setSelectedFeature(event.target.value);
    };

    if (loading) {
        return (
            <div>
                <RiseLoader
                    cssOverride={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "450px",
                    }}
                    size={10}
                    color={"#123abc"}
                    loading={loading}
                />
            </div>
        ); // Render loading indicator while data is being fetched
    }

    return (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', wrap: 'wrap' }}>
            {/* Plotly histogram chart */}
            <Plot
                data={plotData}
                layout={{
                    title: { text: `Global distribution of ${selectedFeature}` },
                    barmode: 'overlay', // Overlay mode for histograms
                    xaxis: {
                        title: {
                            text: selectedFeature, // X-axis label
                            font: {
                                family: 'Courier New, monospace',
                                size: 18,
                                color: '#7f7f7f'
                            }
                        },
                    },
                    yaxis: {
                        title: {
                            text: 'count', // Y-axis label
                            font: {
                                family: 'Courier New, monospace',
                                size: 18,
                                color: '#7f7f7f'
                            }
                        }
                    },
                    width: 350, // Width of the plot
                    height: 350, // Height of the plot
                    paper_bgcolor: '#e9e9e9f7', // Background color of the plot paper
                    plot_bgcolor: '#e9e9e9f7', // Background color of the plot area
                }}
            />

            {/* Tooltip icon for additional information */}
            <Tooltip title='Definitions'>
                <InfoIcon 
                    style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }} // Positioned at top-right
                    onClick={onOpen} 
                />
            </Tooltip>

            {/* Dropdown menu for selecting feature to display in histogram */}
            <select style={{ textAlign: 'left', width: '50%', margin: 'auto' }} value={selectedFeature} onChange={handleActivityTypeChange}>
                {/* Shape Features Group */}
                <optgroup label="Shape Features">
                    <option value="aspect_rat">Aspect Ratio</option>
                    <option value="circularity_cioni">Circularity (Cioni)</option>
                    <option value="circularity_dellino">Circularity (Dellino)</option>
                    <option value="compactness">Compactness</option>
                    <option value="convexity">Convexity</option>
                    <option value="elongation">Elongation</option>
                    <option value="rectangularity">Rectangularity</option>
                    <option value="roundness">Roundness</option>
                    <option value="solidity">Solidity</option>
                </optgroup>

                {/* Textural Features Group */}
                <optgroup label="Textural Features">
                    <option value="asm">ASM</option>
                    <option value="contrast">Contrast</option>
                    <option value="correlation">Correlation</option>
                    <option value="dissimilarity">Dissimilarity</option>
                    <option value="energy">Energy</option>
                    <option value="homogeneity">Homogeneity</option>
                </optgroup>

                {/* Color Features Group */}
                <optgroup label="Color Features">
                    <option value="blue_mean">Blue Mean</option>
                    <option value="blue_std">Blue Std</option>
                    <option value="blue_mode">Blue Mode</option>
                    <option value="green_mean">Green Mean</option>
                    <option value="green_std">Green Std</option>
                    <option value="green_mode">Green Mode</option>
                    <option value="red_mean">Red Mean</option>
                    <option value="red_std">Red Std</option>
                    <option value="red_mode">Red Mode</option>
                    <option value="hue_mean">Hue Mean</option>
                    <option value="hue_std">Hue Std</option>
                    <option value="hue_mode">Hue Mode</option>
                    <option value="saturation_mean">Saturation Mean</option>
                    <option value="saturation_std">Saturation Std</option>
                    <option value="saturation_mode">Saturation Mode</option>
                    <option value="value_mean">Value Mean</option>
                    <option value="value_std">Value Std</option>
                    <option value="value_mode">Value Mode</option>
                </optgroup>
            </select>
        </div>
    );
}

export default HistogramParticles;