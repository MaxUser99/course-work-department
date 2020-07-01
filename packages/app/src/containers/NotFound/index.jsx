import React from 'react';
import { Link } from '@reach/router';
import { Container } from 'semantic-ui-react';
import { createUseStyles } from 'react-jss';

import { ROUTES } from 'constants/Router';

const useStyles = createUseStyles({
  root: {
    paddingTop: '10%',
  },
});

const NotFound = () => {
  const classes = useStyles();

  const userExist = false;

  const link = userExist
    ? <Link to={ROUTES.DEPARTMENTS} children="На головну" />
    : <Link to={ROUTES.LOGIN} children="Увійти" />;

  return (
    <Container className={classes.root} textAlign="center">
      <p>404</p>
      <p>Сторінку не знайдено</p>
      { link }
    </Container>
  );
};

export default NotFound;
