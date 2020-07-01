const DepartmentsModal = require('../models/DepartmentModel');
const PositionsModal = require('../models/PositionsModel');
const WorkerModel = require('../models/WorkerModel');
const CredentialsModel = require('../models/CredentialsModel');

const { apiEndpoints } = require('easy-mern-stack-shared');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcrypt');
const WorkersModel = require('../models/WorkerModel');

const registerApis = app => {
  app.get(apiEndpoints.departments.getAll, (req, res) => {
    DepartmentsModal.find({}, (err, departments) => {
      res.send(departments);
    });
  });

  app.post(apiEndpoints.departments.addOne, async (req, res) => {
    const { body: { name, address } } = req;
    const allowCreate = await DepartmentsModal.find({ name })
      .then(x => !x.length)
      .catch(y => {
        console.log('error: ', y);
        return null;
      });

    if (!allowCreate) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
      return;
    }

    new DepartmentsModal({
      name,
      address,
      workers: [],
      head: null
    }).save((err, newDepartment) => {
      res.status(
        err
        ? HttpStatus.INTERNAL_SERVER_ERROR
        : HttpStatus.ACCEPTED
      ).send(newDepartment);
    });
  });

  app.put(apiEndpoints.departments.updateOne, (req, res) => {
    const { params: { id }, body: { name, address } } = req;
    DepartmentsModal.findOneAndUpdate(
      { _id: id},
      { $set: { name, address } },
      { new: true },
      ( err, updatedOne ) => {
        res.status(
          (!!err || !updatedOne)
          ? HttpStatus.INTERNAL_SERVER_ERROR
          : HttpStatus.ACCEPTED
        ).send(updatedOne);
      }
    );
  });

  app.delete(apiEndpoints.departments.removeOne, async (res, req) => {
    const { params: { id: _id }} = res;
    const { deletedCount } = await DepartmentsModal.deleteOne({ _id });
    req.status(
      deletedCount
      ? HttpStatus.ACCEPTED
      : HttpStatus.CONFLICT
    ).send();
  });

  app.get(apiEndpoints.departments.getWorkers, async (req, res) => {
    const { params: { id: depId }, query} = req;
    const allWorkers = await getAllDepartmentWorkers(depId, query);
    res.send(allWorkers);
  });

  app.post(apiEndpoints.departments.addWorker, async (req, res) => {
    const { params: { depId}, body: { name, birth, position, hired }} = req;
    console.log(name, birth, position);
    const birthDate = new Date(birth);
    const hiredDate = new Date(hired);
    const isValidBirth = isNaN(birthDate.getTime()) === false;
    const isValidHired = isNaN(hiredDate.getTime()) === false;

    if (!isValidBirth || !isValidHired) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
      return;
    }

    const newWorker = new WorkerModel({
      name,
      position,
      birth: birthDate,
      hired: hiredDate
    });

    const savedUser = await newWorker.save().catch(() => null);

    if (!savedUser) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
      return;
    }

    const depUpdated = await DepartmentsModal.findOneAndUpdate(
      { _id: depId },
      { $push: { workers: savedUser._id }}
    ).catch(() => null);

    const allWorkers = await getAllDepartmentWorkers(depId);

    res.status(
      !!depUpdated
      ? HttpStatus.ACCEPTED
      : HttpStatus.INTERNAL_SERVER_ERROR
    ).send(allWorkers);
  });

  app.post(apiEndpoints.departments.editWorker, async (req, res) => {
    const { params: { depId, id }, body } = req;    
    const updated = await WorkerModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
    ).exec().catch(() => null);

    if ('subordinates' in body) {
      const { subordinates: prevSub = [] } = updated;
      const { subordinates: currentSub } = body;

      const subToRemoveHead = prevSub.filter(x => currentSub.includes(x) === false);
      const subToSetHead = currentSub.filter(x => prevSub.includes(x) === false);

      const promise1 = asyncWrapper(
        WorkerModel.updateMany(
          { _id: { $in: subToRemoveHead } },
          { $set: { head: null }}
        )
      );

      const promise2 = asyncWrapper(
        WorkerModel.updateMany(
          { _id: { $in: subToSetHead } },
          { $set: { head: updated.id }}
        )
      );

      await Promise.all([ promise1, promise2 ]);
    }

    const allWorkers = await getAllDepartmentWorkers(depId);

    res.status(
      !!updated
      ? HttpStatus.ACCEPTED
      : HttpStatus.INTERNAL_SERVER_ERROR
    ).send(allWorkers);
  });

  app.get(apiEndpoints.departments.getPositions, (req, res) => {
    PositionsModal.find({}, (err, positions) => {
      res.send(positions);
    });
  })

  app.post(apiEndpoints.departments.createCreds, async (req, res) => {
    const {
      params: { id },
      body: { login, password, allowEdit },
      query: { ovveride }
    } = req;

    const loginAllowed = ovveride || await CredentialsModel.find({ login })
      .exec()
      .then(x => x.length === 0)
      .catch(() => false);
    console.log(loginAllowed, ovveride);
    if (!loginAllowed) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
      return;
    }
    
    const newPass = await bcrypt.hash(password, 10);

    const user = await asyncWrapper(WorkersModel.findById(id));
    if (!user) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
      return;
    }
    const { _id: userId } = user;

    const newCreds = await new CredentialsModel({
      login,
      password: newPass,
      allowEdit,
      user: userId
    }).save().catch(() => null);

    const credsId = newCreds
      ? newCreds._id
      : null;

    if (ovveride) {
      const removed = await CredentialsModel.findOneAndDelete(
        { user: userId }
      ).exec().catch(() => null);
      console.log(removed)
    }

    const updatedWorker = await WorkerModel.findOneAndUpdate(
      { _id: id },
      { $set: { creds: credsId } },
      { new: true }
    ).exec().catch(() => null);

    res.status(
      updatedWorker
      ? HttpStatus.ACCEPTED
      : HttpStatus.INTERNAL_SERVER_ERROR
    ).send(updatedWorker);
  });

  getAllDepartmentWorkers = async (depId, query) => {
    const department = await DepartmentsModal.findOne({ _id: depId }).catch(() => null);
    const workersIds = department
    ? department.workers
    : [];
    const queryFilters = serializeFilterQuery(query);
    const condition = { '_id': { $in: workersIds }, ...queryFilters };
    return await WorkerModel.find(condition).catch(() => []);
  }

  isObjectEmpty = (obj) => {
    if (!obj) return true;
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
  }

  serializeFilterQuery = (query) => {
    if (isObjectEmpty(query)) return {};
    const entries = Object.entries(query);
    const [ propName, value ] = entries[0];
    console.log(propName, value)
    switch(propName) {
      case 'name': return { 'name': value };
      case 'position': return { 'position': value };
      default: return {};
    }
  }

  asyncWrapper = async (query) =>  query.exec().catch(() => null);
}

module.exports = registerApis;
