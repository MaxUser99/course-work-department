import React, { useCallback } from 'react';
import { List, Button, Icon } from 'semantic-ui-react';
import { createUseStyles } from 'react-jss';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentDepIdState, previewWorkerIdState } from 'stores/departmentsStore';
import { navigate } from '@reach/router';
import { userEditState } from 'stores/userStore';

const useStyles = createUseStyles({
  noShadowButton: {
    '&.ui.basic.button:not(:hover)': {
      boxShadow: 'none',
    },
  },
});

const WorkerItem = ({ worker, className }) => {
  const classes = useStyles();
  const [ activeWorkerId, setActiveWorkerId ] = useRecoilState(previewWorkerIdState);
  const currentDepId = useRecoilValue(currentDepIdState);
  const allowEdit = useRecoilValue(userEditState);

  const itemClickHandler = useCallback(() => {
    setActiveWorkerId(worker.id);
    navigate(`/department/${currentDepId}`);
  }, [worker]);

  const editClickHandler = useCallback((e) => {
    e.stopPropagation();
    setActiveWorkerId(worker.id);
    navigate(`/department/${currentDepId}/edit`);
  }, [worker]);

  return (
    <List.Item
      active={worker.id === activeWorkerId}
      className={className}
      onClick={itemClickHandler}>
      <List.Icon name='user outline' />
      <List.Content verticalAlign='middle'>
        { worker.name }
      </List.Content>
      {
        allowEdit &&
        <Button
          className={classes.noShadowButton}
          onClick={editClickHandler}
          basic
          icon>
          <Icon name='edit' />
        </Button>
      }
    </List.Item>
  );
}

export default WorkerItem;
