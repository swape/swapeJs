# swapeJs
swapeJs is a lightweight javascript front end framework.

## setting up
First include the sjs script in your html
<script src="sjs.js"></script>

and then in your html place the view tag
<view>loading</view>

## Routes
Setting up routes.

```
    // define the homeController
    function homeController(){
      console.log('yes I am in the controller');
    }

    // setting up the home route
    sjs.route([
      {
        route: 'home',
        controller: homeController,
        template: 'I am the template',
        default: true
    }
    ]);

    // run the init function when everything is ready
    sjs.init();
```

route: defines the name of this route that is the same as the hash part of the url. [http://somewhere.com/#/home](http://somewhere.com/#/home) in this url the route is home.

controller: is the controller function attached to this route.

template: this is the inline template that is shown in view tag.

To change the route you can use attribute on a DOM object like this <a href="" sjs-route="home">Home<a>  sjs-route takes an argument and this is the same as the route/hash  so in this case by clicking on this link the state changes to  http://somewhere.com/#/home and the home controller gets executed after the template has been loaded to view tag.

But you can not use the href to change the url. [This link do not change the state](#/donotwork) Only sjs.route attribute can tell the sjs to change the route and run the controller and get the template/templateUrl.

The default argument tells the script to load this route if we do not have anything on the hash part of the url.

You can also change the route within the controller. Let's say you have to check some stuff and then based on some stuff you want to redirect the user to another url. Then you can use the sjs.gotoState function.

```
    sjs.gotoState('somewhere');
```

But be careful not to make a loop.

You can make several routes in sjs.route object. But only one of them can be the default

```
    sjs.route([
      {
        route: 'home',
        controller: homeController,
        template: 'I am the template',
        default: true
    },
    {
      route: 'settings',
      controller: settingsController,
      template: 'I am the settings controller',
    }
    ]);
```

You can also use templateUrl instead of template to load the html file from the server.

```
    {
      route: 'settings',
      controller: settingsController,
      templateUrl: 'partials/settings.html',
    }
```

## API
### sjs.route([{}]); // takes array of objects
Route object values:
- route: name of the route.
- controller: the function controller to run when this route is entered.
- template: inline template string.
- templateUrl: path to html template.

### sjs.gotoState(arg);
Change the state by passing the name of the argument to sjs.gotoState.

### sjs.init();
Run this when you are ready to run the app.

//TODO: make api doc for the rest of the system
