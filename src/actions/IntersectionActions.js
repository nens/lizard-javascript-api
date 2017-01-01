import {
  ADD_INTERSECTION_SYNC,
  RECIEVE_INTERSECTION,
  REMOVE_INTERSECTION,
  SET_INTERSECTION_SPACE_TIME,
  TOGGLE_INTERSECTION
} from '../constants/ActionTypes';

import 'babel-polyfill';
import { geomToWkt } from '../utils';

const fetchIntersection = (intersection) => {

  const params = {...intersection.params};

  if (intersection.spaceTime.start && intersection.spaceTime.end) {
    params.start = intersection.spaceTime.start;
    params.end = intersection.spaceTime.end;
  } else if (intersection.spaceTime.time) {
    params.time = intersection.spaceTime.time;
  }
  if (intersection.spaceTime.geometry) {
    params.geom = geomToWkt(intersection.spaceTime.geometry);
    params.srs = 'EPSG:4326';
  }

  let plural = intersection.type === 'timeseries' ?
  'timeseries' :
  intersection.type + 's';

  // TODO: we don't need the following crap, but raster data is different from
  // timeseries, is different from eventseries.
  if (intersection.type === 'raster') {
    plural = 'raster-aggregates';
    params.rasters = intersection.id;
  }

  const esc = encodeURIComponent;

  const query = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');

  let request;

  // TODO: timeseries data is available under /timeseries/<uuid>, raster data
  // is available under /raster-aggregates/?raster=<uuid>.
  if (intersection.type === 'raster') {
    request = new Request(`api/v2/${plural}/?${query}`, {
      credentials: 'same-origin',
      params: params
    });
  } else {
    request = new Request(`api/v2/${plural}/${intersection.id}/?${query}`, {
      credentials: 'same-origin',
      params: params
    });
  }

  return fetch(request).then(response => response.json());
};

const recieveIntersection = (id, data) => {
  return {
    type: RECIEVE_INTERSECTION,
    id,
    data
  };
};

const update = (index, dispatch, getState) => {
  const intersection = getState().intersections[index];

  if (intersection.active) {
    return fetchIntersection(intersection, intersection).then(response => {
      dispatch(recieveIntersection(intersection.id, response));
      return response;
    });
  } else {
    return Promise.resolve();
  }
};

const addIntersectionSync = (dataType, intersection) => {
  return {
    type: ADD_INTERSECTION_SYNC,
    dataType,
    ...intersection
  };
};

export const addIntersection = (dataType, intersection) => {
  return function (dispatch, getState) {
    dispatch(addIntersectionSync(dataType, intersection));
    const index = getState().intersections.length - 1;

    return update(index, dispatch, getState);
  };
};

export const removeIntersection = (index) => {
  return {
    type: REMOVE_INTERSECTION,
    index
  };
};

export const setGeometryToIntersection = (index, geometry) => {

};

const toggleIntersectionSync = (index) => {
  return {
    type: TOGGLE_INTERSECTION,
    index: index
  };
};

const setIntersectionSpaceTimeSync = (index, spaceTime) => {
  return {
    type: SET_INTERSECTION_SPACE_TIME,
    index,
    spaceTime
  };
};

export const toggleIntersection = (index) => {
  return function (dispatch, getState) {
    dispatch(toggleIntersectionSync(index));
    return update(index, dispatch, getState);
  };
};

export const setIntersectionSpaceTime = (index, spaceTime) => {
  return function (dispatch, getState) {
    dispatch(setIntersectionSpaceTimeSync(index, spaceTime));
    return update(index, dispatch, getState);
  };
};
