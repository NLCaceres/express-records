const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HealthPracticeSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  image: { data: Buffer, contentType: String },
  precautionType: { type: Schema.ObjectId, ref: 'Precaution' }
});

HealthPracticeSchema.virtual('urlSafeName').get(function() {
  return this.name.toLowerCase().replace(" ", "_")
})

HealthPracticeSchema.virtual('url').get(function() { return `/records/health-practices/${this.urlSafeName}` });

HealthPracticeSchema.virtual('label').get(function() {
  return `${this.name} Violation`;
});

module.exports = mongoose.model('HealthPractice', HealthPracticeSchema);
