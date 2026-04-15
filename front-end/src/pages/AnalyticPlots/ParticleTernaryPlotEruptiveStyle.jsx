import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import RiseLoader from "react-spinners/RiseLoader";
import { useLoading } from '../../hooks/useLoading';
import * as constants from "../../Constants";

/**
 * ParticleTernaryPlotEruptiveStyle Component: Renders a ternary plot of particle types by eruptive style.
 * 
 * @param {object} props - The component props.
 * @param {Array} props.data - The dataset used for plotting the ternary plot.
 * @param {string} props.visibilityMode - Mode used for determining marker colors in the plot.
 */
const ParticleTernaryPlotEruptiveStyle = (props) => {
    const { data, visibilityMode } = props;
    const [plotData, setPlotData] = useState([]); // State for storing ternary plot data
    const { load, loading } = useLoading(); // Custom hook for handling loading state

    /**
     * Effect hook for loading data when component mounts or data changes.
     */
    useEffect(() => {
        load([data]);
    }, [load, data]);

    /**
     * Effect hook for processing data and updating plotData when data or loading state changes.
     */
    useEffect(() => {
        if (!loading) {
            const counts = {}; // Object to hold counts for each eruptive_style
            const totals = {}; // Object to hold total counts for each eruptive_style

            // Aggregate counts and store additional information
            data.forEach(particle => {
                const { eruptive_style, main_type } = particle;

                // Aggregate counts for main_type categories
                Object.entries(main_type).forEach(([type, value]) => {
                    if (!counts[eruptive_style]) {
                        counts[eruptive_style] = { total: 0 };
                    }
                    counts[eruptive_style][type] = (counts[eruptive_style][type] || 0) + value;
                    counts[eruptive_style].total += value;
                });

                totals[eruptive_style] = (totals[eruptive_style] || 0) + 1;
            });

            // Convert counts to percentages and construct plotData
            const plotData = Object.keys(counts).map((eruptive_style) => {
                const types = counts[eruptive_style];
                return {
                    type: 'scatterternary',
                    mode: 'markers',
                    a: [types['juvenile'] / types.total * 100 || 0], // Percentage for 'juvenile'
                    b: [types['lithic'] / types.total * 100 || 0], // Percentage for 'lithic'
                    c: [types['altered material'] / types.total * 100 || 0], // Percentage for 'altered material'
                    text: [eruptive_style], // Hover text showing the eruptive style
                    subplot: 'ternary',
                    marker: { 
                        size: 12,
                        color: constants.visibilityColors[visibilityMode][eruptive_style] // Color based on visibility mode
                    },
                    name: '',
                    hovertemplate:
                        "<b>%{text}</b><br><br>" +
                        "Juvenile: %{a:.2f}%<br>" +
                        "Lithic: %{b:.2f}%<br>" +
                        "Altered material: %{c:.2f}%<br>"
                };
            });

            setPlotData(plotData); // Update plot data state
        }
    }, [data, loading, visibilityMode]);

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
        <Plot
            data={plotData}
            layout={{
                title: { text: 'Ratio of particle types by eruptive style' },
                ternary: {
                    sum: 100, // Total sum of a, b, c should be 100%
                    aaxis: { hoverformat: '.2f', ticksuffix: '%', title: { text: 'Juvenile' }, min: 0 }, // Axis settings for Juvenile
                    baxis: { hoverformat: '.2f', ticksuffix: '%', title: { text: 'Lithic' }, min: 0 }, // Axis settings for Lithic
                    caxis: { hoverformat: '.2f', ticksuffix: '%', title: { text: 'Altered material'}, min: 0 } // Axis settings for Altered material
                },
                showlegend: false, // Disable legend
                width: 350, // Width of the plot
                height: 350, // Height of the plot
                paper_bgcolor: '#e9e9e9f7', // Background color of the plot paper
                plot_bgcolor: '#e9e9e9f7', // Background color of the plot area
            }}
        />
    );
};

export default ParticleTernaryPlotEruptiveStyle;
