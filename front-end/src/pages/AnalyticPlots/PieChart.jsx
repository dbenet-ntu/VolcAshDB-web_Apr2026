import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import RiseLoader from "react-spinners/RiseLoader";
import { useLoading } from '../../hooks/useLoading';
import * as constants from "../../Constants";

const dict_title = {
    main_type: {
        title: 'Percentage of particles by type'
    },
    volc_name: {
        title: 'Percentage of particles by volcano'
    },
    eruptive_style: {
        title: 'Percentage of particles by eruptive style'
    }
};

/**
 * PieChart Component: Renders a pie chart to visualize the distribution of particles based on selected category.
 * 
 * @param {object} props - The component props.
 * @param {Array} props.data - The dataset used for pie chart aggregation.
 * @param {function} props.title - Function to determine which category to visualize.
 * @param {string} props.visibilityMode - Mode used for determining segment colors in the pie chart.
 */
const PieChart = (props) => {
    const { data, title } = props;
    const { load, loading } = useLoading();
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);
    const [colors, setColors] = useState([]);

    /**
     * Effect hook for loading data when component mounts or data changes.
     */
    useEffect(() => {
        load([data]);
    }, [load, data]);

    /**
     * Effect hook for aggregating data and updating chart state when loading completes.
     */
    useEffect(() => {
        if (!loading) {
            // Function to aggregate data based on the selected title
            const aggregateData = (data, title) => {
                if (title === 'main_type') {
                    return data.reduce((acc, curr) => {
                        for (const [key, value] of Object.entries(curr[title])) {
                            acc[key] = (acc[key] || 0) + value / 100;
                        }
                        return acc;
                    }, {});
                } else {
                    return data.reduce((acc, curr) => {
                        acc[curr[title]] = (acc[curr[title]] || 0) + 1;
                        return acc;
                    }, {});
                }
            };

            const dict = aggregateData(data, title);
            
            // Extract labels and values from the aggregated data
            const labels = Object.keys(dict);
            const values = Object.values(dict);
            
            setLabels(labels);
            setValues(values);
            setColors(labels.map(label => constants.visibilityColors[props.visibilityMode][label]));
        }
    }, [loading, data, title, props]);

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
            data={[{
                labels: labels,
                values: values,
                type: 'pie',
                marker: {
                    colors: colors
                }
            }]}
            layout={{
                title: { text: dict_title[title].title },
                legend: {
                    font: {
                        size: 10
                    },
                    orientation: 'v'
                },
                width: 350,
                height: 350,
                paper_bgcolor: '#e9e9e9f7',
                plot_bgcolor: '#e9e9e9f7',
            }}
        />
    );
}

export default PieChart;