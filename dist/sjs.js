'use strict';

var sjs = function () {

	// prototyping functions for element object
	function protoTypeThis(obj) {
		if (obj && typeof obj !== 'undefined') {

			// adding a setStyle
			obj.setStyle = function (key, val) {
				if (typeof obj.length !== 'undefined') {
					for (var x = 0; obj.length > x; x++) {
						obj[x].style[key] = val;
					}
				} else {
					obj.style[key] = val;
				}
				return obj;
			};
		}
		return obj;
	}

	// ***** the element object

	var elm = {
		get: function get(inValue, blnAll) {

			var n = inValue.trim().split(' ').length;
			var name = inValue.charAt(0);
			var retObj = null;

			if (name === '#' && n === 1) {
				retObj = document.getElementById(inValue.replace('#', ''));
			} else {
				retObj = blnAll ? document.querySelectorAll(inValue) : document.querySelector(inValue);
			}

			retObj = protoTypeThis(retObj);
			return retObj;
		},
		getAll: function getAll(inValue) {
			return elm.get(inValue, true);
		}
	};

	// ***** the xhr object
	var xhr = {
		xhr: function xhr(method, url, data, headers) {
			// Return a new promise.
			return new Promise(function (resolve, reject) {
				// Do the usual XHR stuff
				var req = new XMLHttpRequest();
				method = method.toUpperCase();

				if (method !== 'POST') {
					var arrParameters = [],
					    key = void 0;
					if (typeof data !== 'undefined' && data !== null) {
						url = url.match(/\?/igm) ? url + '&' : url + '?';
						for (key in data) {
							arrParameters.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
						}
						url = url + arrParameters.join('&');
					}
				}

				req.open(method, url);

				// header
				if (headers && typeof headers !== 'undefined') {
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
		},

		get: function get(url, data, headers) {
			return xhr.xhr('GET', url, data, headers);
		},
		post: function post(url, data, headers) {
			return xhr.xhr('POST', url, data, headers);
		}

	};

	// ***** the router object
	var router = {
		_routes: [],
		_currentRoute: '',
		_defaultView: '',
		_config: {},

		add: function add(rObj) {
			router._routes.push(rObj);
			return router;
		},

		init: function init(config) {
			// TODO: getting current route
			// TODO: override the sjs-links
			// TODO: listen to the cahnge
			router._config = config;
			router._getPath();
			router._findRouteMatch();
			return router;
		},

		_getPath: function _getPath() {
			// console.log(router._routes);
			// console.log(location);
			router._currentRoute = location.pathname;
			// TODO: check config to see if using hash or not
		},

		_runController: function _runController(rObj) {
			router._changeView(rObj);
			if (typeof rObj.controller !== 'undefined') {
				rObj.controller();
			}
		},

		_findRouteMatch: function _findRouteMatch() {
			for (var x = 0; router._routes.length > x; x++) {
				var rObj = router._routes[x];
				// TODO: do the reg exp here
				if (rObj.path && rObj.path === router._currentRoute) {
					router._doTheRoute(rObj);
					break;
				}
			}
		},

		_changeView: function _changeView(rObj) {
			// TODO: add support for sjs-link view

			if (router._defaultView === '') {
				// get the default view
				router._defaultView = elm.get('sjs-view');
			}

			if (router._defaultView !== '') {
				if (rObj.view && rObj.view !== '') {
					var view = elm.get('#' + rObj.view);
					if (view) {
						view.innerHTML = rObj.template;
					}
				} else {
					router._defaultView.innerHTML = rObj.template;
				}
			}
		},

		_doTheRoute: function _doTheRoute(rObj) {
			// get the route template
			if (rObj.templateUrl) {
				if (typeof rObj.template === 'undefined' || rObj.template && rObj.template === '') {
					xhr.get(rObj.templateUrl).then(function (data) {
						rObj.template = data;
						router._runController(rObj);
					});
				} else {
					router._runController(rObj);
				}
			} else {
				router._runController(rObj);
			}
		}
	};

	//--- returning all the functions
	return {
		elm: elm,
		xhr: xhr,
		router: router
	};
}();