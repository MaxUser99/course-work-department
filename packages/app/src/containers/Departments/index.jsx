import React, { useEffect, useState } from 'react';
import { withAuth } from 'hocs/withAuth';
import { createUseStyles } from 'react-jss';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import DepartmetsApi from 'apis/DepartmentsApi';
import { formStyles } from 'styles/formStyles';
import { Segment } from 'semantic-ui-react';
import { Router } from '@reach/router';
import DepartmentsList from 'containers/DepartmentsList';
import CreateDepartmentModal from 'containers/CreateDepartmentModal';
import { departmentsState, onEditDepartmentState, positionsState } from 'stores/departmentsStore';

const useStyles = createUseStyles({
  ...formStyles,
});

const Departments = ({ location }) => {
  const classes = useStyles();
  const setDepartments = useSetRecoilState(departmentsState);
  const setPositions = useSetRecoilState(positionsState);
  const [isLoading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const onEditDepartment = useRecoilValue(onEditDepartmentState);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadDepartments = async () => {
      setLoading(true);
      const newDepartments = await DepartmetsApi.loadDepartments();
      if (mounted === false) return;
      setDepartments(newDepartments);
      setLoading(false);
    };

    const loadPositions = async () => {
      const newPositions = await DepartmetsApi.loadPositions();
      if (mounted === false) return;
      const m = new Map(newPositions.map(x => ([ x.id, x ])));
      setPositions(m);
    };

    loadDepartments();
    loadPositions();
  }, [setDepartments, setLoading, mounted]);

  return (
    <Router
      location={location}
      primary={false}
      component={Segment}
      className={classes.root}
      raised
    >
      <DepartmentsList
        isLoading={isLoading}
        path='/'
      />
      <CreateDepartmentModal
        action={DepartmetsApi.createDepartment}
        path='new'
        mode='create'
      />
      <CreateDepartmentModal
        action={DepartmetsApi.editDepartment}
        initialDepartment={onEditDepartment}
        path='edit'
        mode='edit'
      />
    </Router>
  );
};

export default withAuth(Departments);
