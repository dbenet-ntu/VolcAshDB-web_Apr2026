import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import RiseLoader from 'react-spinners/RiseLoader';
import { useLoading } from '../../hooks/useLoading';
import * as constants from '../../Constants';

/**
 * TimelinePlot Component: Renders a time series plot to visualize data over time.
 * 
 * @param {object} props - The component props.
 * @param {Array} props.data - The dataset used for plotting, should include date and count fields.
 * @param {string} props.title - The title of the plot.
 * @param {string} props.visibilityMode - Mode used for determining plot colors.
 */
const TimelinePlot = (props) => {
    const { data, title, visibilityMode } = props;
    
    // Sort data by date
    data.sort((a, b) => new Date(a._id) - new Date(b._id));

    const { load, loading } = useLoading();
    const [plotData, setPlotData] = useState([]);

    // Effect hook for loading data
    useEffect(() => {
        load([data]);
    }, [load, data]);

    // Effect hook for processing data and updating plotData when loading completes
    useEffect(() => {
        if (!loading) {
            // Extract x and y data for the plot
            const xData = data.map(item => item._id); // Dates
            const yData = data.map(item => item.count); // Counts
            const titleData = data.map(() => title); // Title for hover text

            // Update the plotData state
            setPlotData([{ 
                x: xData, 
                y: yData,
                name: '',
                text: titleData,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { 
                    color: constants.visibilityColors[visibilityMode]['stats']
                },
                hovertemplate:
					"<b>%{text}</b><br><br>" +
					"Date: %{x}<br>"+ 
                    "Number: %{y}<br>"
            }]);
        }
    }, [loading, data, visibilityMode, title]);

    if (loading) {
        return (
            <div>
                <RiseLoader
                    cssOverride={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '450px',
                    }}
                    size={10}
                    color={'#123abc'}
                    loading={loading}
                />
            </div>
        ); // Render loading indicator while data is being fetched
    }

    return (
        <Plot 
            data={plotData}
            layout={{
                title,
                xaxis: {
                    tickfont: {
                        size: 14,
                        color: 'rgb(107, 107, 107)',
                    },
                },
                yaxis: {
                    tickfont: {
                        size: 14,
                        color: 'rgb(107, 107, 107)',
                    },
                },
                paper_bgcolor: '#e9e9e9f7',
                plot_bgcolor: '#e9e9e9f7',
                width: 350,
                height: 350,
            }}
        />
    );
};

export default TimelinePlot;
