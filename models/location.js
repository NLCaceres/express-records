const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  facilityName: { type: String, required: true, max: 100 },
  unitNum: { type: String, required: true, max: 100 },
  roomNum: { type: String, requiredL: true, max: 100 }
});

LocationSchema.virtual('url').get(function() {
  return `/records/location/${this._id}`;
});

LocationSchema.virtual('label').get(function() {
  return `${this.facilityName} ${this.unitNum} ${this.roomNum}`;
});

module.exports = mongoose.model('Location', LocationSchema);
