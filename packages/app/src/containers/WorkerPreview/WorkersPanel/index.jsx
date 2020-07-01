import React, { useState, useCallback } from 'react';
import { Container } from 'semantic-ui-react';
import EditSubworkers from './EditSubworkers';
import Subworkers from './Subworkers';

const MODE = {
  LIST: 'LIST',
  EDIT: 'EDIT'
};

const WorkersPanel = () => {
  const [ pageMode, setMode ] = useState(MODE.LIST);
  const backButtonClickHandler = useCallback(() => setMode(MODE.LIST), [setMode]);
  const editWorkersClickHandler = useCallback(() => setMode(MODE.EDIT), [setMode]);

  return (
    <Container>
      {
        pageMode === MODE.EDIT
        ? <EditSubworkers
            backButtonClickHandler={backButtonClickHandler}
          />
        : <Subworkers
            editButtonClickHandler={editWorkersClickHandler}
          />
      }
    </Container>
  );
}

export default WorkersPanel;
