import React, { useReducer, useCallback, useState, useMemo, useEffect } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { createUseStyles } from 'react-jss';
import DepartmetsApi from 'apis/DepartmentsApi';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentDepIdState, positionsState, currentDepartmentWorkersState } from '../../stores/departmentsStore';
import AccessButton from './AccessButton';

const useStyles = createUseStyles({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    marginTop: 8,
  },
});

const ACTIONS = {
  CHANGE_NAME: 'CHANGE_NAME',
  CHANGE_BIRTH: 'CHANGE_BIRTH',
  CHANGE_POSITION: 'CHANGE_POSITION',
  CHANGE_HIRED: 'CHANGE_HIRED',
  RESET: 'RESET'
};

const reducer = (state, { type, value }) => {
  switch(type) {
    case ACTIONS.CHANGE_NAME: return { ...state, name: value };
    case ACTIONS.CHANGE_BIRTH: return { ...state, birth: value };
    case ACTIONS.CHANGE_POSITION: return { ...state, position: value };
    case ACTIONS.CHANGE_HIRED: return { ...state, hired: value };
    case ACTIONS.RESET:
      const { id, name, birth, position, hired } = value;
      return {
        id: id || initialFormValues.id,
        name: name || initialFormValues.name,
        birth: birth || initialFormValues.birth,
        position: position || initialFormValues.position,
        hired: hired || ''
      };
    default: return state;
  }
}

const initialFormValues = {
  id: null,
  name: '',
  birth: '',
  position: '',
  hired: new Date().toLocaleDateString('en-US')
};

const CreateWorker = ({ mode, initialWorker }) => {
  const classes = useStyles();

  const [ isLoading, setLoading ] = useState(false);
  const [validity, setValidity] = useState({
    name: true,
    birth: true,
    position: true,
    hired: true
  });

  const [ formValues, dispatch ] = useReducer(reducer, initialFormValues);

  const currentDepId = useRecoilValue(currentDepIdState);
  const positions = useRecoilValue(positionsState);
  const setCurrentDepWorkers = useSetRecoilState(currentDepartmentWorkersState);
  const positionsOptions = useMemo(() => [...positions.values()].map(({ id, name }) => ({
      key: id,
      text: name,
      value: id
    })
  ), [positions]);

  const submitHandler = useCallback(async () => {
    let allowSubmit = true;
    if (!formValues.name) {
      setValidity(prev => ({ ...prev, name: false }));
      allowSubmit = false;
    }
    if (!formValues.position) {
      setValidity(prev => ({ ...prev, position: false }));
      allowSubmit = false;
    }
    if (isNaN(new Date(formValues.birth).getTime())) {
      setValidity(prev => ({ ...prev, birth: false }));
      allowSubmit = false;
    }
    if (isNaN(new Date(formValues.hired).getTime())) {
      setValidity(prev => ({ ...prev, hired: false }));
      allowSubmit = false;
    }
    if (!allowSubmit) return;

    setLoading(true);
    const action = mode === 'edit'
      ? DepartmetsApi.editWorker
      : DepartmetsApi.createWorker;
    const allWorkers = await action(currentDepId, formValues);
    setCurrentDepWorkers(allWorkers);
    setLoading(false);
  }, [formValues]);
  
  const changeHandler = useCallback((type, value) => {
    switch (type) {
      case ACTIONS.CHANGE_POSITION:
        setValidity(prev => ({ ...prev, position: true }));
        break;
      case ACTIONS.CHANGE_BIRTH:
        setValidity(prev => ({ ...prev, birth: true }));
        break;
      case ACTIONS.CHANGE_NAME:
        setValidity(prev => ({ ...prev, name: true }));
        break;
      case ACTIONS.CHANGE_HIRED:
        setValidity(prev => ({ ...prev, hired: true }));
        break;
    }
    dispatch({ type, value });
  }, []);

  const nameChangeHandler = useCallback(({ target: { value }}) => changeHandler(ACTIONS.CHANGE_NAME, value), []);
  const birthChangeHandler = useCallback(({ target: { value }}) => changeHandler(ACTIONS.CHANGE_BIRTH, value), []);
  const hiredChangeHandler = useCallback(({ target: { value }}) => changeHandler(ACTIONS.CHANGE_HIRED, value), []);
  const positionChangeHandler = useCallback((e, { value }) => changeHandler(ACTIONS.CHANGE_POSITION, value), []);

  useEffect(() => {
    if (!initialWorker) return;
    dispatch({ type: ACTIONS.RESET, value: initialWorker });
  }, [initialWorker]);

  const allowSubmit = !!formValues.name
    && !!formValues.birth
    && !!formValues.position
    && !!formValues.hired;

  return (
    <Form className={classes.root} onSubmit={submitHandler}>
      {
        mode === 'edit' &&
        <AccessButton />
      }
      <Form.Input
        value={formValues.name}
        onChange={nameChangeHandler}
        label='name'
        error={validity.name === false}
        required
      />
      <Form.Input
        value={formValues.birth}
        onChange={birthChangeHandler}
        label='birth'
        error={validity.birth === false}
        required
      />
      <Form.Dropdown
        value={formValues.position}
        onChange={positionChangeHandler}
        label='position'
        error={validity.position === false}
        options={positionsOptions}
        selection
        required
      />
      <Form.Input
        value={formValues.hired}
        onChange={hiredChangeHandler}
        label='hired'
        error={validity.hired === false}
        required
      />
      <Button
        loading={isLoading}
        disabled={allowSubmit === false}
        color={allowSubmit ? 'blue' : null}
        type='submit'>
          {
            mode === 'new'
            ? 'Створити працівника'
            : 'Відредагувати працівника'
          }
      </Button>
    </Form>
  );
}

export default CreateWorker;
