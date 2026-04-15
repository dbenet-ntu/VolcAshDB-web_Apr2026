import { useCallback, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle, useMap, useMapEvent } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Link } from 'react-router';
import { DownloadContainer, CustomDownloadButton, Legend, LegendContainer, LegendImg, LegendItem, LegendSpan } from './WorldMap.styles';
import 'leaflet/dist/leaflet.css';
import useFetchVolcanoes from '../../hooks/useFetchVolcanoes';
import useFetchSamples from '../../hooks/useFetchSamples';
import TruncatedDescription from './TruncatedDescription';
import { useEventHandlers } from '@react-leaflet/core';
import { toKML } from '@placemarkio/tokml';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';
import natural_sample from '../../assets/images/natural_sample.png';
import experimental_sample from '../../assets/images/experimental_sample.png';

// CSS classes for positioning map controls
const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
};

// Style for the rectangle bounds on the minimap
const BOUNDS_STYLE = { weight: 1 };

/**
 * MinimapBounds: A component that draws a rectangle on the minimap to represent the bounds of the main map.
 * 
 * @param {object} parentMap - The main map whose bounds are represented on the minimap.
 * @param {number} zoom - The zoom level of the minimap.
 * 
 * @returns {JSX.Element} - A JSX element rendering the rectangle on the minimap.
 */
function MinimapBounds({ parentMap, zoom }) {
    const minimap = useMap(); // Get the Leaflet map instance for the minimap

    // Update the main map's view when the minimap is clicked
    const onClick = useCallback((e) => {
        parentMap.setView(e.latlng, parentMap.getZoom());
    }, [parentMap]);

    useMapEvent('click', onClick); // Register click event on minimap

    const [bounds, setBounds] = useState(parentMap.getBounds()); // State to track bounds of main map

    // Update bounds and view on main map change
    const onChange = useCallback(() => {
        setBounds(parentMap.getBounds());
        minimap.setView(parentMap.getCenter(), zoom);
    }, [minimap, parentMap, zoom]);

    const handlers = useMemo(() => ({ move: onChange, zoom: onChange }), [onChange]);
    useEventHandlers({ instance: parentMap }, handlers); // Register move and zoom event handlers

    return <Rectangle bounds={bounds} pathOptions={BOUNDS_STYLE} />; // Render rectangle on minimap
}

/**
 * parseDate: Parses a date string in ISO 8601 format and returns only the date portion in "YYYY-MM-DD" format.
 * 
 * @param {string} dateString - The date string in ISO 8601 format (e.g., "1977-03-01T00:00:00.000Z").
 * 
 * @returns {string} - The date portion of the input in "YYYY-MM-DD" format (e.g., "1977-03-01").
 */
function parseDate(dateString) {
    const date = new Date(dateString); // Create a Date object from the given ISO 8601 date string
    return date.toISOString().split('T')[0]; // Convert the Date object to an ISO string, split at 'T', and return only the date part
}

/**
 * MinimapControl: A component that provides a minimap control for the main map.
 * 
 * @param {string} position - Position of the minimap on the main map.
 * @param {number} zoom - Zoom level for the minimap.
 * @param {array} volcanoMarkers - Array of volcano marker data.
 * @param {array} sampleMarkers - Array of sample marker data.
 * 
 * @returns {JSX.Element} - A JSX element rendering the minimap control.
 */
function MinimapControl({ position, zoom, volcanoMarkers, sampleMarkers }) {
    const parentMap = useMap(); // Get the main map instance
    const mapZoom = zoom || 0; // Default zoom level if not provided

    // Create minimap with markers
    const minimap = useMemo(() => (
        <MapContainer
            style={{ height: 80, width: 80 }} // Minimap size
            center={parentMap.getCenter()} // Center of minimap
            zoom={mapZoom} // Zoom level of minimap
            dragging={false} // Disable dragging on minimap
            doubleClickZoom={false} // Disable double-click zoom on minimap
            scrollWheelZoom={false} // Disable scroll wheel zoom on minimap
            attributionControl={false} // Disable attribution control
            zoomControl={false} // Disable zoom control
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MinimapBounds parentMap={parentMap} zoom={mapZoom} />
            {volcanoMarkers.map(volcano => (
                <Marker
                    key={volcano.volcano_details['_id']}
                    position={[parseFloat(volcano.volcano_details['volc_slat']), parseFloat(volcano.volcano_details['volc_slon'])]}
                    icon={
                        new Icon({
                            iconUrl: 'https://cdn-icons-png.freepik.com/256/13570/13570233.png', // Volcano icon
                            iconSize: [10, 10], // Icon size
                        })
                    }
                />
            ))}
            {sampleMarkers.map(sample => (
                <Marker
                    key={sample['sample_code']}
                    position={[parseFloat(sample['sample_lat']), parseFloat(sample['sample_lon'])]}
                    icon={
                        new Icon({
                            iconUrl: sample['sample_nat'] ? natural_sample : experimental_sample, // Conditional icon
                            iconSize: [10, 10], // Icon size
                        })
                    }
                />
            ))}
        </MapContainer>
    ), [parentMap, mapZoom, volcanoMarkers, sampleMarkers]);

    // Determine CSS class for minimap position
    const positionClass = (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;

    return (
        <div className={positionClass}>
            <div className="leaflet-control leaflet-bar">{minimap}</div> {/* Render minimap control */}
        </div>
    );
}

/**
 * WorldMap: Main component that displays the world map with volcanoes and samples.
 * 
 * @returns {JSX.Element} - A JSX element rendering the world map with various controls and markers.
 */
function WorldMap({ volcanoes: propVolcanoes, samples: propSamples, latitude: propLatitude, longitude: propLongitude, zoom: propZoom }) {

    // Define icons for volcanoes and samples
    const volcanoIcon = new Icon({
        iconUrl: 'https://cdn-icons-png.freepik.com/256/13570/13570233.png',
        iconSize: [10, 10],
    });

    // Fetch data for volcanoes and samples
    const { volcanoes } = useFetchVolcanoes();
    const { samples } = useFetchSamples();

    const center_map = [
        propLatitude ? parseFloat(propLatitude) : 35,  // Use rounded latitude or default to 35 if invalid
        propLongitude ? parseFloat(propLongitude) : 0  // Use rounded longitude or default to 0 if invalid
    ];

    const zoom = propZoom || 2;

    // Use provided props if available
    const volcanoData = propVolcanoes || volcanoes;
    const sampleData = propSamples || samples;

    // Define icons for natural and experimental samples
    const naturalIcon = new Icon({
        iconUrl: natural_sample,
        iconSize: [10, 10],
    });

    const experimentalIcon = new Icon({
        iconUrl: experimental_sample,
        iconSize: [10, 10],
    });

    /**
     * handleExportKML: Converts volcano and sample data to KML format and triggers download.
     */
    const handleExportKML = () => {
        // Create KML features for volcanoes
        const volcanoFeatures = volcanoData.map(volcano => ({
            type: 'Feature',
            properties: {
                name: volcano.volcano_details['volc_name'],
                country: volcano.volcano_details['volc_country'],
                type: volcano.volcano_details['volc_type'],
                composition: volcano.volcano_details['volc_rtype'],
                source: `
                    <br/>
                    <a href="https://volcashdb.ipgp.fr">VolcAshDB website</a>
                    <p>Source: <a href=https://volcano.si.edu/volcano.cfm?vn=${volcano.volcano_details['volc_num']} target="_blank" rel="noopener noreferrer">Smithsonian Institution</a></p>
                    <p>Citation: <a href="https://doi.org/10.5479/si.GVP.VOTW5-2024.5.2" target="_blank" rel="noopener noreferrer">https://doi.org/10.5479/si.GVP.VOTW5-2024.5.2</a></p>`
            },
            geometry: {
                type: 'Point',
                coordinates: [parseFloat(volcano.volcano_details['volc_slon']), parseFloat(volcano.volcano_details['volc_slat'])]
            }
        }));

        // Create KML features for samples
        const sampleFeatures = sampleData.map(sample => ({
            type: 'Feature',
            properties: {
                name: sample['sample_code'],
                afe_code: sample['afe_code'] || 'N/A',
                afe_date: sample['afe_date'] ? parseDate(sample['afe_date']) : 'N/A',
                afe_dateBP: sample['afe_dateBP'] ? -sample['afe_dateBP'] : 'N/A',
                sample_date: sample['sample_date'] ? parseDate(sample['sample_date']) : 'N/A',
                description: `
                <a href="https://volcashdb.ipgp.fr">VolcAshDB website</a>`
            },
            geometry: {
                type: 'Point',
                coordinates: [parseFloat(sample['sample_lon']), parseFloat(sample['sample_lat'])]
            }
        }));

        // Combine features into a FeatureCollection
        const featureGroup = {
            type: 'FeatureCollection',
            features: [...volcanoFeatures, ...sampleFeatures]
        };

        // Convert feature collection to KML
        const kml = toKML(featureGroup, { documentName: 'VolcashDB', name: 'name', description: 'description' });

        // Create a downloadable link for the KML file
        const convertedData = 'application/vnd.google-earth.kml+xml;charset=utf-8,' + encodeURIComponent(kml);

        const link = document.createElement('a');
        link.setAttribute('href', 'data:' + convertedData);
        link.setAttribute('download', 'volcashDB.kml');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Display message if no volcanoes are found
    if (!volcanoData || volcanoData.length === 0) {
        return <div>No volcanoes found</div>;
    }

    return (
        <MapContainer center={center_map} zoom={zoom} scrollWheelZoom={true} style={{ height: "400px", width: "80%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Render sample markers */}
            {sampleData.map(sample => (
                <Marker
                    key={sample['sample_code']}
                    position={[parseFloat(sample['sample_lat']), parseFloat(sample['sample_lon'])]}
                    icon={sample['sample_nat'] ? naturalIcon : experimentalIcon}
                >
                    <Popup>
                        <div>
                            <h3>
                                <Link to='/catalogue'>
                                    {sample['sample_code']}
                                </Link>
                            </h3>
                            {sample['afe_code']?
                                <div>
                                    <p>Ash Forming Event: {sample['afe_code']}</p>
                                </div>
                            :null}
                            {sample['afe_date']?
                                <div>
                                    <p>Ash Forming Event Date: {
                                        new Date(sample['afe_date']).toLocaleDateString('en-US', { day: 'numeric',  month: 'short', year: 'numeric' })
                                    }</p>
                                </div>
                            :null}
                            {sample['afe_dateBP']?
                                <div>
                                    <p>Ash Forming Event Date: -{sample['afe_dateBP']}</p>
                                </div>
                            :null}
                            {sample['sample_date']?
                                <p>Sampling date: {parseDate(sample['sample_date'])}</p>
                                :<p>Sampling date: N/A</p>
                            }
                        </div>
                    </Popup>
                </Marker>
            ))}
            {/* Render volcano markers */}
            {volcanoData.map(volcano => (
                <Marker
                    key={volcano.volcano_details['_id']}
                    position={[parseFloat(volcano.volcano_details['volc_slat']), parseFloat(volcano.volcano_details['volc_slon'])]}
                    icon={volcanoIcon}
                >
                    <Popup>
                        <div>
                            <h3>
                                <Link to='/catalogue'>
                                    {volcano.volcano_details['volc_name']}, {volcano.volcano_details['volc_country']}
                                </Link>
                            </h3>
                            <p>Type: {volcano.volcano_details['volc_type']}</p>
                            <p>Composition: {volcano.volcano_details['volc_rtype']}</p>
                            <p>Source: <a href={`https://volcano.si.edu/volcano.cfm?vn=${volcano.volcano_details['volc_num']}`} target="_blank" rel="noopener noreferrer">Smithsonian Institution</a></p>
                            <p>Citation: <a href="https://doi.org/10.5479/si.GVP.VOTW5-2024.5.2" target="_blank" rel="noopener noreferrer">https://doi.org/10.5479/si.GVP.VOTW5-2024.5.2</a></p>
                        </div>
                    </Popup>
                </Marker>
            ))}
            <MinimapControl position="topright" volcanoMarkers={volcanoData} sampleMarkers={sampleData} />
            <DownloadContainer className={`${POSITION_CLASSES.topleft}`}>
                <Tooltip title="Download KML file">
                    <CustomDownloadButton className={`leaflet-control leaflet-bar`} onClick={handleExportKML}>
                        <DownloadIcon fontSize='small' />
                    </CustomDownloadButton>
                </Tooltip>
            </DownloadContainer>

            <LegendContainer className={`${POSITION_CLASSES.bottomleft}`}>
                <Legend>
                    <LegendItem>
                        <strong>Legend:</strong>
                        <LegendSpan>
                            <LegendImg src='https://cdn-icons-png.freepik.com/256/13570/13570233.png' alt='Volcano Icon'/>
                            Volcano
                        </LegendSpan>
                        <LegendSpan>
                            <LegendImg src={natural_sample} alt='Natural Sample Icon'/>
                            Natural sample
                        </LegendSpan>
                        <LegendSpan>
                            <LegendImg src={experimental_sample} alt='Experimental Sample Icon'/>
                            Experimental sample
                        </LegendSpan>
                    </LegendItem>
                </Legend>
            </LegendContainer>
        </MapContainer>
    );
}

export default WorldMap;
