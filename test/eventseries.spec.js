import nock from 'nock';
import fetch from 'isomorphic-fetch';
import size from 'lodash/size';
import omit from 'lodash/omit';

import Lizard, { actions } from '../src';
import { baseUrl } from '../src/utils';
import { equal, unequal, fock } from './test-utils';

describe('Eventseries', () => {

  afterEach(() => {
    nock.cleanAll();
  });

  describe('When adding an eventseries', () => {

    const UUID = 'e89e83d8-f356-4eb9-98c8-8adc7d6582e9';

    const store = Lizard();
    const response = {
      name: 'alarmen',
      color: '#ABCDEF'
    };

    equal(size(store.getState().eventseries), 0);

    fock({ ...response });
    store.dispatch(actions.addEventseries(UUID));

    it('should initialize the state.eventseries.error if needed', () => {
      equal(store.getState().eventseries.error, false);
    });

    it('should initialize the state.eventseries[uuid] object correctly', () => {
      equal(store.getState().eventseries.hasOwnProperty(UUID), true);
      unequal(store.getState().eventseries[UUID], undefined);
    });
  });

  describe('When adding an eventseries with correct UUID', () => {

    const UUID = 'e89e83d8-f356-4eb9-98c8-8adc7d6582e9';

    it('should get it\'s data in state.eventseries (a-sync)', () => {

      const store = Lizard();
      const response = {
        name: 'alarmen',
        color: '#ABCDEF'
      };

      fock({ ...response });

      equal(size(store.getState().eventseries), 0);

      const whenEventseriesAdded = store.dispatch(actions.addEventseries(UUID));

      equal(size(store.getState().eventseries), 2);
      equal(store.getState().eventseries.error, false);
      equal(store.getState().eventseries[UUID], {});

      whenEventseriesAdded.then(() => {
        equal(store.getState().eventseries[UUID], response);
      });
    });

    it('should be removable from the store in-sync (in-sync)', () => {

      const initState = {
        timeseries: {},
        assets: {},
        rasters: {},
        intersections: {},
        eventseries: {
          'error': false,
          'e89e83d8-f356-4eb9-98c8-8adc7d6582e9': {
            name: 'alarmen',
            color: '#ABCDEF'
          }
        }
      };

      const store = Lizard(initState);
      store.dispatch(actions.removeEventseries(UUID));
      equal(store.getState().eventseries.hasOwnProperty(UUID), false);
      equal(store.getState().eventseries.hasOwnProperty('error'), true);
    });
  });

  describe('When adding an eventseries with unknown UUID', () => {

    const store = Lizard();
    const response = { message: 'Eventseries not found.' };
    const UNKNOWN_UUID = 'f82e83e8-f353-44b9-98cd-8adc7d116ee9';

    fock({ ...response }, 404);

    const whenEventseriesAdded = store.dispatch(actions.addEventseries(
      UNKNOWN_UUID));

    equal(size(store.getState().eventseries), 2);
    equal(store.getState().eventseries.error, false);
    equal(store.getState().eventseries[UNKNOWN_UUID], {});

    it('does not receive eventseries metadata from the server (a-sync)', () => {
      return whenEventseriesAdded.then(() => {
        equal(store.getState().eventseries[UNKNOWN_UUID], {});
      });
    });

    it('updates state.eventseries to show there was an error (a-sync)', () => {
      return whenEventseriesAdded.then(() => {
        equal(typeof store.getState().eventseries.error, typeof '');
      });
    });
  });
});