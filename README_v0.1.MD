# swapeJs
swapeJs is a lightweight javascript front-end framework.

## Setting up
First include the sjs script in your html `<script src="sjs.js"></script>`

and then in your html place the view tag `<view>loading</view>`

## Routes
Setting up routes.

```
    // define the homeController
    function homeController(){
      console.log('yes I am in the controller');
    }

    // setting up the home route
    sjs.objRoutes.routes = [
      {
        route: 'home',
        controller: homeController,
        template: 'I am the template',
        default: true
    }
    ];

    // run the init function when everything is ready
    sjs.init();
```

route: defines the name of this route that is the same as the hash part of the url. `http://somewhere.com/#/home` in this url the route is home.

controller: is the controller function attached to this route.

template: this is the inline template that is shown in view tag.

To change the route you can use attribute on a DOM object like this `<a href="" sjs-route="home">Home<a>`  sjs-route takes an argument and this is the same as the route/hash  so in this case by clicking on this link the state changes to  `http://somewhere.com/#/home` and the home controller gets executed after the template has been loaded to view tag.

But you can not use the href to change the url. `<a href="#/home">Do not work</a>` Only sjs.route attribute can tell the sjs to change the route and run the controller and get the template/templateUrl.

The default argument tells the script to load this route if we do not have anything on the hash part of the url.

You can also change the route within the controller. Let's say you have to check some stuff and then based on some stuff you want to redirect the user to another url. Then you can use the sjs.gotoState function.

```
    sjs.gotoState('somewhere');
```

But be careful not to make a loop.

You can make several routes in sjs.route object. But only one of them can be the default

```
    sjs.objRoutes.routes = [
      {
        route: 'home',
        controller: homeController,
        template: 'I am the template',
        default: true
    },{
      route: 'settings',
      controller: settingsController,
      template: 'I am the settings controller'
    }
    ];
```

You can also use templateUrl instead of template to load the html file from the server.

```
    {
      route: 'settings',
      controller: settingsController,
      templateUrl: 'partials/settings.html'
    }
```

In templates you can include other templates by using sjs-template like this:

```
<div sjs-include="templates/partial.html"></div>
```

This is going to include the html from templates/partial.html into that div.

The active link with sjs-route attribute get the active class when they are active.

## API
### sjs.init()
Initializes the application.

### sjs.objRoutes.routes = [{ route, controller, template, templateUrl, *default*}]
Takes an array of router objects.
- **route**: [string] router name
- **controller**: [function] takes a controller function
- **template**: [string] inline template string
- **templateUrl**: [string] path to HTML template
- **default**: [boolean, optional, _default = false_] set as default route.

### sjs.gotoState(route)
Changes the state to the route name that is passed.
- **route**: [string] router name

### sjs.get(element, *attr*)
Fetching one element _or_ attribute of an element.
- **element**: [string] element id or HTML tag
- **attr**: [string, optional] attribute name

Returns the DOM element. If specific attr is provided, then it returns its value.

### sjs.getAll(element, *attr*)
Fetching all elements that match _element_ arg.
- **element**: [string] element id or HTML tag
- **attr**: [string, optional] attribute name

Returns an array with the DOM elements. If specific attr is provided, then it returns it in an array.

### sjs.set(element, attr, data)
Sets one or more attribute(s) of an element or tag.
- **element**: [string] element if or HTML tag _(be careful when using tags)_
- **attr**: [string] attribute (name) to set
- **data**: [string] data to be set

### sjs.add(element, attr, data)
Adding data to exsisting attr.
- **element**: [string] element if or HTML tag
- **attr**: [string] attribute (name) to set
- **data**: [string] data to be set

### sjs.remove(element, attr, data)
Removes data from attr. If there is not _data_, the attribute is instead removed.
- **element**: [string] element if or HTML tag
- **attr**: [string] attribute (name) to set
- **data**: [string] data to be set
