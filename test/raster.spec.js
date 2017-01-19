import nock from 'nock';
import omit from 'lodash/omit';

import { baseUrl } from '../src/utils';
import Lizard, { actions } from '../src';
import { equal, unequal, fock } from './test-utils';

describe('Rasters', () => {

  afterEach(() => {
    nock.cleanAll();
  });

  const ID = 'e4g5ds6';
  const response = { name: 'Elevation' };

  describe('When adding a raster', () => {

    fock(response);
    const store = Lizard();
    const whenRasterAdded = store.dispatch(actions.addRaster(ID));

    it('creates the state.rasters[id] object (in-sync)', () => {
      equal(store.getState().rasters.hasOwnProperty(ID), true);
      equal(store.getState().rasters.error, false);
    });
  });

  describe('When adding a raster with an correct ID', () => {

    fock(response);
    const store = Lizard();
    const whenRasterAdded = store.dispatch(actions.addRaster(ID));

    it('fetches raster data (a-sync)', () => {
      return whenRasterAdded
        .then(() => { equal(store.getState().rasters[ID], response) });
    });

    it('does not raise an error (a-sync)', () => {
      return whenRasterAdded
        .then(() => { equal(store.getState().rasters.error, false) });
    })
  });

  // describe('When adding a raster with an unknown ID', () => {
  //   // TODO..
  //   it('does not fetch raster data (a-sync) ...WIP', () => {

  //   });
  // });

  describe('When having rasters', () => {

    const initialRasters = {
      'e4g5ds6': response,
      'otherRaster': { name: 'remove me' },
      'error': false
    };
    const store = Lizard({ rasters: initialRasters });
    // store.rasters = initialRasters;

    it('is possible to delete a specific one (in-sync)', () => {
      store.dispatch(actions.removeRaster('otherRaster'));
      equal(store.getState().rasters, omit(initialRasters, 'otherRaster'));
    });
  });
});
