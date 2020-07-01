const WorkersModel = require('./WorkerModel');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  workers: [{ type: Schema.Types.ObjectId, ref: 'Workers'}],
  head: { type: Schema.Types.ObjectId, ref: 'Workers'}
});

departmentSchema.pre('remove', async (next) => {
  await WorkersModel.deleteMany({ _id: this.workers });
  next();
});

const DepartmentsModal = mongoose.model('Departments', departmentSchema);

module.exports = DepartmentsModal;
