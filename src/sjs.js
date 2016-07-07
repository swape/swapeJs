'use strict';

const sjs = (() => {

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


	//--- returning all the functions
	return {
		elm: elm,
		xhr: xhr
	};


})();
