module.exports = {
  app: {
    login: '/login',
  },
  departments: {
    getPositions: '/positions',
    getAll: '/departments',
    getOne: '/departments/:id',
    addOne: '/departments',
    removeOne: '/departments/:id',
    updateOne: '/departments/:id',
    getWorkers: '/deparmtment/:id/workers',
    addWorker: '/department/:depId/workers',
    editWorker: '/department/:depId/workers/:id',
    createCreds: '/worker/:id'
  }
};
