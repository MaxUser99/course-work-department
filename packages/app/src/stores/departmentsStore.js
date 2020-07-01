import { atom, selector } from 'recoil';

export const positionsState = atom({
  key: 'positions',
  defaultValue: new Map()
});

export const departmentsState = atom({
  key: 'departments',
  defaultValue: null,
});

export const onEditDepartmentState = atom({
  key: 'onEditDepartment',
  defaultValue: null
});

export const currentDepIdState = atom({
  key: 'currentDepId',
  defaultValue: null
});

export const currentDepartmentState = selector({
  key: 'currentDepartment',
  get: ({ get }) => {
    const currentDepId = get(currentDepIdState);
    const allDepartments = get(departmentsState);
    return allDepartments
      ? allDepartments.find(({ id }) => id === currentDepId)
      : null;
  } 
});

export const currentDepartmentWorkersState = atom({
  key: 'currentDepartmentWorkers',
  defaultValue: null
});

export const previewWorkerIdState = atom({
  key: 'previewWorkerId',
  defaultValue: null
});

export const previewWorkerState = selector({
  key: 'previewWorker',
  get: ({ get }) => {
    const workerId = get(previewWorkerIdState);
    const allWorkers = get(currentDepartmentWorkersState);
    if (!workerId || !allWorkers) return null;
    return allWorkers.find(({ id }) => id === workerId) || null;
  }
});

export const appliedFiltersState = atom({
  key: 'workersFilters',
  defaultValue: null
});
