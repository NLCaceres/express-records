const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PrecautionSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  practices: [{ type: Schema.ObjectId, ref: 'HealthPractice' }]
});

PrecautionSchema.virtual('url').get(function() {
  return `/records/precautions/${this._id}`;
});

module.exports = mongoose.model('Precaution', PrecautionSchema);
