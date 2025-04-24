/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'project.costcodes';
	angular.module(moduleName, ['ui.router']);
	globals.modules.push(moduleName);

	/*
	 /**
	 * @ngdoc module
	 * @name project.costcodes
	 * @description
	 * Module definition of the project costcodes module
	 **/
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
					moduleName: 'project.main-costcodes',
					navFunc: function (item, triggerField) {
						$timeout(function () {
							$injector.get('projectCostCodesMainService').navigateTo(item, triggerField);
						}, 1000);

					}
				}
			);
		}]);

})(angular);