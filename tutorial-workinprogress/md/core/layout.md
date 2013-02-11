## Options for included layouts

Several layouts are included with Cytoscape.js by default, and their options are described here with the default values specified.  Note that you must set `options.name` to the name of the layout to specify which one you want to run.

*The `random` layout:*
```js
options = {
	ready: undefined, // callback on layoutready
	stop: undefined, // callback on layoutstop
	fit: true // whether to fit to viewport
};
```

*The `preset` layout puts nodes in the positions you specify manually:*
```js
options = {
	fit: true, // whether to fit to viewport
	ready: undefined, // callback on layoutready
	stop: undefined, // callback on layoutstop
	positions: undefined, // map of (node id) => (position obj)
	zoom: undefined, // the zoom level to set (prob want fit = false if set)
	pan: undefined // the pan level to set (prob want fit = false if set)
};
```

*The `grid` layout puts nodes in a well-spaced grid:*
```js
options = {
	fit: true, // whether to fit the viewport to the graph
	rows: undefined, // force num of rows in the grid
	columns: undefined, // force num of cols in the grid
	ready: undefined, // callback on layoutready
	stop: undefined // callback on layoutstop
};
```

*The `arbor` layout uses a force-directed simulation:*
```js
options = {
	liveUpdate: true, // whether to show the layout as it's running
	ready: undefined, // callback on layoutready 
	stop: undefined, // callback on layoutstop
	maxSimulationTime: 4000, // max length in ms to run the layout
	fit: true, // fit to viewport
	padding: [ 50, 50, 50, 50 ], // top, right, bottom, left
	ungrabifyWhileSimulating: true, // so you can't drag nodes during layout

	// forces used by arbor (use arbor default on undefined)
	repulsion: undefined,
	stiffness: undefined,
	friction: undefined,
	gravity: true,
	fps: undefined,
	precision: undefined,

	// static numbers or functions that dynamically return what these
	// values should be for each element
	nodeMass: undefined, 
	edgeLength: undefined,

	stepSize: 1, // size of timestep in simulation

	// function that returns true if the system is stable to indicate
	// that the layout can be stopped
	stableEnergy: function( energy ){
		var e = energy; 
		return (e.max <= 0.5) || (e.mean <= 0.3);
	}
};
```

NB: You must reference the version of `arbor.js` included with Cytoscape.js in the `<head>` of your HTML document:

```html
<head>
	...

	<script src="arbor.js"></script>

	...
</head>
```

Arbor does some automatic path finding because it uses web workers, and so it must be included this way.  Therefore, you can not combine `arbor.js` with your other JavaScript files &mdash; as you probably would as a part of the minification of the scripts in your webapp.

*The `null` layout puts all nodes at (0, 0):*
```js
// The null layout has no options.
```

## Examples

```js
cy.layout({ name: 'grid' });
```