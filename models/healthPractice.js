const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HealthPracticeSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  image: { data: Buffer, contentType: String },
  precautionType: { type: Schema.ObjectId, ref: 'Precaution' }
});

HealthPracticeSchema.virtual('url').get(() => '/records/health-practices');

HealthPracticeSchema.virtual('label').get(function() {
  return `${this.name} Violation`;
});

module.exports = mongoose.model('HealthPractice', HealthPracticeSchema);
