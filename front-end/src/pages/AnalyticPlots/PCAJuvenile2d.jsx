import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import RiseLoader from "react-spinners/RiseLoader";
import { useLoading } from '../../hooks/useLoading';
import { PCA } from 'ml-pca';
import * as constants from "../../Constants";

const PCAJuvenile2d = (props) => {
    const { data, visibilityMode } = props;
    const svgRef = useRef(null);
    const tooltipRef = useRef(null); 
    const [transformedData, setTransformedData] = useState(null);
    const [selectedParticles, setSelectedParticles] = useState(null);
    const [yAxisTitle, setYAxisTitle] = useState('PC2');
    const [yAxisValue, setYAxisValue] = useState(1);
    const { load, loading } = useLoading();

    useEffect(() => {
        load(data);
    }, [load, data]);

    useEffect(() => {
        if (!loading) {
            const selectedParticles = data.filter(d => d.main_type?.juvenile > 0);
            selectedParticles.sort((a, b) => {
                if (a.eruptive_style === "Dome explosion" && b.eruptive_style !== "Dome explosion") {
                    return -1;
                } else if (a.eruptive_style !== "Dome explosion" && b.eruptive_style === "Dome explosion") {
                    return 1;
                } else {
                    return 0;
                }
            });

            const features = selectedParticles.map(d => [
                d.asm, d.aspect_rat, d.blue_mean, d.blue_mode, d.blue_std, d.circ_elon, d.circ_rect,
                d.circularity_cioni, d.circularity_dellino, d.comp_elon, d.compactness, d.contrast,
                d.convexity, d.correlation, d.dissimilarity, d.eccentricity_ellipse, d.eccentricity_moments,
                d.elongation, d.energy, d.green_mean, d.green_mode, d.green_std, d.homogeneity, d.hue_mean,
                d.hue_mode, d.hue_std, d.rect_comp, d.rectangularity, d.red_mean, d.red_mode, d.red_std,
                d.roundness, d.saturation_mean, d.saturation_mode, d.saturation_std, d.solidity, d.value_mean,
                d.value_mode, d.value_std
            ]);

            setSelectedParticles(selectedParticles);

            const pca = new PCA(features);
            const newTransformedData = pca.predict(features);            
            setTransformedData(newTransformedData);
        }
    }, [data, loading]);

    useEffect(() => {
        if (transformedData && selectedParticles) {
            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove(); // Clear previous chart
    
            const margin = { top: 20, right: 30, bottom: 50, left: 60 };
            const width = 350 - margin.left - margin.right;
            const height = 350 - margin.top - margin.bottom;
    
            const xValues = transformedData.data.map(d => d[0]); // PC1
            const yValues = transformedData.data.map(d => d[yAxisValue]); // PC2 or PC3
            const types = selectedParticles.map(d => d.eruptive_style);
            const transformedDataWithStyle = transformedData.data.map((d, index) => ({
                ...d,  // Keep the PCA components (PC1, PC2, etc.)
                eruptive_style: selectedParticles[index].eruptive_style // Add eruptive_style from selectedParticles
            }));

            const colors = types.map(type => constants.visibilityColors[visibilityMode][type]);
    
            // Define scales
            const xScale = d3.scaleLinear()
                .domain([d3.min(xValues)-50, d3.max(xValues)+50])
                .range([0, width]);
    
            const yScale = d3.scaleLinear()
                .domain([d3.min(yValues)-50, d3.max(yValues)+50])
                .range([height, 0]);

            // Append axes
            svg.append("g")
                .attr("transform", `translate(${margin.left},${height + margin.top})`)
                .call(d3.axisBottom(xScale));

            svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .call(d3.axisLeft(yScale));

            // Add x-axis title
            svg.append("text")
                .attr("transform", `translate(${width / 2 + margin.left}, ${height + margin.top + 40})`)
                .style("text-anchor", "middle")
                .text("PC1");  // Change this to whatever axis title you'd like

            // Add y-axis title
            svg.append("text")
                .attr("transform", `translate(${margin.left - 30}, ${height / 2 + margin.top}) rotate(-90)`)
                .style("text-anchor", "middle")
                .text(`${yAxisTitle}`);  // Change this to whatever axis title you'd like
    
            // Add gridlines
            svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .selectAll(".x-grid")
                .data(xScale.ticks())
                .enter()
                .append("line")
                .attr("class", "x-grid")
                .attr("x1", d => xScale(d))
                .attr("x2", d => xScale(d))
                .attr("y1", 0)
                .attr("y2", height)
                .attr("stroke", "#ccc")
                .attr("stroke-dasharray", "2,2");
    
            svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .selectAll(".y-grid")
                .data(yScale.ticks())
                .enter()
                .append("line")
                .attr("class", "y-grid")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", d => yScale(d))
                .attr("y2", d => yScale(d))
                .attr("stroke", "#ccc")
                .attr("stroke-dasharray", "2,2");
    
            // Add contour density for each eruptive style
            const groupedData = d3.group(selectedParticles, d => d.eruptive_style);
    
            groupedData.forEach((particles, eruptiveStyle) => {
                const styleIndices = particles.map(p => selectedParticles.indexOf(p));
                const densityData = styleIndices.map(index => [xValues[index], yValues[index]]);
    
                const density = d3.contourDensity()
                    .x(d => xScale(d[0]))
                    .y(d => yScale(d[1]))
                    .bandwidth(10)
                    (densityData);
    
                svg.append("g")
                    .selectAll("path")
                    .data(density)
                    .enter()
                    .append("path")
                    .attr("fill", constants.visibilityColors[visibilityMode][eruptiveStyle])
                    .attr("d", d3.geoPath())
                    .attr("opacity", 0.2)
                    .attr("transform", `translate(${margin.left},${margin.top})`);
            });
    
            // Add circles (data points)
            svg.append("g")
                .selectAll("circle")
                .data(transformedDataWithStyle)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(d[0]))
                .attr("cy", d => yScale(d[yAxisValue]))
                .attr("r", 3)
                .attr("fill", (d, i) => colors[i])
                .attr("stroke", "black")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .on("mouseover", function (event, d) {
                    d3.select(this)
                        .transition()
                        .attr("r", 5)
                        .attr("stroke", "white")
                        .attr("stroke-width", 2);
                    
                    d3.select(tooltipRef.current)
                        .style("display", "block")
                        .style("left", `${event.pageX + 5}px`)
                        .style("top", `${event.pageY + 5}px`)
                        .html(`Type: ${d.eruptive_style}<br>PC1: ${d[0].toFixed(2)}<br>PC${yAxisValue + 1}: ${d[yAxisValue].toFixed(2)}<br>`);

                })
                .on("mouseout", function (event, d) {
                    d3.select(this)
                        .transition()
                        .attr("r", 3)
                        .attr("stroke", "black")
                        .attr("stroke-width", 1);


                    d3.select(tooltipRef.current).style("display", "none");
                });

            // Add Legend
            const legend = svg.append("g")
                .attr("transform", `translate(${margin.left + width + 20},${margin.top})`);

            const legendItems = [...new Set(types)];

            legendItems.forEach((type, index) => {
                legend.append("rect")
                    .attr("x", 0)
                    .attr("y", index * 20)
                    .attr("width", 15)
                    .attr("height", 15)
                    .attr("fill", constants.visibilityColors[visibilityMode][type]);

                legend.append("text")
                    .attr("x", 20)
                    .attr("y", index * 20 + 12)
                    .style("font-size", "12px")
                    .text(type);
            });
        }
    }, [transformedData, selectedParticles, yAxisValue, visibilityMode]);
    

    const handleYAxisTitleChange = () => {
        setYAxisTitle(yAxisTitle === 'PC2' ? 'PC3' : 'PC2');
        setYAxisValue(yAxisValue === 1 ? 2 : 1);
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
        );
    }

    return (
        <div>
            <p onClick={handleYAxisTitleChange}>PCA of Juvenile Particles by Eruptive Style</p>
            <svg ref={svgRef} width={450} height={400}></svg>
            <div
                ref={tooltipRef}
                style={{
                    position: "absolute",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    padding: "5px",
                    borderRadius: "5px",
                    display: "none",
                    pointerEvents: "none",
                    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
                }}
            ></div>
        </div>
    );
};

export default PCAJuvenile2d;