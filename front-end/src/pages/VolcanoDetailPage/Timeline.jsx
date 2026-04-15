import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import RiseLoader from "react-spinners/RiseLoader";
import { useMediaQuery } from 'react-responsive';
import { useLoading } from '../../hooks/useLoading';
import * as constants from "../../Constants";

/**
 * TimeLine: A component for displaying eruption and sample data over time using Plotly.
 * 
 * @param {object} props - Properties passed to the component.
 * @param {function} props.onPassVolcName - Function to get the volcano name.
 * @param {function} props.onEruptions - Function to get eruption data.
 * @param {function} props.onSamples - Function to get samples data.
 * @param {function} props.onAfes - Function to get AFE (Ash Forming Events) data.
 * @param {object} props.visibilityMode - Object controlling visibility settings.
 * @param {function} props.handleSearch - Function to handle search actions.
 * @param {array} props.selectedTags - Array of selected tags.
 * @param {object} props.tagsRef - Ref to tag selection component.
 */
const TimeLine = (props) => {
    const vol = props.onPassVolcName(); // Get the volcano name from props
    const eruptions = props.onEruptions(); // Get eruption data from props
    const samples = props.onSamples();
    const afes = props.onAfes(); // Get AFE data from props
    const [plotData, setPlotData] = useState([]); // State for Plotly data
    const [selectedData, setSelectedData] = useState('new'); // Toggle between 'new' and 'old' data views
    const { load, loading } = useLoading(); // Custom hook for loading state management

    // Media queries for responsive design
    const isXLScreen = useMediaQuery({ query: '(min-width: 1920px)' });
    const isLargeScreen = useMediaQuery({ query: '(max-width: 1919.95px)' });
    const isMediumScreen = useMediaQuery({ query: '(max-width: 1279.95px)' });
    const isSmallScreen = useMediaQuery({ query: '(max-width: 959.95px)' });
    const isXSScreen = useMediaQuery({ query: '(max-width: 599.95px)' });

    const [width, setWidth] = useState(); // State for Plotly chart width
    const [flag, setFlag] = useState(false); // Flag to trigger search

    // Update chart width based on screen size
    useEffect(() => {
        if (isXSScreen) setWidth(400);
        else if (isSmallScreen || isMediumScreen) setWidth(550);
        else if (isLargeScreen || isXLScreen) setWidth(750);
    }, [isXSScreen, isSmallScreen, isMediumScreen, isLargeScreen, isXLScreen]);

    // Update plot data when component mounts or data changes
    useEffect(() => {
        load([eruptions, afes, samples]); // Load data using custom hook

        if (!loading) {

            // ---- Eruption ----

            const eruptionsPeriodGeologicalRecord = [];
            const check_eruption_geological_record = {};

            eruptions.forEach((eruption) => {
                const startEruption = eruption.ed_yearsBP;
                if (eruption.volc_num === vol && !check_eruption_geological_record[startEruption]) {
                    check_eruption_geological_record[startEruption] = true;
                    eruptionsPeriodGeologicalRecord.push(-startEruption);
                }
            });

            const eruptionsPeriodHistoricalRecord = eruptions
                .filter(
                    (eruption) =>
                        eruption.volc_num === vol &&
                        eruption.ed_stime &&
                        !eruption.ed_yearsBP
                )
                .flatMap((eruption) => {
                    let startEruption = new Date(eruption.ed_stime);
                    const endEruption = eruption.ed_etime ? new Date(eruption.ed_etime) : startEruption;
                    const dates = [];
                    if (startEruption !== endEruption) {
                        dates.push(startEruption.toISOString().substr(0, 7));
                        while (startEruption < endEruption) {
                            startEruption.setMonth(startEruption.getMonth() + 1);
                            dates.push(startEruption.toISOString().substr(0, 7));
                        }
                    }
                    return dates;
                });

            // ---- Sample ----

            const samples_description = [];

            const samplesPeriodHistoricalRecord = samples.filter((sample) => sample.item.volc_num === vol && sample.date && sample.item.sample_date !== null).flatMap((sample) => {
                
                const sampleCode = sample.item.sample_code;  
                const afeCode = sample.item.afe_code ? sample.item.afe_code : 'No AFE Code';

                const [year, month, day] = new Date(sample.item.sample_date).toISOString().substr(0, 10).split('-').map(Number);
                
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                const formattedDate = new Date(year, month - 1, day).toLocaleDateString('en-US', options);
                
                samples_description.push(`Date: ${formattedDate}<br>Sample Code: ${sampleCode}<br>AFE Code: ${afeCode}`);

                return sample;
            });

            // ---- Afes ----

            const afesPeriodGeologicalRecord = [];
            const check_afe_geological_record = {};
            const afes_afe_code = [];

            afes.forEach((afe) => {
                const startAfe = afe.item.afe_dateBP;
                if (afe.item.volc_num === vol && !check_afe_geological_record[startAfe] && startAfe !== undefined) {
                    check_afe_geological_record[startAfe] = true;
                    afesPeriodGeologicalRecord.push(-startAfe);
                    afes_afe_code.push(`AFE Code: ${afe.item.afe_code}`);
                }
            });

            const afesPeriodHistoricalRecord = afes
                .filter(
                    (afe) =>
                        afe.item.volc_num === vol &&
                        afe.item.afe_date &&
                        !afe.item.afe_dateBP
                )
                .flatMap((afe) => {
                    const startDate = new Date(afe.item.afe_date);
                    const endDate = afe.item.afe_end_date ? new Date(afe.item.afe_end_date) : startDate;
                    let dates = [];
                    if (startDate !== endDate) {
                        dates = generateDateRange(afe, afes_afe_code, startDate, endDate)
                    } else {
                        dates.push(startDate)
                        afes_afe_code.push(`AFE Code: ${afe.item.afe_code}`);
                    }
                    return dates
                });

            const newPlotData = [];

            // Set default view based on available historical records
            setSelectedData(
                eruptionsPeriodHistoricalRecord.length === 0 && afesPeriodHistoricalRecord.length === 0
                    ? 'old'
                    : 'new'
            );

            // Generate plot data based on selected data view
            if (selectedData === 'old') {
                newPlotData.push({
                    x: eruptionsPeriodGeologicalRecord,
                    y: Array(eruptionsPeriodGeologicalRecord.length).fill(1),
                    name: 'Eruptions',
                    marker: {
                        color: constants.visibilityColors[props.visibilityMode]['Eruption History'],
                        size: 12
                    },
                    type: 'scatter',
                    mode: 'markers',
                    hovertemplate: "<b>Eruption</b><br><br>Date: %{x}<br>"
                });
                newPlotData.push({
                    x: afesPeriodGeologicalRecord,
                    y: Array(afesPeriodGeologicalRecord.length).fill(1),
                    name: 'Ash Forming Events',
                    marker: {
                        color: constants.visibilityColors[props.visibilityMode]['Afes'],
                        size: 12
                    },
                    type: 'scatter',
                    mode: 'markers',
                    text: afes_afe_code,
                    hovertemplate: "<b>Ash Forming Events</b><br><br>Date: %{x}<br>%{text}<br>"
                });
            } else if (selectedData === 'new') {
                newPlotData.push({
                    x: eruptionsPeriodHistoricalRecord.map(date => {
                        const [year, month] = date.split('-').map(Number);
                        return new Date(year, month - 1);
                    }),
                    y: Array(eruptionsPeriodHistoricalRecord.length).fill(1),
                    name: 'Eruptions',
                    marker: {
                        color: constants.visibilityColors[props.visibilityMode]['Eruption History'],
                        size: 12
                    },
                    type: 'scatter',
                    mode: 'markers',
                    hovertemplate: "<b>Eruption</b><br><br>Date: %{x}<br>"
                });
                newPlotData.push({
                    x: samplesPeriodHistoricalRecord.map(sample => {
                        // Otherwise, parse the sample date as a Date object
                        const [year, month, day] = new Date(sample.item.sample_date).toISOString().substr(0, 10).split('-').map(Number);
                        return new Date(year, month-1, day);
                    }),
                    y: Array(samplesPeriodHistoricalRecord.length).fill(1),
                    name: 'Sampling',
                    marker: {
                        color: constants.visibilityColors[props.visibilityMode]['Samples'],
                        size: 12
                    },
                    type: 'scatter',
                    mode: 'markers',
                    text: samples_description,
                    hovertemplate: "<b>Sampling</b><br><br>%{text}<br>"
                });
                newPlotData.push({
                    x: afesPeriodHistoricalRecord,
                    y: Array(afesPeriodHistoricalRecord.length).fill(1),
                    name: 'Ash Forming Events',
                    marker: {
                        color: constants.visibilityColors[props.visibilityMode]['Afes'],
                        size: 12
                    },
                    type: 'scatter',
                    mode: 'markers',
                    text: afes_afe_code,
                    hovertemplate: "<b>Ash Forming Events</b><br><br>Date: %{x}<br>%{text}<br>"
                });
            }

            setPlotData(newPlotData);
        }
    }, [eruptions, vol, loading, samples, afes, selectedData, isLargeScreen, isMediumScreen, isSmallScreen, isXLScreen, isXSScreen, props]);

    /**
     * generateDateRange: Creates an array of dates between startDate and endDate, incrementing by one year.
     * 
     * @param {Date} startDate - The starting date.
     * @param {Date} endDate - The ending date.
     * @returns {Date[]} - Array of dates.
     */
    const generateDateRange = (afe, afes_afe_code, startDate, endDate) => {
        const dates = [];
        let currentDate = new Date(startDate);
        dates.push(new Date(currentDate));
        afes_afe_code.push(`AFE Code: ${afe.item.afe_code}`);
        while (currentDate <= endDate) {
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            dates.push(new Date(currentDate));
            afes_afe_code.push(`AFE Code: ${afe.item.afe_code}`);
        }
        return dates;
    };

    /**
     * handleDropdownChange: Handles changes in the data view dropdown.
     * 
     * @param {object} event - The change event from the dropdown.
     */
    const handleDropdownChange = (event) => {
        setSelectedData(event.target.value); // Update the selected data view
    };

    /**
     * showSampling: Handles click events on the plot to show associated samples.
     * 
     * @param {object} event - The click event from the plot.
     */
    const showSampling = (event) => {
        let isYearBP = typeof event.points[0].x === 'number';
        let result;

        if (isYearBP) {
            result = afes.find(obj => -obj.date === event.points[0].x);
        } else {
            const [year, month] = event.points[0].x.split('-');
            result = afes.find(obj => obj.date.toString() === `${year}.${month}`);
        }

        if (result !== undefined) {
            setFlag(true);
            const tag = {value: result.item.afe_code};
            const id = 2;
            props.tagsRef.current.handleSelectChange(tag, id); // Trigger selection change in tagsRef
        }
    };

    // Trigger search when tags are selected
    useEffect(() => {
        if (props.selectedTags && props.selectedTags.length > 0 && flag) {
            props.handleSearch(); // Perform search
            setFlag(false); // Reset flag
        }
    }, [props, flag]);

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
        );
    }

    return (
        <div>
            <Plot
                data={plotData}
                layout={{
                    title: 'Eruption History',
                    xaxis: {
                        tickfont: {
                            size: 14,
                            color: 'rgb(107, 107, 107)'
                        }
                    },
                    yaxis: {
                        title: 'Event',
                        titlefont: {
                            size: 16,
                            color: 'rgb(107, 107, 107)'
                        },
                        showticklabels: false,
                    },
                    legend: {
                        orientation: 'h',
                        bgcolor: 'rgba(255, 255, 255, 0)',
                        bordercolor: 'rgba(255, 255, 255, 0)'
                    },
                    barmode: 'group',
                    width: width,
                    height: 400,
                }}
                onClick={showSampling}
            />
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <select
                    value={selectedData}
                    onChange={handleDropdownChange}
                    style={{ padding: '5px', fontSize: '16px' }}
                >
                    <option value="new">Historical record</option>
                    <option value="old">Geological record</option>
                </select>
            </div>
        </div>
    );
};

export default TimeLine;
