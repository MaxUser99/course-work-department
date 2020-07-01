import React, { useCallback, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { createUseStyles } from 'react-jss';
import { Divider, Grid, Accordion, Icon } from 'semantic-ui-react';
import { previewWorkerState, positionsState } from 'stores/departmentsStore';
import InfoRow from './InfoRow';
import WorkersPanel from './WorkersPanel';

const useStyles = createUseStyles({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  headerBlock: {
    marginRight: 25
  },
  header: {
    width: '100%',
    fontSize: '14px',
    fontWeight: 'bolder',
    position: 'relative',
    paddingBottom: 8,
    '&:after': {
      content: '""',
      width: 250,
      height: 1,
      backgroundColor: 'red',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#22242626',
      position: 'absolute'
    }
  },
  withMargin: {
    margin: '14px 0'
  }
})

const GeneralInfo = () => {
  const classes = useStyles();
  const previewWorker = useRecoilValue(previewWorkerState);
  const positions = useRecoilValue(positionsState);
  const [ activePanel, setActivePanel ] = useState(-1);

  const accordeonClickHandler = useCallback(
    (e, { index }) => setActivePanel(prevIndex => (prevIndex === index ? -1 : index)),
    [ setActivePanel ]
  );

  useEffect(() => () => setActivePanel(-1), []);

  if (!previewWorker) {
    return (
      <div className={classes.root}>
        select worker to preview
      </div>
    );
  }

  const {
    name,
    position,
    birth,
  } = previewWorker;

  const targetPosition = positions.get(position);

  return (
    <div className={classes.root}>

      <Grid columns={3}>
        <Grid.Row>
          <Grid.Column className={classes.headerBlock} width={16} textAlign='center'>
            <p className={classes.header}>
              Загальна інформація
            </p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign='center'>
            <InfoRow title={name} label='Ім`я' />
          </Grid.Column>
          <Grid.Column textAlign='center'>
            <InfoRow title={birth} label='Дата народження' />
          </Grid.Column>
          <Grid.Column textAlign='center'>
            <InfoRow
              title={
                targetPosition
                ? targetPosition.name
                : '-'
              }
              label='Посада'
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Divider />

      {/* <Accordion fluid styled>
        <Accordion.Title
          active={activePanel === 0}
          index={0}
          onClick={accordeonClickHandler}
          >
            <Icon name='dropdown' />
            Заробітня плата
        </Accordion.Title>
        <Accordion.Content active={activePanel === 0}>
              hello
        </Accordion.Content>
      </Accordion> */}

      <Accordion className={classes.withMargin} fluid styled>
        <Accordion.Title
          active={activePanel === 1}
          index={1}
          onClick={accordeonClickHandler}>
            <Icon name='dropdown' />
            Підлеглі працівники
        </Accordion.Title>
        <Accordion.Content active={activePanel === 1}>
          { activePanel === 1 && <WorkersPanel /> }
        </Accordion.Content>
      </Accordion>

    </div>
  );
}

export default GeneralInfo;
