# SwapeJs

SwapeJs is a lightweight micro-frontend javascript framework.

## v2

After 8 years with stable v0.3 it was about time to make this framework
more modern and up to date. So I decided to rewrite it from scratch.

## Setting up




## element

```javascript
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

## router

```javascript
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

### route and router

```javascript
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
