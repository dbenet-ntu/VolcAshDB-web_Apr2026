import { Opinion, FormContent, Input, Select, FilterButton, TextArea, Error, Success } from './FormAnnotation.style';
import WeatheringSignTooltip from './WeatheringSignTooltip';

/**
 * FormAnnotation: A form component for collecting and submitting detailed annotations.
 * Includes fields for opinions, detailed annotations, and comments, with handlers for each field.
 * 
 * @param {object} props - The properties passed to the component.
 * @param {object} props.opinion - The current opinion values, used for the opinion input fields.
 * @param {boolean} props.requiresDetailedAnnotation - Flag indicating if detailed annotations are required.
 * @param {string} props.color - Selected color option.
 * @param {string} props.luster - Selected luster option.
 * @param {string} props.edge - Selected edge option.
 * @param {string} props.shape - Selected shape option.
 * @param {string} props.crystallinity - Selected crystallinity option.
 * @param {string} props.hydroAlterDegree - Selected degree of hydrothermal alteration.
 * @param {boolean} props.weatheringSign - Checked state of the weathering sign checkbox.
 * @param {string} props.comments - Comments text.
 * @param {function} props.handleOpinionChange - Handler function for changes in opinion input fields.
 * @param {function} props.handleColor - Handler function for changes in color select field.
 * @param {function} props.handleLuster - Handler function for changes in luster select field.
 * @param {function} props.handleEdge - Handler function for changes in edge select field.
 * @param {function} props.handleShape - Handler function for changes in shape select field.
 * @param {function} props.handleCrystallinity - Handler function for changes in crystallinity select field.
 * @param {function} props.handleHydroAlterDegree - Handler function for changes in hydrothermal alteration degree select field.
 * @param {function} props.handleWeatheringSign - Handler function for changes in weathering sign checkbox.
 * @param {function} props.handleComments - Handler function for changes in comments textarea.
 * @param {function} props.handleSubmit - Handler function for form submission.
 * @param {boolean} props.isLoading - Flag indicating if the form is in a loading state.
 * @param {boolean} props.success - Flag indicating if the submission was successful.
 * @param {string} props.message - Message to display after form submission.
 * @param {string} props.errorMessage - Error message to display if submission fails.
 * 
 * @returns {JSX.Element} - The rendered FormAnnotation component.
 */
const FormAnnotation = ({
    opinion,
    requiresDetailedAnnotation,
    color,
    luster,
    edge,
    shape,
    crystallinity,
    hydroAlterDegree,
    weatheringSign,
    comments,
    handleOpinionChange,
    handleColor,
    handleLuster,
    handleEdge,
    handleShape,
    handleCrystallinity,
    handleHydroAlterDegree,
    handleWeatheringSign,
    handleComments,
    handleSubmit,
    isLoading,
    success,
    message,
    errorMessage
}) => {

    return (
        <Opinion>
            {/* Title for the opinion section */}
            <h3 style={{ fontWeight: 700 }}>Opinion</h3>
            {/* Subheading for main type confidence levels */}
            <h4 style={{ fontWeight: 700 }}>Main Type - Enter Confidence Levels (Total must equal 100%):</h4>

            {/* Render input fields for opinion values dynamically */}
            {Object.entries(opinion).map(([key, value]) => (
                <FormContent key={key}>
                    <label>{key}:</label>
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        name={key}
                        value={value}
                        onChange={handleOpinionChange}
                    />
                </FormContent>
            ))}

            {/* Conditionally render detailed annotation fields if required */}
            {requiresDetailedAnnotation && 
                <div>
                    {/* Color selection dropdown */}
                    <FormContent>Color:
                        <Select value={color} onChange={handleColor}>
                            <option value="">Select Color</option>
                            <option value="black">Black</option>
                            <option value="transparent">Transparent</option>
                            <option value="reddish/yellowish">Reddish/Yellowish</option>
                            <option value="white">White</option>
                        </Select>
                    </FormContent>
                    {/* Luster selection dropdown */}
                    <FormContent>Luster:
                        <Select value={luster} onChange={handleLuster}>
                            <option value="">Select Luster</option>
                            <option value="glossy">Glossy</option>
                            <option value="vitreous">Vitreous</option>
                            <option value="metallic">Metallic</option>
                            <option value="dull">Dull</option>
                        </Select>
                    </FormContent>
                    {/* Edge selection dropdown */}
                    <FormContent>Edge:
                        <Select value={edge} onChange={handleEdge}>
                            <option value="">Select Edge</option>
                            <option value="angular">Angular</option>
                            <option value="subangular/subrounded">Subangular/Subrounded</option>
                            <option value="rounded/well rounded">Rounded/Well rounded</option>
                        </Select>
                    </FormContent>
                    {/* Shape selection dropdown */}
                    <FormContent>Shape:
                        <Select value={shape} onChange={handleShape}>
                            <option value="">Select Shape</option>
                            <option value="blocky">Blocky</option>
                            <option value="fluidal">Fluidal</option>
                            <option value="microtubular">Microtubular</option>
                            <option value="highly vesicular">Highly vesicular</option>
                            <option value="spongy">Spongy</option>
                            <option value="pumice">Pumice</option>
                            <option value="aggregate">Aggregate</option>
                        </Select>
                    </FormContent>
                    {/* Crystallinity selection dropdown */}
                    <FormContent>Crystallinity:
                        <Select value={crystallinity} onChange={handleCrystallinity}>
                            <option value="">Select Crystallinity</option>
                            <option value="low crystallinity">Low crystallinity</option>
                            <option value="mid crystallinity">Mid crystallinity</option>
                            <option value="high crystallinity">High crystallinity</option>
                        </Select>
                    </FormContent>
                    {/* Hydrothermal alteration degree selection dropdown */}
                    <FormContent>Degree of hydrothermal alteration:
                        <Select value={hydroAlterDegree} onChange={handleHydroAlterDegree}>
                            <option value="">Select Degree</option>
                            <option value="none">None</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </Select>
                    </FormContent>
                    {/* Weathering sign checkbox with tooltip */}
                    <FormContent>
                        <WeatheringSignTooltip>
                            <span>Weathering Sign:</span>
                        </WeatheringSignTooltip>
                        <Input
                            type="checkbox"
                            checked={weatheringSign}
                            onChange={handleWeatheringSign}
                        />
                    </FormContent>
                </div>
            }

            {/* Comments textarea */}
            <FormContent>Comments:
                <TextArea
                    value={comments}
                    onChange={handleComments}
                    placeholder={"Explain your opinion here..."}
                />
            </FormContent>
            
            {/* Submit button */}
            <FilterButton variant="contained" disabled={isLoading} onClick={handleSubmit}>Submit</FilterButton>
            
            {/* Conditional rendering for success or error messages */}
            {message && success && <Success>{message}</Success>}
            {message && !success && <Error>{message}</Error>}
            {errorMessage && <Error>{errorMessage}</Error>}
        </Opinion>
    );
};

export default FormAnnotation;
