'use strict';

const sjs = (() => {

	function _notFilter(arr, val) {
		let ret = [];
		for (let x = 0; arr.length > x; x++) {
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
					for (let x = 0; obj.length > x; x++) {
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
					for (let x = 0; obj.length > x; x++) {
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
					for (let x = 0; obj.length > x; x++) {
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
					for (let x = 0; obj.length > x; x++) {
						if (obj[x].classList.length > 0) {
							let filtered = _notFilter(obj[x].classList, val);
							obj[x].className = filtered.join(' ');
						}
					}
				} else {
					if (obj.classList.length > 0) {
						let filtered = _notFilter(obj.classList, val);
						obj.className = filtered.join(' ');
					}
				}
				return obj;
			};


		}
		return obj;
	}

	// ***** the element object

	let elm = {
		get: (inValue, blnAll) => {

			let n = inValue.trim().split(' ').length;
			let name = inValue.charAt(0);
			let retObj = null;

			if (name === '#' && n === 1) {
				retObj = document.getElementById(inValue.replace('#', ''));
			} else {
				retObj = (blnAll) ? document.querySelectorAll(inValue) : document.querySelector(inValue);
			}

			retObj = protoTypeThis(retObj);
			return retObj;
		},
		getAll: (inValue) => {
			return elm.get(inValue, true);
		}
	};

	// ***** the xhr object
	let xhr = {
		xhr: (method, url, data, headers) => {
			// Return a new promise.
			return new Promise(function (resolve, reject) {
				// Do the usual XHR stuff
				let req = new XMLHttpRequest();
				method = method.toUpperCase();

				if (method !== 'POST') {
					let arrParameters = [],
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
				if (headers && typeof headers !== 'undefined') {
					let header = '';
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

		get: (url, data, headers) => {
			return xhr.xhr('GET', url, data, headers);
		},
		post: (url, data, headers) => {
			return xhr.xhr('POST', url, data, headers);
		}

	};

	// TODO: do the route on history change

	// ***** the router object
	let router = {
		_routes: [],
		_currentRoute: '',
		_defaultView: '',
		_config: {},
		_altView: '',

		add: (rObj) => {
			router._routes.push(rObj);
			return router;
		},

		init: (config) => {
			router._config = config;
			router._bindAllLinks();
			router._getPath();
			router._findRouteMatch();
			router._markActiveLink();
			return router;
		},
		_markActiveLink: () => {
			let links = elm.get('a[sjs-link]', true);
			if (links && links.length > 0) {
				for (let x = 0; links.length > x; x++) {
					let e = links[x];

					if (router._currentRoute === e.pathname) {
						router._makeActiveLink(e);
						break;
					}
				}
			}
		},

		_bindAllLinks: () => {
			router._bindLinks(elm.get('a[sjs-link]:not(.sjs-bound)', true));
		},

		_bindLink: (e) => {
			e.preventDefault();
			e.stopPropagation();

			if (router._currentRoute !== e.target.pathname) {

				if (router._config && typeof router._config.mode !== 'undefined' && router._config.mode === 'history') {
					let aText = e.target.innerText.trim().replace(/ /ig, '_');
					window.history.pushState(null, aText, e.target.pathname);
				} else {
					location.hash = e.target.pathname;
				}

				router._getPath();
				router._altView = e.target.getAttribute('sjs-link');
				router._findRouteMatch();

				// do the link active and remove the active class from other links
				router._markActiveLink();
			}

		},
		_makeActiveLink: (e) => {
			elm.get('a[sjs-link]', true).removeClass('active');
			e.className = e.className + ' ' + 'active';
		},

		_bindLinks: (links) => {
			if (links && links.length > 0) {
				for (let x = 0; links.length > x; x++) {
					// console.log('binding: ' + links[x]);
					//TODO: this might make memory leak... we should gather all and run unbind
					links[x].addEventListener('click', router._bindLink);
					links[x].className += ' sjs-bound';
				}
			}
		},

		_getPath: () => {
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

		_runController: (rObj) => {
			router._changeView(rObj);
			if (typeof rObj.controller !== 'undefined') {
				rObj.controller();
			}
		},

		// run the route based on current route
		_findRouteMatch: () => {
			let arrCurrentRoute = router._currentRoute.split('/').filter((i) => i !== '');

			for (let x = 0; router._routes.length > x; x++) {
				let rObj = router._routes[x];
				let arrPath = rObj.path.split('/').filter((i) => i !== '');
				let match = 0;

				// try to get the wildcard match
				for (let y = 0; arrPath.length > y; y++) {
					if (typeof arrPath[y] !== 'undefined' && typeof arrCurrentRoute[y] !== 'undefined' && arrPath[y] === arrCurrentRoute[y]) {
						match++;
					}
					if (typeof arrPath[y] !== 'undefined' && arrPath[y] === '*') {
						match++;
					}
				}

				if (rObj.path && rObj.path === router._currentRoute) {
					router._doTheRoute(rObj);
					//console.log('---- Found ----');
					break;
				}

				if (match !== 0 && match === arrCurrentRoute.length && arrCurrentRoute[0] === arrPath[0]) {
					router._doTheRoute(rObj);
					// console.log('---- Found* ----');
					break;
				}

			}
		},
		// goto to this route
		goto: (routeName) => {
			if (routeName && routeName !== '') {
				router._changeRoute(routeName);
			}
		},

		// change the route based on its name
		_changeRoute: (routeName) => {
			for (let x = 0; router._routes.length > x; x++) {
				let rObj = router._routes[x];
				// TODO: do the reg exp here
				if (rObj.path && rObj.path !== router._currentRoute && rObj.name && rObj.name === routeName) {
					router._doTheRoute(rObj);
					router._currentRoute = routeName;
					break;
				}
			}
		},

		_changeView: (rObj) => {
			// TODO: add support for sjs-link view
			let view = (router._defaultView === '') ? elm.get('sjs-view') : router._defaultView;
			router._defaultView = view;

			// override if the link has a view ID
			if (router._altView && router._altView !== '') {
				view = elm.get('#' + router._altView);
			}


			if (view !== '') {
				if (rObj.view && rObj.view !== '') {
					// override if the router object have a view
					view = elm.get('#' + rObj.view);
					if (view) {
						view.innerHTML = rObj.template;
					}
				} else {
					view.innerHTML = rObj.template;
				}
				// run the binding of links again
				router._bindAllLinks();
			}
		},

		_doTheRoute: (rObj) => {
			// get the route template
			if (rObj.templateUrl) {
				if (typeof rObj.template === 'undefined' || (rObj.template && rObj.template === '')) {
					xhr.get(rObj.templateUrl).then(data => {
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


})();
