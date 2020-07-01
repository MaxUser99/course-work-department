const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workerSchema = new mongoose.Schema({
  name: String,
  birth: Date,
  hired: Date,
  position: { type: Schema.Types.ObjectId, ref: 'Positions' },
  subordinates: [{ type: String, ref: 'Workers' }],
  head: { type: String, ref: 'Workers' },
  creds: { type: Schema.Types.ObjectId, ref: 'Credentials' },
});

const WorkersModel = mongoose.model('Workers', workerSchema);

module.exports = WorkersModel;
