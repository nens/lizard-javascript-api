import fetch from 'isomorphic-fetch';
// import forEach from 'lodash/forEach'

import {
  ADD_INTERSECTION_SYNC,
  RECEIVE_INTERSECTION,
  RECEIVE_INTERSECTION_ERROR,
  REMOVE_INTERSECTION,
  SET_INTERSECTION_SPACE_TIME,
  TOGGLE_INTERSECTION
} from '../constants/ActionTypes';

import { geomToWkt, baseUrl, paramsToQuery } from '../utils';

const getEndpointName = (dataType) => {
  switch (dataType) {
    case 'raster':
      return 'raster-aggregates';
    case 'eventseries':
      return 'events';
  }
};

const updateParamsForSpaceTime = (initialParams, spaceTime) => {
  const params = { ...initialParams };

  if (spaceTime.start && spaceTime.end) {
    params.start = spaceTime.start;
    params.end = spaceTime.end;
  } else if (spaceTime.time) {
    params.time = spaceTime.time;
  }
  if (spaceTime.geometry) {
    params.geom = geomToWkt(spaceTime.geometry);
    params.srs = 'EPSG:4326';
  }
  return params;
};

const updateParamsForDataType = (initialParams, dataType, typeId) => {
  const params = { ...initialParams };

  if (dataType === 'raster') {
    params.rasters = typeId;
  } else if (dataType === 'eventseries') {
    params.eventseries = typeId;
  }
  return params;
};

const fetchIntersection = (intersection) => {
  let params = {...intersection.params};
  let { spaceTime, dataType, typeId } = intersection;
  let url;

  params = updateParamsForSpaceTime(params, spaceTime);
  params = updateParamsForDataType(params, dataType, typeId);

  const query = paramsToQuery(params);

  // TODO: timeseries data is available under /timeseries/<uuid>, raster data
  // is available under /raster-aggregates/?raster=<uuid>.
  if (intersection.dataType === 'timeseries') {
    url = `${baseUrl}/api/v2/timeseries/${intersection.typeId}/?${query}`;
  } else {
    url = `${baseUrl}/api/v2/${getEndpointName(dataType)}/?${query}`;
  }

  // TODO: Why pass 'params' to server when same info is contained in the query
  // part of the URL? I think passing this is actually redundant, probably it's
  // only needed for POST requests, not GET? Discuss/read_moar...
  let request = new Request(url, {credentials: 'same-origin', params: params });

  return fetch(request).then(response => response.json());
};

const receiveIntersection = (id, payload) => {
  return {
    type: RECEIVE_INTERSECTION,
    id,
    payload
  };
};

const receiveIntersectionError = (id, payload) => {
  return {
    type: RECEIVE_INTERSECTION_ERROR,
    id,
    payload
  };
};

const update = (id, dispatch, getState) => {
  const intersection = getState().intersections[id];

  if (intersection.active) {
    return fetchIntersection(intersection).then(response => {
      dispatch(receiveIntersection(id, response));
      return response;
    });
  } else {
    return Promise.resolve();
  }
};

const addIntersectionSync = (id, dataType, intersection) => {
  return {
    type: ADD_INTERSECTION_SYNC,
    id,
    dataType,
    ...intersection
  };
};

export const addIntersection = (dataType, intersection) => {
  return function (dispatch, getState) {
    const id = Object.keys(getState().intersections).length;

    dispatch(addIntersectionSync(id, dataType, intersection));
    return update(id, dispatch, getState);
  };
};

export const removeIntersection = (id) => {
  return {
    type: REMOVE_INTERSECTION,
    id
  };
};

const toggleIntersectionSync = (id) => {
  return {
    type: TOGGLE_INTERSECTION,
    id
  };
};

const setIntersectionSpaceTimeSync = (id, spaceTime) => {
  return {
    type: SET_INTERSECTION_SPACE_TIME,
    id,
    spaceTime
  };
};

export const toggleIntersection = (id) => {
  return function (dispatch, getState) {
    dispatch(toggleIntersectionSync(id));
    return update(id, dispatch, getState);
  };
};

export const setIntersectionSpaceTime = (id, spaceTime) => {
  return function (dispatch, getState) {
    dispatch(setIntersectionSpaceTimeSync(id, spaceTime));
    return update(id, dispatch, getState);
  };
};
