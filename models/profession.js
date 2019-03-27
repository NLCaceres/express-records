const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProfessionSchema = new Schema({
  observed_occupation: { type: String, required: true, max: 100 },
  service_discipline: { type: String, required: true, max: 100 }
});

ProfessionSchema.virtual("url").get(function() {
  return `/records/profession/${this._id}`;
});

ProfessionSchema.virtual("label").get(function() {
  return `${this.observed_occupation} ${this.service_discipline}`;
});

ProfessionSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Profession", ProfessionSchema);
