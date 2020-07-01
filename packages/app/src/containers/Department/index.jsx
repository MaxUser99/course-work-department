import React, { useState, useCallback, useEffect } from 'react';
import { withAuth } from 'hocs/withAuth';
import { Container, Grid, Header, Icon, Button, Loader } from 'semantic-ui-react';
import { createUseStyles } from 'react-jss';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { currentDepartmentState, currentDepartmentWorkersState  } from 'stores/departmentsStore';
import { navigate, Redirect } from '@reach/router';

import WorkersList from 'containers/WorkersList';
import WorkerPreview from 'containers/WorkerPreview';

import { userState } from '../../stores/userStore';
import DepartmetsApi from 'apis/DepartmentsApi';

const useStyles = createUseStyles({
  root: {
    paddingTop: '6vh',
  },
  noShadowButton: {
    '&.ui.basic.button:not(:hover)': {
      boxShadow: 'none',
    },
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    lineHeight: '36px',
    fontSize: '18px',
    width: '100%',
    margin: 0
  },
  lighter: {
    color: '#868686',
    marginRight: 5
  },
  leftColumn: {
    borderRight: '1px solid #22242626'
  },
  content: {
    borderTop: '1px solid #22242626'
  }
});

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  return mounted;
}

const Department = ({ location }) => {
  const classes = useStyles();
  const currentDepartment = useRecoilValue(currentDepartmentState);
  const [ isLoading, setLoading ] = useState(false);
  const [ workers, setWorkers ] = useRecoilState(currentDepartmentWorkersState);
  const setUser = useSetRecoilState(userState);
  const isMounted = useMounted();

  const logoutClickHandler = useCallback(() => setUser(null), []);
  const backButtonClickHandler = useCallback(() => navigate('/departments'), []);

  useEffect(() => {
    const loadWorkers = async (depId) => {
      if (!isMounted) return;
      setLoading(true);
      const newWorkers = await DepartmetsApi.loadDepartmentWorkers(depId, null);
      setWorkers(newWorkers);
      if (!isMounted) return;
      setLoading(false); 
    };

    loadWorkers(currentDepartment && currentDepartment.id);
    return () => setWorkers(null);
  }, [currentDepartment, isMounted]);

  if (!currentDepartment) {
    return <Redirect to='/departments' noThrow />
  }

  return (
    <Container className={classes.root}>
      <div className={classes.titleWrapper}>
          <Button
            onClick={backButtonClickHandler}
            className={classes.noShadowButton}
            size='small'
            basic
            icon>
            <Icon name='arrow left' />
          </Button>
        <p className={classes.header}>
          <span className={classes.lighter}>
            Віділлення:
          </span>
          { currentDepartment.name }
        </p>
        <Button
          onClick={logoutClickHandler}
          className={classes.noShadowButton}
          icon
          basic>
          <Icon name='sign out' />
        </Button>
      </div>
      <Grid className={classes.content} columns={2} stretched padded container>
        <Loader active={isLoading} />
        <Grid.Column className={classes.leftColumn} width={4}>
          <WorkersList workers={workers} />
        </Grid.Column>
        <Grid.Column width={12}>
          <WorkerPreview location={location} />
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default withAuth(Department);
