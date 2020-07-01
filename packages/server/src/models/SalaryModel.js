const mongoose = require('mongoose');

const salarySchema = mongoose.Schema({
  from: Date,
  to: Date,
  amount: Number,
  // rewards: 
});

const salaryModel = mongoose.model('Salaries', salarySchema);

module.exports = salaryModel;
