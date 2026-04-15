import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import RiseLoader from "react-spinners/RiseLoader";
import { useLoading } from '../../hooks/useLoading';
import * as constants from "../../Constants";

/**
 * AnnotationDistribution Component: Displays a bar chart of annotation distribution.
 * 
 * @param {object} props - Component properties.
 * @param {string} props.visibilityMode - Current visibility mode for color mapping.
 * @param {object} props.data - Data for plotting.
 * @param {number} props.size - Size of the plot.
 * @param {string} props.bgcolor - Background color for the plot.
 * 
 * @returns {JSX.Element} - The rendered component.
 */
const AnnotationDistribution = (props) => {
    // Destructure props
    const { visibilityMode, data, size, bgcolor } = props;

    // Custom hook to manage loading state
    const { load, loading } = useLoading();

    // Local state for labels, values, and colors
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);
    const [colour, setColour] = useState([]);

    // Effect to trigger loading of data
    useEffect(() => {
        load([data]);
    }, [load, data]);

    // Effect to process data and update state once loading is complete
    useEffect(() => {
        if (!loading) {
            // Extract labels and values from data
            const labels = Object.keys(data.main_type);
            const values = Object.values(data.main_type);

            // Update state with labels, values, and colors
            setLabels(labels);
            setValues(values);
            setColour(labels.map(label => constants.visibilityColors[visibilityMode][label]));
        }
    }, [data, loading, visibilityMode]);

    // Render loader while data is loading
    if (loading) {
        return (
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
        );
    }

    // Render Plotly chart when data is loaded
    return (
        <Plot
            data={[{
                x: labels, // X-axis labels
                y: values, // Y-axis values
                type: 'bar', // Chart type
                marker: {
                    color: colour // Bar colors
                },
                name: '', // Series name
                hovertemplate:
                    "<b>%{x}</b><br><br>" +
                    "Number: %{y}<br>" // Hover template
            }]}
            layout={{
                autosize: false,
                showlegend: false,
                width: size, // Plot width
                height: size, // Plot height
                paper_bgcolor: bgcolor, // Plot background color
                plot_bgcolor: bgcolor, // Plot area background color
                margin: {
                    l: 40, // Left margin
                    r: 40, // Right margin
                    b: 100, // Bottom margin
                    t: 0, // Top margin
                    pad: 4 // Padding
                }
            }}
            config={{
                displayModeBar: false // Disable mode bar
            }}
        />
    );
};

export default AnnotationDistribution;
