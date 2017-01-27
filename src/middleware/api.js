import { camelizeKeys } from 'humps';

const API_ROOT = (() => {
  let absoluteBase = 'http://demo.lizard.net';

  if (typeof window !== 'undefined') {
    const protocol = window && window.location.protocol;
    const hostname = window && window.location.hostname;
    const port = window && window.location.port;

    absoluteBase = `${protocol}//${hostname}:${port}`;
  }
  return absoluteBase;
})();

const getPlural = (entity) => {
  switch (entity) {
    case 'eventseries':
      return entity;
    case 'timeseries':
      return entity;
    default:
      return entity + 's';
  }
};

// Fetches an API response.
const callApi = (entity, id) => {
  const plural = getPlural(entity);
  const url = `${API_ROOT}/api/v2/${plural}/${id}`;
  const request = new Request(url, { credentials: 'same-origin' });

  return fetch(request).then(response => {
    return response.json().then(json => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return camelizeKeys(json);
    });
  });
};

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API');

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API];

  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  const { entity, id, types } = callAPI;

  if (typeof entity !== 'string') {
    throw new Error('Specify a string entity URL.');
  }
  if (id === undefined) {
    throw new Error(`Specify an id of ${entity} to fetch.`);
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data);

    delete finalAction[CALL_API];
    return finalAction;
  };

  const [ requestType, successType, failureType ] = types;

  next(actionWith({ type: requestType, entity, id }));
  console.log(store.getState());
  return callApi(entity, id).then(
    (response) => {
      next(actionWith({
        type: successType,
        entity,
        id,
        data: response
      }));
      return response;
    },
    (error) => {
      const e = error.message || 'Something bad happened';

      next(actionWith({
        type: failureType,
        entity,
        id,
        error: e
      }));
      return Promise.reject(new Error(e));
    }
  );
};
