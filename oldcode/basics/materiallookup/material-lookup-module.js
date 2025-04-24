/// <reference path='../help/10_angular/angular.js' />

(function (angular) {
	'use strict';

	/*
	 ** basics.materialLookup module is created.
	 */
	var moduleName = 'basics.materiallookup';

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
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{
								typeName: 'MaterialDto',
								moduleSubModule: 'Basics.Material'
							}
						]);
					}],
					'loadSearchOptions':[
						'materialLookupDialogSearchOptionService',
						function (searchOptionService) {
							return searchOptionService.initMaterialDefinitions();
						}
					]
				}
			};

			platformLayoutService.registerModule(options);
		}
	]);

})(angular);