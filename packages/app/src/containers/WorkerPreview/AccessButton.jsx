import React, { useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import { useRecoilValue } from 'recoil';
import { navigate } from '@reach/router';
import { Button } from 'semantic-ui-react';
import { currentDepIdState, previewWorkerState } from 'stores/departmentsStore';
import { userEditState } from 'stores/userStore';

const useStyles = createUseStyles({
  root: {
    '&.ui.button': {
      marginBottom: 12
    }
  }
})

const AccessButton = () => {
  const classes = useStyles();
  const currentDepId = useRecoilValue(currentDepIdState);
  const isUserAllowedToEdit = useRecoilValue(userEditState);
  const previewWorker = useRecoilValue(previewWorkerState);
  const hasCreds = previewWorker ? previewWorker.hasCreds : false;
  const grantAccessClickHandler = useCallback(() => navigate(`/department/${currentDepId}/access`), []);

  if (!isUserAllowedToEdit) return null;

  return (
    <Button
      onClick={grantAccessClickHandler}
      type='button'
      basic
      color='teal'
      className={classes.root}>
        {
          hasCreds
          ? 'Редагувати доступ користувача'
          : 'Надати доступ до додатку'
        }
    </Button>
  );
}

export default AccessButton;
