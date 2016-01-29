/* globals sjs */
(function () {
  'use strict';


  //-- controllers
  function annetController() {
    // do something with the dom when this template is loaded
    sjs.set('#myb', 'class', 'blue');

  }

  function noeController() {

  }

  function tullController() {
    console.log('jeg er fra tull controller');
  }

  function redController() {
    sjs.gotoState('noe');
  }


  // setting up the route
  sjs.route([
    {
      route: 'noe',
      controller: noeController,
      template: 'Jeg er noe'
  }, {
      route: 'annet',
      controller: annetController,
      template: 'jeg er template <b id="myb">fra</b> annet. og jeg har lenke til <a href="" sjs-route="noe">noe lenka<a>',
      default: true
  },
    {
      route: 'tull',
      controller: tullController,
      templateUrl: 'tull.html'
  },
    {
      route: 'red',
      controller: redController,
      template: 'I am still on red'
}
]);

  // init this when you are ready to get the content and show content
  sjs.init();


  //python -m SimpleHTTPServer 8000


})();
