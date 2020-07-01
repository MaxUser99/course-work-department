import React, { useState, useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import {
  Input, Label, Button, Message, Transition, Segment,
} from 'semantic-ui-react';
import { useRecoilState } from 'recoil';
import cx from 'classnames';

import { Redirect } from '@reach/router';
import { ROUTES } from 'constants/Router';
import { formStyles } from 'styles/formStyles';
import CredentialsApi from '../../apis/CredentialsApi';
import { userState } from '../../stores/userStore';

const useStyles = createUseStyles({
  ...formStyles,
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    minWidth: 100,
  },
  title: {
    textAlign: 'center',
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
  header: {
    fontSize: '1.7rem',
  },
  subheader: {
    color: '#5a5a5a',
    fontSize: '1.2rem',
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


const Login = () => {
  const classes = useStyles();

  const [user, setUser] = useRecoilState(userState);
  const [isLoading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    show: false,
    content: '',
  });

  const [credentials, changeCredentials] = useState({
    login: '',
    password: '',
  });

  const [validity, changeValidity] = useState({
    login: true,
    password: true,
  });

  const loginChangeHandler = useCallback(({ target: { value } }) => {
    changeCredentials((creds) => ({ ...creds, login: value }));
    changeValidity((prevValidity) => ({ ...prevValidity, login: !!value }));
    if (message.show) setMessage((msg) => ({ ...msg, show: false }));
  }, [changeCredentials, changeValidity, message]);

  const passwordChangeHandler = useCallback(({ target: { value } }) => {
    changeCredentials((creds) => ({ ...creds, password: value }));
    changeValidity((prevValidity) => ({ ...prevValidity, password: !!value }));
    if (message.show) setMessage((msg) => ({ ...msg, show: false }));
  }, [changeCredentials, changeValidity, message]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setLoading(true);
    const user = await CredentialsApi.login(credentials);
    setLoading(false);
    setUser(user);
    if (!user) {
      setMessage({
        show: true,
        content: 'Увійти неможливо',
      });
    }
  };

  const dismisHandler = () => setMessage((msg) => ({ ...msg, show: false }));

  const disableSubmit = Object.values(credentials).some((x) => !x) || Object.values(validity).some((x) => !x);

  if (user) return <Redirect to={ROUTES.DEPARTMENTS} noThrow />;

  return (
    <Segment className={classes.root} raised>
      <form className={classes.form} onSubmit={submitHandler}>
        <p className={cx(classes.title, classes.header)}>Вітаємо в додатку</p>
        <p className={cx(classes.title, classes.subheader)}>Введіть свої дані щоб увійти</p>

        <Input
          className={classes.input}
          error={validity.login === false}
          onChange={loginChangeHandler}
          value={credentials.login}
          labelPosition="left"
          type="text"
        >
          <Label className={classes.label} basic>Логін</Label>
          <input />
        </Input>

        <Input
          className={classes.input}
          error={validity.password === false}
          onChange={passwordChangeHandler}
          value={credentials.password}
          labelPosition="left"
          type="password"
        >
          <Label className={classes.label} basic>Пароль</Label>
          <input />
        </Input>

        <Button
          type="submit"
          loading={isLoading}
          className={classes.button}
          disabled={disableSubmit}
          color={disableSubmit ? null : 'blue'}
        >
          Увійти
        </Button>
        <Transition visible={message.show} animation="scale" duration={500}>
          <Message
            onDismiss={dismisHandler}
            className={classes.message}
            content={message.content}
            negative
          />
        </Transition>
      </form>
    </Segment>
  );
};

export default Login;
