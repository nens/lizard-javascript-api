import 'es6-promise';
import 'isomorphic-fetch';

import configureStore from './store/configureStore';
import * as actions from './actions';

/**
 * in ES2015:
 *
 * import Lizard, {actions} from 'Lizard';
 *
 * const lizard = Lizard();
 *
 *
 * In node:
 *
 * var Lizard = require('Lizard').default();
 * var actions = require('Lizard').actions;
 *
 *
 * In UMD:
 *
 * var Lizard = window.Lizard.default();
 * var actions = window.Lizard.actions;
 *
 *
 * Everywhere:
 *
 * lizard.dispatch(actions.getAsset('pumpstation', 4));
 * lizard.subscribe(function () { console.log(lizard.getState()) });
 */
export {actions as actions};
export default configureStore;
