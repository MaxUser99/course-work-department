import React, { useCallback, useState, useMemo, useEffect} from 'react';
import { Button, Icon, Dropdown } from 'semantic-ui-react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { showFiltersState } from 'stores/uiStore';
import { createUseStyles } from 'react-jss';
import { positionsState, currentDepartmentWorkersState, appliedFiltersState, currentDepIdState } from 'stores/departmentsStore';
import DepartmetsApi from 'apis/DepartmentsApi';

const useStyles = createUseStyles({
  div: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  withMargin: {
    marginBottom: 12
  }
});

export const PROPS = {
  NAME: 'NAME',
  POSITION: 'POSITION',
};

const propertyOptions = [
  { key: 0, value: PROPS.POSITION, text: 'Посада' },
  { key: 1, value: PROPS.NAME, text: 'Імя' },
];

function useValuesOptions({ prop }) {
  const positions = useRecoilValue(positionsState);
  const users = useRecoilValue(currentDepartmentWorkersState);
  return useMemo(() => {
    switch (prop) {
      case PROPS.NAME:
        return (users || []).map(({
          id,
          name
        }) => ({
          key: id,
          value: name,
          text: name
        }));
      case PROPS.POSITION:
        return [...positions.values()].map(({
          id,
          name
        }) => ({
          key: id,
          value: id,
          text: name
        }));
      default: return [];
    }
  }, [prop, users, positions]);
}

const defaultFilters = {
  prop: PROPS.NONE,
  value: null
};

const Filters = () => {
  const classes = useStyles();
  const [ showFilters, toggleFilters ] = useRecoilState(showFiltersState);
  const [ savedFilters, saveFilters ] = useRecoilState(appliedFiltersState);
  const [ filters, setFilters ] = useState(defaultFilters);
  const setDepartmentWorkers = useSetRecoilState(currentDepartmentWorkersState);
  const depId = useRecoilValue(currentDepIdState);
  const valueOptions = useValuesOptions(filters);
  const valueChangeHandler = useCallback(
    (e, { value }) => {
      setFilters(x => ({ ...x, value }));
    },
    [ setFilters ]
  );

  const propChangeHandler = useCallback(
    (e, { value }) => {
      if (value && !(value in PROPS)) return;
      setFilters({
        prop: value || null,
        value: null
      });
    }, [setFilters]
  );
  const filterButtonClickHandler = useCallback(
    () => toggleFilters(!showFilters),
    [toggleFilters, showFilters]
  );

  const applyClickHandler = useCallback(
    async () => {
      const { prop, value } = filters;
      const filtersToSave = !!prop && !!value
        ? filters 
        : null;
      saveFilters(filtersToSave);
      const newWorkers = await DepartmetsApi.loadDepartmentWorkers(depId, filtersToSave);
      setDepartmentWorkers(newWorkers);
      toggleFilters(false);
    }, [ filters ]
  );
  const discardClickHandler = useCallback(
    () => {
      toggleFilters(false);
    }, []
  );

  useEffect(() => {
    if (showFilters) {
      setFilters(savedFilters || defaultFilters);
    } else {
      setFilters(defaultFilters);
    }
  }, [showFilters, savedFilters]);

  useEffect(() => () => {
    toggleFilters(false);
    setFilters(defaultFilters);
  }, []);

  if (showFilters) {
    return (
      <div className={classes.div}>
        <Dropdown
          value={filters.prop}
          className={classes.withMargin}
          onChange={propChangeHandler}
          clearable
          fluid
          selection
          placeholder='Властивість для пошуку'
          options={propertyOptions}
        />
        <Dropdown
          clearable
          fluid
          search
          selection
          value={filters.value}
          onChange={valueChangeHandler}
          disabled={filters.prop === null}
          className={classes.withMargin}
          placeholder='Значення для пошуку'
          options={valueOptions}
        />
        <Button.Group className={classes.withMargin} fluid>
          <Button onClick={discardClickHandler} basic icon color='red'>
            <Icon name='close' />
          </Button>
          <Button onClick={applyClickHandler} basic color='green'>
            Застовувати
          </Button>
        </Button.Group>
      </div>
    );
  }

  return (
    <Button onClick={filterButtonClickHandler} animated='vertical' basic fluid>
      <Button.Content hidden>hello</Button.Content>
      <Button.Content visible>
        <Icon name='filter' />
      </Button.Content>
    </Button>
  );  
};

export default Filters;
