// / <reference path='_references.js'/>
(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'scheduling.lookup';

	angular.module(moduleName, ['ui.router']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (platformLayoutService) {
				platformLayoutService.registerModule(moduleName);
			}
		]);
})(angular);
