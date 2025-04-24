/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

// / <reference path='_references.js'/>
(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'estimate.project';

	angular.module(moduleName, ['ui.router']);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name estimate.project
	 * @description
	 * Module definition of the estimate project module
	 **/
	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {
				mainViewServiceProvider.registerModule('estimate.project');
			}

		]).run(['$injector', 'basicsWorkflowEventService',
		function ($injector, basicsWorkflowEventService) {
			basicsWorkflowEventService.registerEvent('cbcd2b031bb54ffabba52dc25803698d', 'New Estimate Created');
		}]);
})(angular);
