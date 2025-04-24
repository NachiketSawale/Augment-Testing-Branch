/**
 * Created by lal on 2018-06-06.
 */
(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'mtwo.controltowerconfiguration';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					loadDomains: ['platformSchemaService', function (platformSchemaService) {

						return platformSchemaService.getSchemas([
							{typeName: 'MtoPowerbiDto', moduleSubModule: 'Mtwo.ControlTower'},
							{typeName: 'MtoPowerbiitemDto', moduleSubModule: 'Mtwo.ControlTower'},
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'PermissionsDto', moduleSubModule: 'Mtwo.ControlTower'}
						]);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}]);
})(angular);
