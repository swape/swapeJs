/* global Handlebars */
'use strict';

var sjs = function () {

	function _notFilter(arr, val) {
		var ret = [];
		for (var x = 0; arr.length > x; x++) {
			if (arr[x] !== val) {
				ret.push(arr[x]);
			}
		}
		return ret;
	}

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

			// adding a setClass
			obj.setClass = function (val) {
				if (typeof obj.length !== 'undefined') {
					for (var x = 0; obj.length > x; x++) {
						obj[x].className = val;
					}
				} else {
					obj.className = val;
				}
				return obj;
			};

			// adding a addClass
			obj.addClass = function (val) {
				if (typeof obj.length !== 'undefined') {
					for (var x = 0; obj.length > x; x++) {
						obj[x].className = obj[x].className + ' ' + val;
					}
				} else {
					obj.className = obj.className + ' ' + val;
				}
				return obj;
			};

			// adding a removeClass
			obj.removeClass = function (val) {
				if (typeof obj.length !== 'undefined') {
					for (var x = 0; obj.length > x; x++) {
						if (obj[x].classList.length > 0) {
							var filtered = _notFilter(obj[x].classList, val);
							obj[x].className = filtered.join(' ');
						}
					}
				} else {
					if (obj.classList.length > 0) {
						var _filtered = _notFilter(obj.classList, val);
						obj.className = _filtered.join(' ');
					}
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
		_altView: '',

		add: function add(rObj) {
			router._routes.push(rObj);
			return router;
		},

		init: function init(config) {
			router._config = config;
			router._bindAllLinks();
			router._getPath();
			router._findRouteMatch();
			router._markActiveLink();
			router._historyChange();
			return router;
		},

		_historyChange: function _historyChange() {

			window.onpopstate = function () {
				router._getPath();
				router._findRouteMatch();
				router._markActiveLink();
			};
		},
		_markActiveLink: function _markActiveLink() {
			var links = elm.get('a[sjs-link]', true);
			if (links && links.length > 0) {
				for (var x = 0; links.length > x; x++) {
					var e = links[x];

					if (router._currentRoute === e.pathname) {
						router._makeActiveLink(e);
					}
				}
			}
		},

		_bindAllLinks: function _bindAllLinks() {
			router._bindLinks(elm.get('a[sjs-link]:not(.sjs-bound)', true));
		},

		_bindLink: function _bindLink(e) {
			e.preventDefault();
			e.stopPropagation();

			if (router._currentRoute !== e.target.pathname) {
				router._altView = e.target.getAttribute('sjs-link');

				if (router._config && typeof router._config.mode !== 'undefined' && router._config.mode === 'history') {
					var aText = e.target.innerText.trim().replace(/ /ig, '_');
					window.history.pushState(null, aText, e.target.pathname);
				} else {
					location.hash = e.target.pathname;
				}

				//router._getPath();
				//router._findRouteMatch();
				//router._markActiveLink();
			}
		},
		_makeActiveLink: function _makeActiveLink(e) {
			elm.get('a[sjs-link]', true).removeClass('active');
			e.className = e.className + ' ' + 'active';
		},

		_bindLinks: function _bindLinks(links) {
			if (links && links.length > 0) {
				for (var x = 0; links.length > x; x++) {
					// console.log('binding: ' + links[x]);
					//TODO: this might leak... we should gather all and run unbind
					links[x].addEventListener('click', router._bindLink);
					links[x].className += ' sjs-bound';
				}
			}
		},

		_getPath: function _getPath() {
			if (router._config && typeof router._config.mode !== 'undefined' && router._config.mode === 'history') {
				router._currentRoute = location.pathname;
			} else {
				router._currentRoute = location.hash.replace('#', '').trim();
			}

			// set to default
			if (router._currentRoute === '') {
				router._currentRoute = '/';
			}
		},

		_runController: function _runController(rObj) {
			router._changeView(rObj);
			if (typeof rObj.controller !== 'undefined' && !rObj.handelbars) {
				rObj.controller(); // we do not run this here if this is handlebars
			}
		},

		// run the route based on current route
		_findRouteMatch: function _findRouteMatch() {
			var arrCurrentRoute = router._currentRoute.split('/').filter(function (i) {
				return i !== '';
			});

			for (var x = 0; router._routes.length > x; x++) {
				var rObj = router._routes[x];
				var arrPath = rObj.path.split('/').filter(function (i) {
					return i !== '';
				});
				var match = 0;

				// try to get the wildcard match
				for (var y = 0; arrPath.length > y; y++) {
					if (typeof arrPath[y] !== 'undefined' && typeof arrCurrentRoute[y] !== 'undefined' && arrPath[y] === arrCurrentRoute[y]) {
						match++;
					}
					if (typeof arrPath[y] !== 'undefined' && arrPath[y] === '*') {
						match++;
					}
				}

				if (rObj.path && rObj.path === router._currentRoute) {
					router._doTheRoute(rObj);
					break;
				}

				if (match !== 0 && match === arrCurrentRoute.length && arrCurrentRoute[0] === arrPath[0]) {
					router._doTheRoute(rObj);
					break;
				}
			}
		},
		// goto to this route
		goto: function goto(routeName) {
			if (routeName && routeName !== '') {
				router._changeRoute(routeName);
			}
		},

		// change the route based on its name
		_changeRoute: function _changeRoute(routeName) {
			for (var x = 0; router._routes.length > x; x++) {
				var rObj = router._routes[x];
				// TODO: do the reg exp here
				if (rObj.path && rObj.path !== router._currentRoute && rObj.name && rObj.name === routeName) {
					router._doTheRoute(rObj);
					router._currentRoute = routeName;
					break;
				}
			}
		},

		_changeView: function _changeView(rObj) {
			var view = router._defaultView === '' ? elm.get('sjs-view') : router._defaultView;
			router._defaultView = view;

			// override if the link has a view ID
			if (router._altView && router._altView !== '') {
				view = elm.get('#' + router._altView);
			}

			if (view !== '') {
				if (rObj.view && rObj.view !== '') {
					// override if the router object have a view
					view = elm.get('#' + rObj.view);
				}

				if (view) {
					// if handelbars, then we have to wait for the controller to return object.
					if (rObj.handelbars && rObj.controller) {
						var objRet = rObj.controller();
						var compiled = Handlebars.compile(rObj.template);
						view.innerHTML = compiled(objRet);
					} else {
						view.innerHTML = rObj.template;
					}
				}
				// run the binding of links again
				router._bindAllLinks();
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
		router: router,
		v: '0.3'
	};
}();