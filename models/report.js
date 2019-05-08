const mongoose = require("mongoose");
const moment = require("moment");

const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  employee: { type: Schema.ObjectId, ref: "Employee" },
  healthPractice: { type: Schema.ObjectId, ref: "HealthPractice" },
  location: { type: Schema.ObjectId, ref: "Location" },
  date_reported: { type: Date }
});

ReportSchema.virtual("url").get(function() {
  return `/records/report/${this._id}`;
});
ReportSchema.virtual("formatted_date_reported").get(function() {
  return moment(this.date_reported).format("MMM DD, YYYY, hh:mma");
});

ReportSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Report", ReportSchema);
