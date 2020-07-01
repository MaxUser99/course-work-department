import React, { useState, useEffect, useCallback } from 'react';
import { Router, useLocation, Redirect, useMatch } from '@reach/router';
import { match }  from 'path-to-regexp';

import 'semantic-ui-css/semantic.min.css';

import Departments from 'containers/Departments';
import Department from 'containers/Department';
import Login from 'containers/Login';
import NotFound from 'containers/NotFound';

import { ROUTES } from 'constants/Router';
import { Transition } from 'semantic-ui-react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  root: {
    maxHeight: '100vh',
    overflowY: 'hidden'
  }
})

const App = () => {
  const classes = useStyles();
  const location = useLocation();
  const [currentLocation, setLocation] = useState(location);
  const [key, setKey] = useState(location.pathname);

  const noAnimationLocations = useCallback(match([
    '/department/:depId/new',
    '/department/:depId/edit',
    '/department/:depId/access',
  ]), []);

  useEffect(() => {
    setLocation(location);
    const shouldSkip = noAnimationLocations(location.pathname);
    if (!shouldSkip) setKey(location.pathname);
  }, [location]);

  return (
    <Transition
      key={key}
      animation='fade'
      duration={500}
      transitionOnMount
      visible>
      <Router location={currentLocation} className={classes.root}>
        <Login path={ROUTES.LOGIN} />
        <Department path={`${ROUTES.DEPARTMENT}/*`} />
        <Departments location={currentLocation} path='departments/*' />
        <Redirect from='/' to='/login' noThrow />
        <NotFound default />
      </Router>
    </Transition>
  );
};

export default App;
