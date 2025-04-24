/*
 * $Id: basics-biplusdesigner-module.js 610721 2020-11-05 02:17:40Z lta $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.biplusdesigner';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				moduleName: moduleName,
				controller:'basicsBiPlusDesignerController',
				resolve: {
					loadDomains: ['platformSchemaService', function (platformSchemaService) {
						var moduleSubModule = 'Basics.BiPlusDesigner';

						platformSchemaService.initialize();
						return platformSchemaService.getSchemas( [
							{ typeName: 'Dashboard2GroupDto', moduleSubModule: moduleSubModule},
							{ typeName: 'DashboardGroupDto', moduleSubModule: moduleSubModule},
							{ typeName: 'DashboardDto', moduleSubModule: moduleSubModule},
							{ typeName: 'DashboardParameterDto', moduleSubModule: moduleSubModule}
						] );
					}],
					'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'basics.customize', 'basics.config']);}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
