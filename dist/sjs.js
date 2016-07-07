'use strict';

var _Promise = typeof Promise === 'undefined' ? require('es6-promise').Promise : Promise;

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
			return new _Promise(function (resolve, reject) {
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

	//--- returning all the functions
	return {
		elm: elm,
		xhr: xhr
	};
}();