import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Button, List, Icon, Header, Transition } from 'semantic-ui-react';
import {
  currentDepartmentWorkersState,
  previewWorkerState,
  currentDepIdState,
  positionsState
} from 'stores/departmentsStore';
import DepartmetsApi from 'apis/DepartmentsApi';
import cx from 'classnames';

const useStyles = createUseStyles({
  button: {
    '&.ui.basic.button': {
      boxShadow: 'none',
    },
  },
  listItem: {
    '&.item': {
      cursor: 'pointer',
      minHeight: 40,
      display: 'flex !important',
      alignItems: 'center',
      '&.active': {
        paddingLeft: '1em'
      }
    },
    '& i.icon': {
      fontSize: '1.2em'
    }
  },
  buttonsWrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  mlAuto: {
    '&.ui.button': {
      marginLeft: 'auto'
    }
  },
  title: {
    display: 'flex',
    flexDirection: 'column'
  }
});

const EditSubworkers = ({ backButtonClickHandler }) => {
  const classes = useStyles();

  const [ allWorkers, setDepartmentWorkers ] = useRecoilState(currentDepartmentWorkersState);
  const { id, head, subordinates } = useRecoilValue(previewWorkerState);
  const currentDepartmentId = useRecoilValue(currentDepIdState);
  const positions = useRecoilValue(positionsState);

  const [ pickedWorkers, setPickedWorkers ] = useState(subordinates || []);
  const [ isUpdatingWorkers, setWorkersUpdate ] = useState(false);

  const workersToPick = useMemo(() => {
    const forbiddenWorkers = [ (head || null), id ];
    return (allWorkers || []).filter(({ id }) => forbiddenWorkers.includes(id) === false);
  }, [ allWorkers, head, id ]);

  const hasNoDiff = useMemo(() => {
    const initial = (subordinates || []).slice().sort();
    const current = pickedWorkers.slice().sort();
    return initial.length === current.length && current.every((x, i) => x === initial[i]);
  }, [ pickedWorkers, subordinates, id ]);

  const listItemClickHandler = useCallback((e, { id: workerId }) => setPickedWorkers(
    prevWorkers => (
      prevWorkers.includes(workerId)
      ? prevWorkers.filter(x => x !== workerId)
      : [ ...prevWorkers, workerId ]
    )
  ), [ setPickedWorkers ]);

  const updateSubworkers = useCallback(async () => {
    setWorkersUpdate(true);
    const updatedWorkers = await DepartmetsApi.editWorker(
      currentDepartmentId,
      { id, subordinates: pickedWorkers }
    );
    if (updatedWorkers !== null) setDepartmentWorkers(updatedWorkers);
    setWorkersUpdate(false);
  }, [ pickedWorkers ]);

  const resetClikHandler = useCallback(() => {
    setPickedWorkers(subordinates || []);
  }, [ subordinates ]);

  useEffect(() => {
    setPickedWorkers(subordinates || []);
  }, [ id ]);

  return (
    <>
      <div className={classes.buttonsWrapper}>
        <Button
          className={classes.button}
          onClick={backButtonClickHandler}
          basic
          icon>
          <Icon name='arrow left' />
        </Button>
        <Transition visible={!hasNoDiff} animation='fade' duration={200}>
          <Button
            className={cx(classes.button, classes.mlAuto)}
            onClick={resetClikHandler}
            color='teal'>
            Відмінити зміни
          </Button>
        </Transition>
      </div>

      <List divided animated relaxed>
        {
          workersToPick.map(({ name, id, position }) => {
            const userPosition = positions.get(position);
            return (
              <List.Item
                key={id}
                id={id}
                onClick={listItemClickHandler}
                className={classes.listItem}
                active={pickedWorkers.includes(id)}
                icon={
                  pickedWorkers.includes(id)
                  ? 'user'
                  : 'user outline'
                }
                content={
                  <p className={classes.title}>
                    <span>{ name }</span>
                    <span>{ userPosition ? userPosition.name : null }</span>
                  </p>
                }
              />
            )
          })
        }
      </List>
      <Button
        onClick={updateSubworkers}
        color={hasNoDiff ? null : 'blue'}
        disabled={hasNoDiff || isUpdatingWorkers}
        fluid>
          {
            hasNoDiff
            ? 'Список підлеглих не змінено'
            : 'Зберегти зміни'
          }
      </Button>
    </>
  );
};

export default EditSubworkers;
