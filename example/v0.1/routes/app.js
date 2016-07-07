/* global sjs */
(function () {
	'use strict';

	function mainController() {
		// Setting the innerHTML (DOM) value for elements with #myValue id.
		sjs.set('p#myValue', 'innerHTML', 'This value is set by sjs.set');
		sjs.set('h4#myValue2', 'innerHTML', 'This too.');

		sjs.set('h4#myValue2', 'class', 'blue');

	}

	function secController() {
		sjs.set('p#myValue', 'innerHTML', 'This is the second controller.');
	}

	function redirectController() {
		// this controller sets the state to main.
		sjs.gotoState('main');
	}

	function thirdController() {
		console.log('I am from third controller');
	}

	/* Routes */

	sjs.objRoutes.routes = [
		{
			route: 'main',
			controller: mainController,
			templateUrl: 'templates/main.html',
			default: true
		}, {
			route: 'sec',
			controller: secController,
			template: '<h2>Hello from the second controller!</h2> <p id="myValue"></p>'
		}, {
			route: 'third',
			controller: thirdController,
			templateUrl: 'templates/third.html'
		}, {
			route: 'redirect',
			controller: redirectController,
			template: 'Redirecting..'
		}];

	// initializes sjs
	sjs.init();
})();