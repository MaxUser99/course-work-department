const mongoose = require('mongoose');

const positionsSchema = new mongoose.Schema({
  name: String,
  defaultSalary: Number
});

const positionsModel = mongoose.model('Positions', positionsSchema);

module.exports = positionsModel;
