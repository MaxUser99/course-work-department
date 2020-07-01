const registerExampleApis = require('./ExampleApi');
const registerCredentialsApis = require('./CredentialsApi');
const registerDepartmentsApis = require('./DepartmentsApi');

const registerApis = app => {
  registerExampleApis(app);
  registerCredentialsApis(app);
  registerDepartmentsApis(app);
}

module.exports = registerApis;
