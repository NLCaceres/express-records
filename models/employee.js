// Ensure mongoose is accessible
const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  surname: { type: String, required: true, max: 100 },
  profession: { type: Schema.ObjectId, ref: 'Profession' }
});

EmployeeSchema.virtual('name').get(function() {
  return `${this.first_name} ${this.surname}`;
});

EmployeeSchema.virtual('url').get(function() {
  return `/records/employee/${this._id}`;
});

module.exports = mongoose.model('Employee', EmployeeSchema);
