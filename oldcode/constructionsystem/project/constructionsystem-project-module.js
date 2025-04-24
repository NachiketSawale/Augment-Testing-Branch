(function (angular) {
	'use strict';
	/* global globals */

	var moduleName = 'constructionsystem.project';

	angular.module(moduleName, ['ui.router']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			mainViewServiceProvider.registerModule(moduleName);
		}
	]);
})(angular);
