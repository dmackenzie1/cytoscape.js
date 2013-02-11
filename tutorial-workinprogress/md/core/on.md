## Examples

Bind to events that bubble up from elements matching the specified `nodes` selector:
```js
cy.on('click', 'nodes', { foo: 'bar' }, function(evt){
  console.log( evt.data.foo ); // 'bar'

  var node = this;
  console.log( 'clicked ' + node.id() );
});
```

Bind to all click events that the core receives:

```js
cy.on('click', function(event){
  // cyTarget holds a reference to the originator
  // of the event (core or element)
  var evtTarget = event.cyTarget;

  if( evtTarget === cy ){
  	console.log('click on background');
  } else {
    console.log('click on some element');
  }
});
```