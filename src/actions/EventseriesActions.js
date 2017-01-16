import fetch from 'isomorphic-fetch';

import {
  RECEIVE_EVENTSERIES,
  REMOVE_EVENTSERIES,
  ADD_EVENTSERIES_SYNC
} from '../constants/ActionTypes';

import { baseUrl } from '../utils';

const _fetchEventseries = (uuid) => {
  const request = new Request(`${baseUrl}/api/v2/eventseries/${uuid}/`, {
    credentials: 'same-origin'
  });

  return fetch(request).then(response => {
    return response.json();
  });
};

const _receiveEventseries = (uuid, apiResponse) => {
  return {
    type: RECEIVE_EVENTSERIES,
    uuid,
    ...apiResponse
  };
};

const addEventseriesSync = (uuid) => {
  return {
    type: ADD_EVENTSERIES_SYNC,
    uuid
  };

};

export const addEventseries = (uuid) => {
  return function (dispatch) {
    dispatch(addEventseriesSync(uuid));
    return _fetchEventseries(uuid).then(apiResponse => {
      dispatch(_receiveEventseries(uuid, apiResponse));
    });
  };
};

export const removeEventseries = (uuid) => {
  return {
    type: REMOVE_EVENTSERIES,
    uuid
  };
};

