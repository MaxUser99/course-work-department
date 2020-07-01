import React from 'react';
import { useRecoilValue } from 'recoil';
import { Redirect, useLocation } from '@reach/router';
import { ROUTES } from 'constants/Router';
import { userState } from '../stores/userStore';

export const withAuth = (Component) => (props) => {
  const user = useRecoilValue(userState);
  const { pathname } = useLocation();

  // return <Component {...props} />;
  return !!user
      ? <Component {...props} />
      : <Redirect from={pathname} to={ROUTES.LOGIN} noThrow />
};
