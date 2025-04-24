// / <reference path='../help/10_angular/angular.js' />

(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/*
	 ** procurement.ticketsystem module is created.
	 */
	var moduleName = 'procurement.ticketsystem';

	angular.module(moduleName, ['ui.router', 'basics.lookupdata', 'cloud.common', 'ui.bootstrap']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadtranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule(['cloud.common', 'procurement.common', 'basics.material'], true);
					}],
					'loadPermissions': ['platformPermissionService', function (platformPermissionService) {
						return platformPermissionService.loadPermissions([
							'1dccc95e20e34480b54f0b345002eb59'
						]);
					}],
					registerPermissionParentObjectTypes: ['platformPermissionService', 'permissionObjectType',
						(platformPermissionService, permissionObjectType) => {
							return platformPermissionService.registerParentObjectTypes(moduleName, [permissionObjectType.project]);
						}],
				}
			};

			platformLayoutService.registerModule(options);
		}
	]).run(['platformTranslateService',
		function (platformTranslateService) {
			platformTranslateService.registerModule(moduleName);
		}
	]);

})(angular);