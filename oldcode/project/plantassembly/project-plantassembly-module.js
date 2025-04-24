/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'project.plantassembly';
	angular.module(moduleName, ['ui.router']);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name project.plantassembly
	 * @description
	 * Module definition of the project plantassembly module
	 * This module is responsible for the plant assembly functionality
	 */
	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {

				let options = {
					'moduleName': moduleName
				};

				mainViewServiceProvider.registerModule(options);
			}
		]).run(['$injector', 'platformModuleNavigationService', '$timeout', function ($injector, naviService, $timeout) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: 'project.main-plantassembly',
					navFunc: function (item, triggerField) {
						$timeout(function () {
							$injector.get('projectPlantAssemblyMainService').navigateTo(item, triggerField);
						}, 1000);
					}
				}
			);
		}]);

})(angular);
