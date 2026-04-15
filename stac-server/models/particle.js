const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Particle Schema for STAC API
 * Simplified version without enum dependencies
 */
const particleSchema = new Schema({
  id: { type: String, required: true },
  sample_code: { type: String, required: true },
  imgURL: { type: String },
  main_type: { type: Object },
  sub_type: { type: String },
  volc_name: { type: String },
  volc_num: { type: String }
}, {
  collection: 'particles',
  timestamps: true
});

const Particle = mongoose.model('Particle', particleSchema);

module.exports = { Particle };
