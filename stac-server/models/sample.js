const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Sample Schema for STAC API
 * Simplified version without enum dependencies
 */
const sampleSchema = new Schema({
  sample_code: { type: String, required: true },
  sample_date: { type: Date },
  sample_lat: { type: String, required: true },
  sample_lon: { type: String, required: true },
  sample_nat: { type: Boolean, required: true },
  sample_weight: { type: Number },
  sample_age: { type: Number },
  sample_age_uncertainty: { type: Number },
  sample_method: { type: String },
  sample_storage: { type: String },
  sample_sieving: { type: String },
  sample_lab_procedure: { type: String },
  sample_Hcontrol: { type: String },
  sample_T: { type: Number },
  sample_hydro_alter_degre: { type: String },
  sample_juvenile_proportion: { type: Number },
  sample_crystals_proportion: { type: Number },
  sample_lithics_proportion: { type: Number },
  sample_aggregates_proportion: { type: Number },
  sample_comment: { type: String },
  volc_name: { type: String },
  volc_num: { type: String },
  afe_code: { type: String },
  afe_nat: { type: Boolean }
}, {
  collection: 'samples',
  timestamps: true
});

const Sample = mongoose.model('Sample', sampleSchema);

module.exports = { Sample };
