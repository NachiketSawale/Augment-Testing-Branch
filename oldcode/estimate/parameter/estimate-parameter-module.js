/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */

	let moduleName = 'estimate.parameter';
	angular.module(moduleName, ['ui.router']);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name estimate.parameter
	 * @description
	 * Module definition of the estimate parameter module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			mainViewServiceProvider.registerModule(moduleName);
		}
	]);
})();
