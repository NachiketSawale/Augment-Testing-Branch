/*
 * $Id: resource-maintenance-module.js 609635 2020-10-29 13:18:12Z baf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'resource.maintenance';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['platformSchemaService', 'resourceMaintenanceConstantValues', function (platformSchemaService, resourceMaintenanceConstantValues) {
						return platformSchemaService.getSchemas([
							resourceMaintenanceConstantValues.schemes.schema,
							resourceMaintenanceConstantValues.schemes.schemaRecord
						]);
					}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['resource', 'logistic', 'basics', 'project', 'cloud']);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
