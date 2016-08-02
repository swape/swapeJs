# swapeJs

swapeJs is a lightweight javascript front-end framework.

## Setting up

First include the sjs script in your html `<script src="sjs.js"></script>`

## Old sjs

if you are looking for the old sjs version, then see here:

```
README_v0.1.MD
src/sjs_0.1.js
```

## element

```
// getting element object
var e = sjs.elm;
var elementObject = e.get('h1');

// getting multiple elements
var arrElm = e.get('.other', true);

or

var arrElm = e.getAll('.other');

// setting style to one or multiple elements
e.getAll('.other').setStyle('color', 'red');


// chaining more
e.get('.other', true).setStyle('color', 'red').setStyle('padding', '5px').setStyle('margin', '5px');

// using style value to set style to the element
e.get('.other').style.color = 'blue';

// setting class to all matched elements
e.getAll('p').setClass('someClass');

// adding class to all matched elements
e.getAll('p').addClass('someClass');

// remove a class from all matched elements
e.getAll('p').removeClass('someClass');
```

## xhr

```
var x = sjs.xhr;

// getting xhr data
x.get('./partial/part1.html').then(function(data) {
  console.log(data);
});

// posting xhr data
x.xhr('POST', './partial/part2.html', {
  x: 1,
  y: 2
}).then(function(data) {
  console.log(data);
});

// or

x.post('./partial/part2.html', {
  x: 1,
  y: 2
}).then(function(data) {
  console.log(data);
});
```

## router

```
// define a router
var r = sjs.router;

// add some route
r.add({
  path: '/',
  templateUrl: '/example/v0.3/partial/part2.html',
  name: 'home',
  controller: function() {
    console.info('I am the home controller');
  }
});

// chain more routes
r.add({
  path: '/about/*',
  template: '<b>This about page with some data (1) </b>',
  controller: function() {
    console.info('I am the about controller 1');
  }
}).add({
  path: '/about/*/edit',
  template: '<b>This about page with some data Edit</b>',
  controller: function() {
    console.info('I am the about controller 2');
  }
});
```

### route object

```
r.add([object]);

routeObject = {
  path: '/about', // matched url
  templateUrl: '/example/v0.3/partial/part2.html', // template to load (optional)
  view: 'other-view', // alternative view id (optional)
  controller: function() { // a controller to run after loading the template
    console.info('I am on this controller');
  }
};
```

- 'path' can contain _as a wildcard like /page/_/edit
- 'templateUrl' is a path from where to load the template (optional)
- 'template' is a string instead of templateUrl (optional).
- 'view' is an alternative view that can be declared like this:

  <sjs-view id="other-view">
  </sjs-view>

  otherwise the default view is used

  <sjs-view>
  </sjs-view>

  . you can also target a different view from a sjs-link attribute like this [Other](/other) otherwise [Other](/other) is going to target

  <sjs-view>
  </sjs-view>

  (optional)

- 'name' this is to call the route something so that you can use r.goto(routeName); (optional)
- 'handelbars' must be set to true if you want to use handelbars for templating and the controller return an object that handelbars can use.

### route init

```
r.init({mode: 'hash'});

or

r.init({mode: 'history'});
```

# examples

See the /example/v0.3 for all the examples
