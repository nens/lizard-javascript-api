
# Lizard JavaScript API

The goto library library for JavaScript clients to query and store Lizard web API data in a standardized and explicit way.

In ES2015:
```js
import Lizard, {actions} from 'Lizard';
const lizard = Lizard();
```

In node:
```js
var Lizard = require('Lizard').default();
var actions = require('Lizard').actions;
```

In ES5 load `lib/Lizard.min.js` with a script tag and:
```js
var Lizard = window.Lizard.default();
var actions = window.Lizard.actions;
```

Everywhere:
```js
lizard.subscribe(function () { console.log(lizard.getState()) });
lizard.dispatch(actions.getAsset('pumpstation', 6853));
```

At any time `lizard.getState()` returns a new object:

```json
assets: {},
eventseries: {},
rasters: {},
timeseries: {},
intersections: {}
```

Assets, eventseries, rasters and timeseries contain metadata and intersections contain eventseries, timeseries and raster data for time and space intersections.


##Usage:

Lizard-API is a [Redux store](http://redux.js.org/) and as such follows the documentation of Redux. To use lizard-API you do not need any prior knowledge of Redux, though if you are developing a complex application or are already using redux: make sure to read the advanced section on redux and know how to combine your state with lizard.

Import Lizard by following the example above:
```js
import Lizard, {actions} from 'Lizard-API';
const lizard = Lizard();
```

Now you have a Lizard `store` and functions in `actions` to create actions which can be dispatched to the store.

_Let's add a pumpstation_

```js
const addPumpstation = actions.getAsset('pumpstation', 6853);
```

Where the first argument is the name of the Lizard entity you want to add and
the second is the id of the entity, corresponding to `<lizard>/api/v2/pumpstations/6853`.

To perform this action:
```js
const whenLizardPumpstationAdded = lizard.dispatch(addPumpstation);
```

The action `addPumpstation` adds the available data to the store synchronously:

```js
 lizard.getState().assets
```

Returns:

```js
{
  pumpstation$6853: {entity: 'pumpstation', id: 6853}
}
```

It fetches the pumpstation data from the lizard server and returns a promise. To be informed when the request finishes, you can subscribe to changes to the store with a callback:

```js
const lizardCallback => (state) { 'your entry point to perform your app logic' };

const unsubscribe = lizard.subscribe(lizardCallback)
```

Or by binding to the promise returned by the dispatch of asynchronous actions:
```js
const showPumpstation => (pumpstationResponse) { 'your entry point to show the user a pumpstation' };

const apologizeToUser => (error) { 'No pumpstation for you my friend' };

whenLizardPumpstationAdded.then(showPumpstation, apologizeToUser);   
```

Note: When you subscribe to lizard, you subscribe to all changes to the store. So when calling `addPumpstation` your callback will be called at least twice. To stop listening to lizard changes, call the returned function `unsubscribe()`.

_Timeseries_

In lizard, timeseries are connected to assets. For instance, pumpstation 6853 might have two connected timeseries, containing the measured water level on the polder and canal side of the station.

Dispatching the action `addPumpstation` does three things: it adds an entry in `assets`, it fills that entry with the asset definition from the server and it creates an entry in timeseries for every connected timeseries. So

```js
whenLizardPumpstationAdded.then(() => lizard.getState());
```

Returns:
```js
{
  assets: {
    pumpstation$6853: {
      entity: 'pumpstation',
      id: 6853
      code: 'KGM-A-368',
      name: 'De Waakzaamheid',
      geometry: {
          type: 'Point',
          coordinates: [
              4.895586999360215,
              52.783234489793195,
              0.0
          ]
      }
    },
    ...
  }},
  eventseries: {},
  rasters: {},
  timeseries: {
    'e0e59d70-8cc8-45f0-9748-b6b627991e3c': {
      parameter: 'Water level',
      unit: 'm',
      asset: { entity: 'pumpstation', id: 6853 },
      location: 'Polder side',
      ...
    },
    '2cfd26ea-d126-4775-aa3c-e8df3efb3890': {
      parameter: 'Water level',
      unit: 'm',
      asset: { entity: 'pumpstation', id: 6853 },
      location: 'Canal side',
      ...
    }
  }
}
```

_Intersections_

When you want to show a chart of the polder side water level your app needs to dispatch an `addIntersection` action. An intersection with a timeseries should contain the timeseries `id` and optionally a time interval you are interested in plus any additional parameters you want to include in the request:

```js
let whenIntersectionIsAdded = lizard.dispatch(actions.addIntersection('timeseries', {
  id: 'e0e59d70-8cc8-45f0-9748-b6b627991e3c',
  params: {min_points: 300}
}))
```

By default intersections are not active and have no specified start and end. Intersections can be added with `active: true` and a `spaceTime` object or can be changed by dispatching an action:

```js
whenIntersectionIsAdded = lizard.dispatch(actions.setIntersectionSpaceTime('0', {
  start: 1356998400000,
  end: 1482035400000
}));
whenIntersectionIsAdded = lizard.dispatch(actions.toggleIntersection('0'));
```

Where `0` is the intersection's key in `lizard.getState().intersections`. Actions to toggle, or update intersections will fetch timeseries data and return a promise:

```js
whenIntersectionIsAdded.then(() => lizard.getState());
```
Returns:

```js
...
intersections: {
  0: {
    type: 'timeseries';
    id: 'e0e59d70-8cc8-45f0-9748-b6b627991e3c',
    spaceTime: {
      start: 1356998400000,
      end: 1482035400000
    },
    actvie: true,
    params: {min_points: 300},
    events: [
      {timestamp: 1356998403600, value: 7},
      {timestamp: 1356998407200, value: 4},
      ...
    ]
  }
}
```
Note: the Lizard store contains timeseries metadata in timeseries and timeseries data in intersections. You do not need to have a timeseries metadata object for an intersection.

To read about `min_points` and other parameters you may include to format timeseries data, go to the [lizard REST api documentation](https://demo.lizard.net/doc/api.html#timeseries/).

# Advanced: using redux
If your app is using Redux or you want to use redux, need to proceed with some caution not to violate Redux principle of having only one source of truth in you app and thus only store. Therefore, when ininitializing Lizard, pass your app's reducers as the second argument:

```js
const myAppEntities = {
  entityName: entityReducer
}

const store = Lizard({}, myAppEntities);
```

To initialize the store with preloaded data, for instance to perform server side hydration, use the first argument:

```js
const store = Lizard({
  assets: {
    pupstation$123: {
      entity: 'pumpstation',
      id: 123,
      name: 'You got to stay hydrated'
    }
  }
});
```

# A note on map tiles
Lizard JavaScript API is meant to query and store Lizard resources in JSON. Lizard also makes assets and rasters available as tiled map services through the TMS and WMS protocol. To use these resources in a browser you should use map libraries such as [Leaflet](http://leafletjs.com/) or [Openlayers](https://openlayers.org/).

TODO: this route is very implicit, how are outsiders supposed to find out how this works?

# Development
The generated project includes a development server on port `8080` which will reload a rebuild version of the library into the browser whenever you change source code. To start the server and run the test with watch function, run:

```bash
$ npm start
```

To build for production, this command will run the tests and output optimized production code in lib/Lizard.js:

```bash
$ npm build
```

To run the tests once:
```bash
$ npm test
```

Note: `npm start` creates a development version of the library in memory, the version on disk in `lib/` is not automatically updated.

TODO: the tests run continuously but do not have access to webpacks build version of the library in memory. Therefore the test import `src/`. This is bad practice and something we should fix.

Developer checklist:
- [ ] Fork/Clone this repo.
- [ ] Add constants/actions/reducers.
- [ ] Document new functionality.
- [ ] Test your code using Chai (preferably include a test with the build library).
- [ ] Lint your code with eslint rules.
- [ ] Create an atomic commit with [standard-version commit guidelines](https://github.com/conventional-changelog/standard-version#commit-message-convention-at-a-glance). Only use `feat(new-feat)` when making the library compliant with a new API version. So the major version of this library always matches the web api versions.
- [ ] Submit a pull request.

## TODO:
As of to date it is only a quarter done.

- [ ] Test all actions. Currently some action dispatchers and some reducers are tested. We should write more integration-like tests which read like documentation and dispatch every public action possible.
- [ ] Remove all timeseries of asset when removing asset.
- [ ] Remove all intersections when raster/eventeries/timeseries are removed.
- [ ] Include eventseries.
- [ ] Check user input. Currently an action payload is passed all the way through without ever checking what is inside. Throw errors.
- [ ] Throw errors and call error callbacks when request goes bad or response is malformed.
- [ ] Cancel requests when no longer relevant.
- [ ] Store server responses in a consistent manner.
- [ ] Include buck trap for releases.
- [ ] Use documentation generator.
- [ ] Use library in apps.
- [ ] Create demo page.
- [ ] Create documentation for all actions.
- [ ] Check for consistent isLoading flags, and document intended use.
- [ ] Include caching.
