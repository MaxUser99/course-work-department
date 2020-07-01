import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { Button, List } from 'semantic-ui-react';
import {
  previewWorkerState,
  currentDepartmentWorkersState,
  positionsState
} from 'stores/departmentsStore';
import { createUseStyles } from 'react-jss';
import { userEditState } from 'stores/userStore';

const useStyles = createUseStyles({
  title: {
    display: 'flex',
    flexDirection: 'column'
  },
  listItem: {
    '&.item': {
      cursor: 'pointer',
      minHeight: 40,
      display: 'flex !important',
      alignItems: 'center',
    },
    '& i.icon': {
      fontSize: '1.2em'
    }
  },  
  bolder: {
    fontWeight: 'bolder'
  }
});

function useSubworkers(subordinates) {
  const allWorkers = useRecoilValue(currentDepartmentWorkersState);
  return useMemo(() => (
    (allWorkers && subordinates)
    ? allWorkers.filter(({ id }) => subordinates.includes(id))
    : []
  ), [ allWorkers, subordinates ]);
}

function useHeadName(head) {
  const allWorkers = useRecoilValue(currentDepartmentWorkersState);
  return useMemo(
    () => {
      if (!head || !allWorkers) return null;
      const target = allWorkers.find(x => x.id === head);
      return target ? target.name : null;
    }, [ head, allWorkers ]
  );
}

const Subworkers = ({ editButtonClickHandler }) => {
  const classes = useStyles();
  const { head, subordinates } = useRecoilValue(previewWorkerState);
  const subWorkers = useSubworkers(subordinates);
  const headName = useHeadName(head);
  const positions = useRecoilValue(positionsState);
  const allowEdit = useRecoilValue(userEditState);

  const content = subWorkers.length
    ? <List divided relaxed>
        {
          subWorkers.map(({ id, name, position }) => {
            const workerPosition = positions.get(position);
            return (
              <List.Item
                key={id}
                id={id}
                className={classes.listItem}
                icon='user'
                content={
                  <p className={classes.title}>
                    <span>{ name }</span>
                    <span>
                      {
                        workerPosition
                          ? workerPosition.name
                          : null
                      }
                    </span>
                  </p>
                }
              />
            );
          })
        }
      </List>
    : <p>Підлеглі працівники відсутні</p>;

  return (
    <>
      { !!headName && <p>Керівник - <span className={classes.bolder}>{headName}</span></p> }
      { content }
      {
        allowEdit &&
        <Button onClick={editButtonClickHandler} color='teal' basic>
          Редагувати підлеглих працівників
        </Button>
      }
    </>
  );
};

export default Subworkers;
