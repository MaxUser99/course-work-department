import axios from 'axios';
import { apiEndpoints } from 'easy-mern-stack-shared';
import { Api } from './Api';
import { PROPS } from '../containers/WorkersList/Filters';

class DepartmetsApi extends Api {
  static loadDepartments = () => (
    axios.get(apiEndpoints.departments.getAll)
      .then(({ data }) => (
        (data && Array.isArray(data))
        ? data.map(this.departmentNormalizer)
        : null
      ))
      .catch(this.defaultErrorHandler())
  )

  static createDepartment = (modalData) => (
    axios.post(apiEndpoints.departments.addOne, modalData)
    .then(({ data }) => true)
    .catch(this.defaultErrorHandler(false))
  )

  static loadDepartmentWorkers = (depId, filters) => {
    const propNames = {
      [PROPS.NAME]: 'name',
      [PROPS.POSITION]: 'position'
    };
    const propName = propNames[filters && filters.prop];
    const query = propName
      ? `?${propName}=${filters.value}`
      : '';
    return axios.get(`${apiEndpoints.departments.getWorkers.replace(':id', depId)}${query}`)
      .then(({ data }) => data.map(this.workerNormalizer))
      .catch(this.defaultErrorHandler([]));
  }

  static deleteDepartment = (depId) => {
    return axios.delete(apiEndpoints.departments.removeOne.replace(':id', depId))
      .then(() => true)
      .catch(this.defaultErrorHandler(false));
  }

  static editDepartment = ({ id, ...formValues }) => {
    return axios.put(apiEndpoints.departments.updateOne.replace(':id', id), formValues)
      .then(({ data }) => this.departmentNormalizer(data))
      .catch(this.defaultErrorHandler(null));
  }

  static createWorker = (depId, formData) => {
    const url = apiEndpoints.departments.addWorker
      .replace(':depId', depId);
    return axios.post(url, formData)
      .then(({ data }) => data.map(x => this.workerNormalizer(x)))
      .catch(this.defaultErrorHandler(null));
  }

  static editWorker = (depId, { id, ...formData }) => {
    const url = apiEndpoints.departments.editWorker
      .replace(':depId', depId)
      .replace(':id', id);
    return axios.post(url, formData)
      .then(({ data }) => data.map(x => this.workerNormalizer(x)))
      .catch(this.defaultErrorHandler(null));
  }

  static loadPositions = () => {
    return axios.get(apiEndpoints.departments.getPositions)
    .then(({ data }) => data.map(({
      _id,
      name,
      defaultSalary
    }) => ({
      id: _id,
      name,
      defaultSalary
    })))
    .catch(this.defaultErrorHandler(null));
  }

  static createCredentials = (workerId, creds, shouldOverride) => {
    return axios.post(
      `${apiEndpoints.departments.createCreds.replace(':id', workerId)}?ovveride=${shouldOverride}`,
      creds
    ).then(({ data }) => this.workerNormalizer(data))
    .catch(() => null);
  }

  static departmentNormalizer = ({
    _id,
    name,
    icon,
    workers,
    head,
    address,
  }) => ({
    id: _id,
    name,
    icon,
    workers,
    head,
    address,
  })

  static workerNormalizer = ({
    _id,
    name,
    birth,
    position,
    subordinates,
    head,
    creds,
    hired
  }) => ({
    id: _id,
    name,
    birth: new Date(birth).toLocaleDateString('en-US'),
    hired: new Date(hired).toLocaleDateString('en-US'),
    position,
    subordinates,
    head,
    hasCreds: !!creds,
  })
}

export default DepartmetsApi;
