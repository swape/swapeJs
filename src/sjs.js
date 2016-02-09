// sjs.js


var sjs = (function () {
  'use strict';

  var routes = [];
  var state = '';
  var hash = '';
  var startHashSign = '#/';
  var blnRoute = false; // we have a match
  var defalutRoute = false;
  var templateCache = {};
  var x = 0;

  //--- getting the dom elemnt
  function fastQuery(query, blnAll) {
    var n = query.split(' ')
      .length;
    var name = query.charAt(0);
    // getting all
    if (name === '#' && n === 1) {
      return document.getElementById(query.replace('#', ''));
    } else {
      return (blnAll) ? document.querySelectorAll(query) : document.querySelector(query);
    }
  }

  //--- getting one element
  function getElm(inValue, attr) {
    var elm = fastQuery(inValue);

    if (elm) {
      if (attr && typeof elm[attr] !== 'undefined') {
        return elm[attr];
      } else {
        return elm;
      }
    }
  }

  //--- getting all the elements
  function getAllElm(inValue, attr) {
    var elm = fastQuery(inValue, true);
    if (elm) {
      if (attr) {
        var out = [];
        if (elm.length > 0) {
          for (var x = 0; x < elm.length; x++) {
            if (elm[x]) {
              if (attr && elm[x] && typeof elm[x][attr] !== 'undefined' && elm[x][attr].trim() !== '') {
                out.push(elm[x][attr]);
              }
            }
          }
          return (out.length > 0) ? out : false;
        } else {
          return false;
        }
      } else {
        return elm;
      }

    }
  }

  //--- getting the right controller and template base on routes
  function doTheRoute() {
    var x = 0;
    //- showing the template and run the controller based on route
    if (routes && routes.length > 0) {
      for (x = 0; routes.length > x; x++) {
        if (routes[x].route === state) {
          runFromRoute(routes[x]);
          //- we found the route now setting this var so we dont look for the default route
          blnRoute = true;
        }
        // setting the default route
        if (routes[x].default) {
          defalutRoute = routes[x];
        }

      } //for

      // default route
      if (blnRoute === false && defalutRoute) {
        runFromRoute(defalutRoute);
      }
    }
  }

  //--- run controller and insert a template or templateUrl content into view
  function runFromRoute(inValue) {

    if (inValue.template) {
      view.innerHTML = inValue.template;
      runController(inValue);
    } else if (inValue.templateUrl) {
      // get it from cache if we have it
      if (templateCache[inValue.templateUrl]) {
        view.innerHTML = templateCache[inValue.templateUrl];
        runController(inValue);
      } else {
        // getting the external template from url
        getXhr('get', inValue.templateUrl)
          .then(function (data) {
            view.innerHTML = data;
            runController(inValue);
            templateCache[inValue.templateUrl] = data;
          });
      }


    }

  }

  //--- running the controller and check for new sjs-route links to bind click to
  function runController(inValue) {

    if (inValue.controller) {
      //check if any links in the new view needs to be controlled by our router
      var templateLinks = getAllElm('view [sjs-route]');
      checkForRouteLinks(templateLinks);
      inValue.controller();
    }
  }

  //--- format the hash based in inValue or get it from location.hash and set the state to the first hash
  function getHash(inValue) {
    //- finding the url
    hash = inValue || location.hash;
    if (hash !== '') {
      hash = hash.replace(startHashSign, '')
        .replace('#', '');
      hash = hash.split('/');
      if (hash.length > 0) {
        state = hash[0];
      }
    }
  }

  //--- setting the hash and chenge the location
  function setHash(inValue) {
    getHash(inValue);
    location.hash = inValue;
  }

  //--- bind the sjs-route links and setting the state and hash
  function attachRouterLinks(eventObj) {
    if (eventObj.target.attributes['sjs-route'] && eventObj.target.attributes['sjs-route'].value) {
      eventObj.preventDefault();
      state = eventObj.target.attributes['sjs-route'].value;
      setHash(state);
      doTheRoute();
    }
  }

  //--- looping through links to attach the listener
  function checkForRouteLinks(inValue) {
    //- bind the click on all links // TODO: refactor
    for (x = 0; inValue.length > x; x++) {
      inValue[x].addEventListener('click', attachRouterLinks);
    }
  }

  //--- do an XHR call
  function getXhr(method, url, data, headers) {
    // Return a new promise.
    return new Promise(function (resolve, reject) {
      // Do the usual XHR stuff
      var req = new XMLHttpRequest();
      method = method.toUpperCase();

      if (method !== 'POST') {
        var arrParameters = [],
          key;
        if (typeof data !== 'undefined' && data !== null) {
          url = (url.match(/\?/igm)) ? url + '&' : url + '?';
          for (key in data) {
            arrParameters.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
          }
          url = url + arrParameters.join('&');
        }
      }

      req.open(method, url);

      // header
      if (typeof headers !== 'undefined') {
        var header = '';
        for (header in headers) {
          req.setRequestHeader(header, headers[header]);
        }
      }

      req.onload = function () {
        if (req.status === 200) {
          resolve(req.response);
        } else {
          reject(Error(req.statusText));
        }
      };

      // Handle network errors
      req.onerror = function () {
        reject(Error('Network Error'));
      };

      if (method === 'POST') {
        // Make the request
        if (typeof data !== 'undefined' && data !== null) {
          req.send(JSON.stringify(data));
        }
      } else {
        req.send();
      }

    });
  }

  //--- goto another route from the script
  function gotoState(inValue) {
    setHash(inValue);
    doTheRoute();
  }

  /*
  getting ready
  */

  getHash();

  // getting all the links for view
  var links = getAllElm('[sjs-route]');
  checkForRouteLinks(links);

  var view = getElm('view');

  //window.onhashchange = doTheRoute;

  return {
    init: function () {
      doTheRoute();
    },
    route: function (appRoutes) {
      routes = appRoutes;
    },
    gotoState: gotoState,
    getState: function () {
      return state;
    },
    getHash: function () {
      return hash;
    },
    // getting one elm or attribute of one element
    get: getElm,
    // getting all elm or attributes of all elm
    getAll: getAllElm,
    // setting one or more value for elm
    set: function (inValue, attr, data) {
      var elm = fastQuery(inValue, true);

      if (elm && typeof elm !== 'undefined') {
        if (attr) {

          if (elm && elm.length > 0) {

            for (var x = 0; x < elm.length; x++) {
              if (elm[x]) {
                if (attr === 'class') {
                  elm[x].className = data;
                } else {
                  elm[x][attr] = data;
                }
              }
            }
          } else {
            if (attr === 'class') {
              elm.className = data;
            } else {
              elm.attr = data;
            }
          }

          return elm;
        }
      } else {
        return false;
      }
    },
    // adding a data to existing attr
    add: function (inValue, attr, data) {
      if (attr && data) {
        var elm = fastQuery(inValue, true);
        if (elm && typeof elm !== 'undefined') {
          if (elm.length > 0) {
            for (var x = 0; x < elm.length; x++) {
              if (elm[x]) {
                if (elm[x][attr]) {
                  elm[x][attr] = elm[x][attr] + ' ' + data;
                } else {
                  elm[x][attr] = data;
                }
              }
            }
            return elm;
          }
        }
      } else {
        return false;
      }

    },
    // remove attr or data
    remove: function (inValue, attr, data) {
      if (attr) {
        var elm = fastQuery(inValue, true);
        if (elm && typeof elm !== 'undefined') {
          if (elm.length > 0) {
            for (var x = 0; x < elm.length; x++) {
              //if the element excist
              if (elm[x]) {
                // if we have the given attr
                if (elm[x][attr]) {
                  // if we have the data, remove from that attribute
                  if (data) {
                    elm[x][attr] = elm[x][attr].replace(data, '')
                      .trim();
                  } else {
                    // if we do not have any data, remove the attribute itself
                    elm[x][attr] = null;
                    elm[x].removeAttribute(attr);
                  }
                }
              }
            }
            return elm;
          }
        }
      } else {
        // TODO: remove the element if we do not have attr or data

        return false;
      }

    },

    // xhr
    xhr: getXhr

  };

})();
