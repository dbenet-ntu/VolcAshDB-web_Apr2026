import { useState } from "react";

/**
 * TruncatedDescription: A component that displays a truncated version of a text with a toggle option to show the full text.
 * 
 * @param {string} text - The full text to be displayed or truncated.
 * @param {number} maxLength - The maximum length of text to display before truncation.
 * @param {string} visibilityMode - Determines the color used for the truncation toggle based on visibility mode.
 * 
 * @returns {JSX.Element} - A JSX element rendering the truncated or full text with a toggle option.
 */
const TruncatedDescription = ({ text, maxLength }) => {
    // State to control whether the text is truncated or fully visible.
    const [isTruncated, setIsTruncated] = useState(true);
    
    /**
     * Toggles the truncation state between truncated and fully visible.
     */
    const toggleTruncate = () => {
        setIsTruncated(!isTruncated);
    };

    return (
        <div>
            {isTruncated ? (
                <p>
                    {text.length > maxLength ? (
                        <>
                            {/* Display truncated text with a "..." toggle link */}
                            {text.slice(0, maxLength)}
                            <span
                                style={{ color: "#1D9FD4", cursor: 'pointer' }} // Style the "..." with color and cursor
                                onClick={toggleTruncate} // Toggle the text truncation on click
                            >
                                {'...'}
                            </span>
                        </>
                    ) : (
                        // Display the full text if it is not longer than maxLength
                        text
                    )}
                </p>
            ) : (
                <p>
                    {text}
                    {/* Display the full text with a "show less" toggle link */}
                    <span
                        style={{ color: "#1D9FD4", cursor: 'pointer' }} // Style the "show less" with color and cursor
                        onClick={toggleTruncate} // Toggle the text truncation on click
                    >
                        {' (show less)'}
                    </span>
                </p>
            )}
        </div>
    );
}

export default TruncatedDescription;