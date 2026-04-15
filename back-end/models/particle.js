const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const colors = require('../enums/colors');
const crystallinity = require('../enums/crystallinity');
const edge = require('../enums/edge');
const hydro_alter_degree = require('../enums/hydro_alter_degre');
const luster = require("../enums/luster");
const shape = require("../enums/shape");
const types = require("../enums/type");
const subtypes = require("../enums/subtypes");
const gsUp = require("../enums/gsUp")
const gsLow = require("../enums/gsLow")

/**
 * Particle Schema: Defines the structure of the 'particles' collection in MongoDB.
 * This schema contains various properties representing physical, chemical, and visual characteristics of particles.
 */
const particleSchema = new Schema({
    asm: {
        required: true,             // asm is a required field
        type: Number                // asm is of type Number
    },
    aspect_rat: {
        required: true,             // aspect_rat is a required field
        type: Number                // Aspect ratio is of type Number
    },
    blue_mean: {
        required: true,             // blue_mean is a required field
        type: Number                // Mean value of blue channel in particle image is of type Number
    },
    blue_mode: {
        required: true,             // blue_mode is a required field
        type: Number                // Mode of blue channel values is of type Number
    },
    blue_std: {
        required: true,             // blue_std is a required field
        type: Number                // Standard deviation of blue channel values is of type Number
    },
    circularity_cioni: {
        required: true,             // circularity_cioni is a required field
        type: Number                // Circularity measure by Cioni's method is of type Number
    },
    circularity_dellino: {
        required: true,             // circularity_dellino is a required field
        type: Number                // Circularity measure by Dellino's method is of type Number
    },
    circ_elon: {
        required: true,             // circ_elon is a required field
        type: Number                // Circularity measure by circ_dellino * elongation is of type Number
    },
    circ_rect: {
        required: true,             // circ_rect is a required field
        type: Number                // Circularity measure by circ_dellino * rectangularity method is of type Number
    },
    color: {
        enum: colors,               // Possible values for color, imported from an enum
        type: String                // Color is of type String
    },
    comp_elon: {
        required: true,             // comp_elon is a required field
        type: Number                // Compositional elongation is of type Number
    },
    compactness: {
        required: true,             // compactness is a required field
        type: Number                // Measure of particle compactness is of type Number
    },
    contrast: {
        required: true,             // contrast is a required field
        type: Number                // Image contrast of the particle is of type Number
    },
    convexity: {
        required: true,             // convexity is a required field
        type: Number                // Convexity of the particle shape is of type Number
    },
    correlation: {
        required: true,             // correlation is a required field
        type: Number                // Texture correlation is of type Number
    },
    crystallinity: {
        enum: crystallinity,        // Possible values for crystallinity, imported from an enum
        type: String                // Crystallinity is of type String
    },
    dissimilarity: {
        required: true,             // dissimilarity is a required field
        type: Number                // Texture dissimilarity is of type Number
    },
    eccentricity_ellipse: {
        required: true,             // eccentricity_ellipse is a required field
        type: Number                // Eccentricity of the particle based on ellipses is of type Number
    },
    eccentricity_moments: {
        required: true,             // eccentricity_moments is a required field
        type: Number                // Eccentricity based on moments is of type Number
    },
    edge: {
        enum: edge,                 // Possible edge characteristics, imported from an enum
        type: String                // Edge is of type String
    },
    elongation: {
        required: true,             // elongation is a required field
        type: Number                // Elongation of the particle is of type Number
    },
    energy: {
        required: true,             // energy is a required field
        type: Number                // Texture energy is of type Number
    },
    faulty_image: {
        type: Boolean,              // Whether the image is faulty
        default: false              // Defaults to false
    },
    green_mean: {
        required: true,             // green_mean is a required field
        type: Number                // Mean value of green channel in the particle image is of type Number
    },
    green_mode: {
        required: true,             // green_mode is a required field
        type: Number                // Mode of green channel values is of type NUmber
    },
    green_std: {
        required: true,             // green_std is a required field
        type: Number                // Standard deviation of green channel values is of type Number
    },
    gsLow: {
        type: Schema.Types.Mixed,   // Mixed type allows for multiple types (Number/String)
        enum: gsLow                 // Enum for lower grain size value
    },
    gsUp: {
        type: Schema.Types.Mixed,   // Mixed type allows for multiple types (Number/String)
        enum: gsUp                  // Enum for upper grain size value
    },
    homogeneity: {
        required: true,             // homogeneity is a required field
        type: Number                // Texture homogeneity is of type Number
    },
    hue_mean: {
        required: true,             // hue_mean is a required field
        type: Number                // Mean value of hue in the particle image is of type Number
    },
    hue_mode: {
        required: true,             // hue_mode is a required field
        type: Number                // Mode of hue values is of type Number
    },
    hue_std: {
        required: true,             // hue_std is a required field
        type: Number                // Standard deviation of hue values is of type Number
    },
    hydro_alter_degree: {	
        enum: hydro_alter_degree,   // Enum for hydrothermal alteration degree
        type: String                // hydro_later_degree is of type Number
    },
    id: {				    
        required: true,             // Unique ID required for each particle
        type: Number                // ID is of type Number
    },
    imgURL: {	
        required: true,             // imgURL is a required field			
        type: String                // URL of the particle image is of type String
    },
    instrument: {			
        type: String                // Instrument used for measurement
    },
    luster: {
        enum: luster,               // Enum for possible luster types
        type: String                // Luster is of type String
    },
    magnification: {		
        type: Number                // Magnification level of the image is of type Number
    },
    /**
     * Main type: Categories for the particle's material type.
     * Each type has a value between 0 and 100.
     */
    main_type: {
        "altered material": {
            max: 100,
            min: 0,
            type: Number
        },
        "free crystal": {
            max: 100,
            min: 0,
            type: Number
        },
        "juvenile": {
            max: 100,
            min: 0,
            type: Number
        },
        "lithic": {
            max: 100,
            min: 0,
            type: Number
        }
    },
    multi_focus: {			
        type: Boolean               // Whether the image uses multiple focus levels
    },
    publication: {
        type: Array                 // Array of publications related to the particle classification
    },
    rect_comp: {
        required: true,             // rect_comp is a required field
        type: Number                // Rectangularity complexity measure is of type Number
    },
    rectangularity: {
        required: true,             // rectangularity is a required field
        type: Number                // Rectangularity of the particle is of type Number
    },
    red_mean: {
        required: true,             // red_mean is a required field
        type: Number                // Mean value of red channel in the particle image is of type Number
    },
    red_mode: {
        required: true,             // red_mode is a required field
        type: Number                // Mode of red channel values is of type Number
    },
    red_std: {
        required: true,             // red_std is a required field
        type: Number                // Standard deviation of red channel values is of type Number
    },
    requiresDetailedAnnotation: {
        type: Boolean               // Whether the particle requires detailed annotation
    },
    roundness: {
        required: true,             // roundness is a required field
        type: Number                // Measure of particle roundness is of type Number
    },
    sample_code: {			    
        required: true,             // sample_code is a required field
        type: String                // String type for the Sample code
    },
    saturation_mean: {
        required: true,             // saturation_mean is a required field
        type: Number                // Mean value of color saturation is of type Number
    },
    saturation_mode: {
        required: true,             // saturation_mode is a required field
        type: Number                // Mode of saturation values is of type Number
    },
    saturation_std: {
        required: true,             // saturation_std is a required field
        type: Number                // Standard deviation of saturation values is of type Number
    },
    shape: {				
        enum: shape,                // Enum for shape types
        type: String                // Shape is of type String
    },
    solidity: {
        required: true,             // solidity is a required field
        type: Number                // Solidity of the particle
    },
    sub_type: {				
        enum: subtypes,             // Enum for subtypes of particles
        type: String                // Sub type is of type String
    },
    type: {				    
        enum: types,                // Enum for particle type (e.g., natural, experimental)
        type: String                // Type is of type String
    },
    ultrasound: {
        type: Boolean               // Ultrasound is of type Boolean
    },
    value_mean: {
        required: true,             // value_mean is a required field
        type: Number                // Mean value for lightness (Value) in HSL color model is of type Number
    },
    value_mode: {
        required: true,             // value_mode is a required field
        type: Number                // Mode for lightness (Value) is of type Number
    },
    value_std: {
        required: true,             // value_std is a required field
        type: Number                // Standard deviation of lightness (Value) is of type Number
    },
    volc_name: {	
        required: true,             // Volcano name is a required field	    
        type: String                // Name of the volcano from which the particle originated is of type String
    },
    volc_num: {				
        required: true,             // Volcano number is required
        type: Number                // Number type for the volcano ID is of type Number
    },
    weathering_sign: {
        type: String                // Indicates if there are signs of weathering
    }
}, {
	collection: 'particles',        // Name of the collection in MongoDB
	timestamps: true                // Automatically adds createdAt and updatedAt fields
});

// Create and export the Particle model based on the schema
const Particle = mongoose.model('Particle', particleSchema);

module.exports = { Particle };