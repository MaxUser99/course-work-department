import React, { useCallback, useState } from 'react';
import { createUseStyles } from 'react-jss';
import {
  Icon, Button, List, Loader, Confirm,
} from 'semantic-ui-react';
import { navigate, useNavigate } from '@reach/router';
import { ROUTES } from '../../constants/Router';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { departmentsState, onEditDepartmentState, currentDepIdState } from 'stores/departmentsStore';
import DepartmetsApi from 'apis/DepartmentsApi';
import { userState, userEditState } from 'stores/userStore';

const useStyles = createUseStyles({
  listItem: {
    minHeight: 40,
    cursor: 'pointer',
    display: 'flex !important',
    alignItems: 'center'
  },
  content: {
    width: '100%'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  headerText: {
    fontSize: '16px',
    fontWeight: 'bolder',
    margin: 0
  },
  noShadowButton: {
    '&.ui.basic.button:not(:hover)': {
      boxShadow: 'none',
    },
  },
});

const DepartmentsList = ({ isLoading }) => {
  const classes = useStyles();
  const [ departments, setDepartments ] = useRecoilState(departmentsState);
  const [ onDeleteDepartment, openConfirm ] = useState(null);
  const allowEdit = useRecoilValue(userEditState);
  const setCurrentDepId = useSetRecoilState(currentDepIdState);
  const setOnEditDepartment = useSetRecoilState(onEditDepartmentState);
  const setUser = useSetRecoilState(userState);

  const confirmClickHandler = useCallback(async () => {
    const isDeleted = await DepartmetsApi.deleteDepartment(onDeleteDepartment.id)
    openConfirm(null)
    if (isDeleted) {
      setDepartments(departments.filter(x => x.id !== onDeleteDepartment.id));
    }
  }, [onDeleteDepartment]);

  const logoutClickHandler = useCallback(() => setUser(null), []);
  const cancelClickHandler = useCallback(() => openConfirm(null), []);
  const addDepHandler = useCallback(() => navigate(ROUTES.CREATE_DEPARTMENT), []);
  const depClickHandler = (depId) => {
    setCurrentDepId(depId);
    navigate(`/department/${depId}`);
  };

  const deleteClickHandler = (e, department) => {
    e.stopPropagation();
    openConfirm(department);
  };

  const editClickHandler = (e, department) => {
    e.stopPropagation();
    setOnEditDepartment(department);
    navigate('/departments/edit');
  }

  return (
    <>
      <div className={classes.header}>
        <p className={classes.headerText}>Виберіть відділення</p>
        <Button
          onClick={logoutClickHandler}
          className={classes.noShadowButton}
          icon
          basic>
          <Icon name='sign out' />
        </Button>
      </div>
      <List divided relaxed animated>
        {
          departments
            ? departments.map((x) => (
              <List.Item
                onClick={() => depClickHandler(x.id)}
                className={classes.listItem}
                key={x.id}>
                <List.Content className={classes.content}>
                  <List.Header>
                    { x.name }
                  </List.Header>
                  <List.Description>
                    { x.address }
                  </List.Description>
                </List.Content>
                {
                  allowEdit &&
                  <>
                    <Button
                      onClick={(e) => editClickHandler(e, x)}
                      className={classes.noShadowButton}
                      basic
                      icon>
                      <Icon name='edit' />
                    </Button>
                    <Button
                      onClick={(e) => deleteClickHandler(e, x)}
                      className={classes.noShadowButton}
                      basic
                      icon>
                      <Icon name='delete' />
                    </Button>
                  </>
                }
              </List.Item>
            ))
            : isLoading
              ? <Loader active />
              : <p>Віділення відсутні</p>
        }
      </List>
      {
        allowEdit &&
        <Button
          onClick={addDepHandler}
          className={classes.iconButton}
          basic
        >
          <Icon name="add circle" />
          Створити нове Віділення
        </Button>
      }
      <Confirm
        open={!!onDeleteDepartment}
        cancelButton='Ні'
        confirmButton='Так, видалити віділення'
        content={`Ви дійсно хочете видалити віділення ${onDeleteDepartment ? onDeleteDepartment.name : null}?`}
        onCancel={cancelClickHandler}
        onConfirm={confirmClickHandler}
      />
    </>
  );
};

export default DepartmentsList;
