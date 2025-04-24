/**
 * Created by sandu on 25.08.2015.
 */
(function (angular) {
	/*global angular*/
	'use strict';

	var moduleName = 'usermanagement.group';
	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'AccessGroupDto', moduleSubModule: 'UserManagement.Main'},
							{typeName: 'AccessGroup2RoleDto', moduleSubModule: 'UserManagement.Main'},
							{typeName: 'AccessUser2GroupDto', moduleSubModule: 'UserManagement.Main'},
							{typeName: 'JobDto', moduleSubModule: 'Services.Scheduler'}
						]);
					}],
					'loadTranslation': ['platformTranslateService', 'usermanagementGroupStateValues', function (platformTranslateService, usermanagementGroupStateValues) {
						return platformTranslateService.registerModule([moduleName, 'usermanagement.user','usermanagement.main', 'usermanagement.right'], true)
							.then(function () {
								platformTranslateService.translateObject(usermanagementGroupStateValues, ['description']);
								return true;
							});
					}]
				}
			};
			mainViewServiceProvider.registerModule(options);
		}]).run();

})(angular);