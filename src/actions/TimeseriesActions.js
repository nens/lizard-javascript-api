import { ADD_TIMESERIES, ADD_SINGLE_TIMESERIES } from '../constants/ActionTypes';

export const addSingleTimeries = (timeseries) => {
  return {
    type: ADD_SINGLE_TIMESERIES,
    timeseries
  };
};

export const addTimeseries = (timeseries) => {
  return {
    type: ADD_TIMESERIES,
    timeseries
  };
};
