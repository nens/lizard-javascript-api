import {
  ADD_EVENTSERIES_SYNC,
  RECEIVE_EVENTSERIES_SUCCESS,
  RECEIVE_EVENTSERIES_FAILURE,
  REMOVE_EVENTSERIES
} from '../constants/ActionTypes';

import { CALL_API } from '../middleware/api';
import { handleReceiveError } from '../utils';

// Fetches a single event series from Lizard API.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchEventseries = (id) => ({
  [CALL_API]: {
    types: [
      ADD_EVENTSERIES_SYNC,
      RECEIVE_EVENTSERIES_SUCCESS,
      RECEIVE_EVENTSERIES_FAILURE
    ],
    entity: 'eventseries',
    id
  }
});

export const removeEventseries = (uuid) => {
  return {
    type: REMOVE_EVENTSERIES,
    uuid
  };
};

export const addEventseries = (uuid) => {
  return function (dispatch) {
    return dispatch(fetchEventseries(uuid))
    .catch(e => {
      handleReceiveError(e);
    });
  };
};
