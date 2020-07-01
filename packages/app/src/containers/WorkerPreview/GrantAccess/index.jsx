import React, { useCallback, useState, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import { Form, Icon, Button, Message } from 'semantic-ui-react';
import DepartmetsApi from 'apis/DepartmentsApi';
import { useRecoilValue, useRecoilState } from 'recoil';
import { previewWorkerState, currentDepartmentWorkersState } from 'stores/departmentsStore';
import { userState } from 'stores/userStore';

const useStyles = createUseStyles({
  root: {}
});

function useSaveUpdatedWorker() {
  const [ depWorkers, setDepWorkers ] = useRecoilState(currentDepartmentWorkersState);
  return useCallback((updatedWorker) => {
    const newWorkers = depWorkers.map(x => (
      x.id === updatedWorker.id
      ? updatedWorker
      : x
    ));
    setDepWorkers(newWorkers);
  }, [ depWorkers ]);
}

const GrantAccess = () => {
  const classes = useStyles();
  const { id: workerId, name, hasCreds } = useRecoilValue(previewWorkerState);
  const { user: userId } = useRecoilValue(userState);
  const saveUpdatedWorker = useSaveUpdatedWorker();
  const [ credsCreated, setStatus ] = useState();
  const [ isLoading, setLoading ] = useState(false);
  const [ isPassVisible, setPassVisibility ] = useState(false);
  const [ credentials, changeCreds ] = useState({
    login: '',
    password: '',
    allowEdit: false
  });
  const [ validity, changeValidity ] = useState({
    login: true,
    password: true
  });

  const isSubmitAllowed = useMemo(() => {
    const { login, password } = credentials;
    return !!login && !!password;
  }, [ credentials ]);

  const checkboxChangeHandler = useCallback(
    () => changeCreds(({ allowEdit, ...prev}) => ({ ...prev, allowEdit: !allowEdit })),
    []
  );

  const changeHandler = useCallback(({ target: { name, value }}) => {
    changeCreds(prev => ({ ...prev, [name]: value }))
    changeValidity(prev => ({ ...prev, [name]: true }));
  }, []);

  const submitHandler = useCallback(
    async () => {
      if (isLoading) return;

      changeValidity({
        login: !!credentials.login,
        password: !!credentials.password
      });

      if (!isSubmitAllowed) return;

      setLoading(true);
      const updatedWorker = await DepartmetsApi.createCredentials(
        workerId,
        credentials,
        hasCreds
      );
      setStatus(!!updatedWorker);
      if (!!updatedWorker) saveUpdatedWorker(updatedWorker);
      setLoading(false);

      console.log('submit');
    },
    [credentials, changeValidity, isSubmitAllowed, hasCreds]
  );

  const mouseUpHandler = useCallback(() => setPassVisibility(false), []);
  const mouseDownHandler = useCallback(() => setPassVisibility(true), []);

  return (
    <Form
      success={credsCreated === true}
      error={credsCreated === false}
      loading={isLoading}
      className={classes.root}
      onSubmit={submitHandler}>
      <Form.Input
        name='login'
        value={credentials.login}
        onChange={changeHandler}
        label='Логін'
        error={validity.login === false}
        required
      />
      <Form.Input
        name='password'
        value={credentials.password}
        onChange={changeHandler}
        label='Пароль'
        error={validity.password === false}
        required
        type={
          isPassVisible
          ? 'text'
          : 'password'
        }
        icon={
          <Button
          onMouseDown={mouseDownHandler}
          onMouseUp={mouseUpHandler}
          type='button'
          icon
          basic>
            <Icon name='eye slash outline' />
          </Button>
        }
      />
      <Form.Checkbox
        checked={credentials.allowEdit}
        onChange={checkboxChangeHandler}
        label='Дозволити змінювати дані'
      />
      <Button
        fluid
        disabled={isSubmitAllowed === false}
        color={
          isSubmitAllowed
          ? 'blue'
          : null
        }
        type='submit'
      >
        Надати доступ
      </Button>
      <Message
        success
        header='Доступ успішно надано'
        content={
          userId === workerId
          ? `Дані для входу користувача ${name} оновленно`
          : `Відтепер користувач ${name} може увійти в додаток`
        }
      />
      <Message
        error
        header={
          userId === workerId
          ? 'Змінити дані для входу користувача не вдалось'
          : 'Надати доступ користувачу неможливо'
        }
      />
    </Form>
  );
}

export default GrantAccess;
