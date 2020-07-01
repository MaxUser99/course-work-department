import React, { useRef, useEffect, useState, useCallback } from 'react';
import {List, Ref, Button, Icon} from 'semantic-ui-react';
import WorkerItem from './WorkerItem';
import { createUseStyles } from 'react-jss';
import cx from 'classnames';
import { useRecoilValue } from 'recoil';
import { navigate } from '@reach/router';
import { currentDepIdState, previewWorkerIdState } from 'stores/departmentsStore';
import { useSetRecoilState } from 'recoil';
import { userEditState } from 'stores/userStore';
import Filters from './Filters';

const useStyles = createUseStyles({
  listItem: {
    '&.item': {
      cursor: 'pointer',
      minHeight: 40,
      display: 'flex !important',
      alignItems: 'center',
      '&.active': {
        paddingLeft: '1em'
      }
    }
  },
  liBtn: {
    '&:hover': {
      backgroundColor: '#fbfbfb',
    }
  }
})

const WorkersList = ({ workers }) => {
  const classes = useStyles();
  const listRef = useRef();
  const currentDepId = useRecoilValue(currentDepIdState);
  const setPreviewWorkerId = useSetRecoilState(previewWorkerIdState);
  const allowEdit = useRecoilValue(userEditState);
  const [minHeight, setMinHeight] = useState(0);

  const addWorkerClickHandler = () => {
    setPreviewWorkerId(null);
    navigate(`/department/${currentDepId}/new`);
  }

  useEffect(() => {
    if (!listRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    const itemTop = rect.top;
    const height = window.innerHeight;
    setMinHeight(height - itemTop);
  });

  return (
    <Ref innerRef={listRef}>
      <StyledList minHeight={minHeight} basic>
        <Filters />
        {
          allowEdit &&
          <List.Item
            className={cx(classes.listItem, classes.liBtn)}
            onClick={addWorkerClickHandler}>
            <List.Icon name='user plus' />
            <List.Content>
              Додати працівника
            </List.Content>
          </List.Item>
        }
        {
          Array.isArray(workers)
          ? workers.map(x => <WorkerItem key={x.id} worker={x} className={classes.listItem} />)
          : <p>no workers found</p>
        }
      </StyledList>
    </Ref>
  );
}

const useListStyles = createUseStyles({
  root: {
    minHeight: minHeight => minHeight
  }
})

const StyledList = ({ children, minHeight }) => {
  const classes = useListStyles(minHeight);
  return (
    <List
      className={classes.root}
      verticalAlign='middle'
      divided
      animated
      relaxed>
      { children }
    </List>
  );
}

export default WorkersList;
