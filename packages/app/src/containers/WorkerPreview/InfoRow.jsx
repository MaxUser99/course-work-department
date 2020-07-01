import React from 'react';
import { createUseStyles } from 'react-jss';
import { Header } from 'semantic-ui-react';

const useStyles = createUseStyles({
  root: {
    marginRight: 25
  },
  label: {
    '&.ui.sub.header': {
      textTransform: 'initial'
    }
  }
});

const InfoRow = ({ label, title }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Header className={classes.label} sub>{label}</Header>
      <span>{title}</span>
    </div>
  );
}

export default InfoRow;
