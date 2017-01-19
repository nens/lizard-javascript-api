import {
  ADD_EVENTSERIES_SYNC,
  RECEIVE_EVENTSERIES_SUCCESS,
  RECEIVE_EVENTSERIES_FAILURE,
  REMOVE_EVENTSERIES
} from '../constants/ActionTypes';

import { fetchItem } from '../utils';

const addEventseriesSync = (uuid) => {
  return {
    type: ADD_EVENTSERIES_SYNC,
    uuid
  };
};

const receiveEventseriesSuccess = (uuid, data) => {
  return {
    type: RECEIVE_EVENTSERIES_SUCCESS,
    uuid,
    data
  };
};

const receiveEventseriesFailure = (uuid, error) => {
  return {
    type: RECEIVE_EVENTSERIES_FAILURE,
    uuid,
    error
  };
};

export const removeEventseries = (uuid) => {
  return {
    type: REMOVE_EVENTSERIES,
    uuid
  };
};

export const addEventseries = (uuid) => {
  return function (dispatch) {
    dispatch(addEventseriesSync(uuid));
    return fetchItem('eventseries', uuid)
      .then(eventseries => {
        dispatch(receiveEventseriesSuccess(uuid, eventseries));
        return eventseries;
      }).catch(errorObject => {
        dispatch(receiveEventseriesFailure(uuid, errorObject.toString()));
      });
  };
};

