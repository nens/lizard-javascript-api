import chai from 'chai';
import nock from 'nock';
import fetch from 'isomorphic-fetch';

import Lizard, { actions } from '../src';
import { baseUrl, len } from '../src/utils';
import { equal, fock } from './test-utils'

describe('Eventseries', () => {

  afterEach(() => {
    nock.cleanAll();
  });

  describe('When adding an eventseries', () => {

    const UUID = 'e89e83d8-f356-4eb9-98c8-8adc7d6582e9';
    const geom = { type: 'Point', coordinates: [0, 1] };

    it('should be added to the store async', () => {

      const store = Lizard();
      const expected = {
        'e89e83d8-f356-4eb9-98c8-8adc7d6582e9': [
          {
            id: 1,
            type: "Feature",
            geometry: geom,
            properties: { value: 303 }
          },
          {
            id: 2,
            type: "Feature",
            geometry: geom,
            properties: { value: 808 }
          }
        ]
      };

      fock(expected);

      const whenEventseriesAdded = store.dispatch(actions.addEventseries(UUID));
      // When adding an eventseries, the (eventseries) store gets updated
      // in-sync with a single key-value pair: key=UUID, value=undefined
      equal(1, len(store.getState().eventseries));
      equal({}, store.getState().eventseries[UUID]);

      whenEventseriesAdded.then(() => {
        return equal(expected, store.getState().eventseries)
      });
    });

    it('should be removed from the store in-sync', () => {

      const initState = {
        timeseries: {},
        assets: {},
        rasters: {},
        intersections: {},
        eventseries: {
          'e89e83d8-f356-4eb9-98c8-8adc7d6582e9': [
            {
              id: 1,
              type: "Feature",
              geometry: geom,
              properties: { value: 303 }
            },
            {
              id: 2,
              type: "Feature",
              geometry: geom,
              properties: { value: 808 }
            }
          ]
        }
      };

      const store = Lizard(initState);
      equal(1, len(store.getState().eventseries));
      store.dispatch(actions.removeEventseries(UUID));
      equal(0, len(store.getState().eventseries));
    });
  });
});