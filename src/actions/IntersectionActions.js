import {
  ADD_INTERSECTION_SYNC,
  RECIEVE_INTERSECTION,
  REMOVE_INTERSECTION,
  SET_INTERSECTION_SPACE_TIME,
  TOGGLE_INTERSECTION
} from '../constants/ActionTypes';

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

  let plural = intersection.dataType === 'timeseries' ?
  'timeseries' :
  intersection.type + 's';

  // TODO: we don't need the following crap, but raster data is different from
  // timeseries, is different from eventseries.
  if (intersection.dataType === 'raster') {
    plural = 'raster-aggregates';
    params.rasters = intersection.typeId;
  }

  const esc = encodeURIComponent;

  const query = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');

  let request;

  // TODO: timeseries data is available under /timeseries/<uuid>, raster data
  // is available under /raster-aggregates/?raster=<uuid>.
  if (intersection.dataType === 'raster') {
    request = new Request(`api/v2/${plural}/?${query}`, {
      credentials: 'same-origin',
      params: params
    });
  } else {
    request = new Request(`api/v2/${plural}/${intersection.typeId}/?${query}`, {
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

const update = (id, dispatch, getState) => {
  const intersection = getState().intersections[id];

  if (intersection.active) {
    return fetchIntersection(intersection).then(response => {
      dispatch(recieveIntersection(id, response));
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

export const setGeometryToIntersection = (index, geometry) => {

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
