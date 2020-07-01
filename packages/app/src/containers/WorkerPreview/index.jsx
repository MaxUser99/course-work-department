import React, { useEffect } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { Router } from '@reach/router';

import { previewWorkerState, currentDepIdState, previewWorkerIdState } from '../../stores/departmentsStore';
import CreateWorker from './CreateWorker';
import GeneralInfo from './GeneralInfo';
import GrantAccess from './GrantAccess';

const WorkerPreview = ({ location }) => {
  const previewWorker = useRecoilValue(previewWorkerState);
  const setPreviewWorkerId = useSetRecoilState(previewWorkerIdState);
  const setCurrentDepId = useSetRecoilState(currentDepIdState);

  useEffect(() => () => {
    setCurrentDepId(null);
    setPreviewWorkerId(null);
  }, []);

  return (
    <Router
      location={location}
      primary={false}>
      <GrantAccess path='/access' />
      <CreateWorker path='/new' mode='new' />
      <CreateWorker path='/edit' mode='edit' initialWorker={previewWorker} />
      <GeneralInfo path='/' />
    </Router>
  );
}

export default WorkerPreview;
