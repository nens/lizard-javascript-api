import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../src/actions/RasterActions';
import * as types from '../src/constants/ActionTypes';
import nock from 'nock';
import chai from 'chai';

chai.expect();

const expect = chai.expect;

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

let store;

describe('Raster actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });
  describe('When adding a raster', () => {
    const id = 'e4g5ds6';

    let expectedAction;

    nock('raster')
      .get(`/${id}`)
      .reply(200, { body: { name: 'Elevation' }});
    store = mockStore({ raster: [] });
    let whenRasterAdded = store.dispatch(actions.addRaster(id));

    it('creates ADD_RASTER_SYNC synchronous when adding a raster', () => {
      expectedAction = {
        type: types.ADD_RASTER_SYNC,
        id
      };
      expect(store.getActions()[0]).to.deep.equal(expectedAction);
    });
    it('creates RECIEVE_RASTER when fetching todos has been done', () => {
      expectedAction = {
        type: types.RECIEVE_RASTER,
        data: { name: 'Elevation' }
      };
      const store = mockStore({ raster: {} });

      whenRasterAdded
        .then(() => { // return of async actions
          expect(store.getActions()[1]).toEqual(expectedAction);
        });
    });

  });
});
