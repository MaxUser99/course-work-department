import React, {
  useEffect, useState, useReducer, useCallback,
} from 'react';
import { createUseStyles } from 'react-jss';
import {
  Input, Label, Grid, Button, Icon, Transition, Message,
} from 'semantic-ui-react';
import { ROUTES } from 'constants/Router';
import { withAuth } from '../../hocs/withAuth';
import DepartmetsApi from 'apis/DepartmentsApi';

const useStyles = createUseStyles({
  label: {
    minWidth: 100,
  },
  input: {
    marginTop: 8,
  },
  button: {
    '&.ui.button': {
      marginTop: 8,
      marginRight: 0,
    },
  },
  backButton: {
    '&.ui.basic.button': {
      boxShadow: 'none',
    },
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  message: {
    left: 0,
    bottom: -55,
    width: '100%',
    textAlign: 'center',
    '&.ui.message': {
      position: 'absolute',
    },
  },
});

const ACTIONS = {
  CHANGE_NAME: 'CHANGE_NAME',
  CHANGE_ADDRESS: 'CHANGE_ADDRESS',
  CHANGE_IMAGE: 'CHANGE_IMAGE',
};

const reducer = (state, { type, value }) => {
  switch (type) {
    case ACTIONS.CHANGE_NAME: return { ...state, name: value };
    case ACTIONS.CHANGE_ADDRESS: return { ...state, address: value };
    case ACTIONS.CHANGE_IMAGE: return { ...state, image: value };
    default: return state;
  }
};

const initialFormValues = {
  id: null,
  name: '',
  address: '',
  image: null,
};

const CreateDepartmentModal = ({ navigate, action, initialDepartment, mode }) => {
  const classes = useStyles();

  const [showMessage, setMessageVisibility] = useState(false);
  const [isCreated, setStatus] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [formValues, dispatch] = useReducer(
    reducer,
    initialFormValues,
    () => {
      if (initialDepartment) {
        const { name, address, image, id } = initialDepartment;
        return {
          id: id || null,
          name: name || initialFormValues.name,
          address: address || initialFormValues.address,
          image: image || initialFormValues.image
        };
      }
      return initialFormValues;
    }
  );

  const getMessage = useCallback(() => {
    if (initialDepartment) {
      return isCreated
        ? 'Віділення успішно відредаговано'
        : 'Під час редагування віділення трапилась помилка';
    }
    return isCreated
      ? 'Віділення успішно створено'
      : 'Створити віділення неможливо';
  }, [initialDepartment, isCreated]);

  const nameChangeHandler = useCallback(({ target: { value } }) => dispatch({ type: ACTIONS.CHANGE_NAME, value }), []);
  const addressChangeHandler = useCallback(({ target: { value } }) => dispatch({ type: ACTIONS.CHANGE_ADDRESS, value }), []);
  const fileChangeHandler = useCallback(({ target: { value } }) => dispatch({ type: ACTIONS.CHANGE_IMAGE, value }), []);
  const backClickHandler = useCallback(() => navigate(ROUTES.DEPARTMENTS), []);
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await action(formValues);
    setLoading(false);
    setStatus(!!success);
    setMessageVisibility(true);
  };

  useEffect(() => {
    setMessageVisibility(false);
  }, [formValues]);

  const isDisabled = !formValues.name;

  useEffect(() => {
    if (mode === 'edit' && !initialDepartment) {
      navigate(ROUTES.DEPARTMENTS);
    }
  }, []);

  return (
    <>
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.titleWrapper}>
        <Button
          onClick={backClickHandler}
          className={classes.backButton}
          type="button"
          basic
          icon
        >
          <Icon name="arrow left" />
        </Button>
        <p>
          {
            initialDepartment
            ? 'Редагування віділення'
            : 'Створення віділення'
          }
        </p>
      </div>
      <Input
        className={classes.input}
        onChange={nameChangeHandler}
        value={formValues.name}
        labelPosition="left"
        type="text"
      >
        <Label basic>Назва</Label>
        <input />
      </Input>
      <Input
        className={classes.input}
        onChange={addressChangeHandler}
        value={formValues.address}
        labelPosition="left"
        type="text"
      >
        <Label basic>Адрес</Label>
        <input />
      </Input>
      <Button
        type="submit"
        loading={isLoading}
        className={classes.button}
        color={isDisabled ? null : 'blue'}
        disabled={isDisabled}
      >
        {
          initialDepartment
          ? 'Редагувати віділення'
          : 'Створити віділення'
        }
      </Button>
    </form>
    <Transition visible={showMessage} animation='scale' duration={500}>
      <Message
        onDismiss={() => setMessageVisibility(false)}
        className={classes.message}
        content={getMessage()}
        negative={!isCreated}
        positive={isCreated}
      />
    </Transition>
    </>
  );
};

export default withAuth(CreateDepartmentModal);
