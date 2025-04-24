/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'resource.plantpricing';

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
					loadDomains: ['platformSchemaService', 'resourcePlantpricingConstantValues', function (platformSchemaService, resourcePlantpricingConstantValues) {
						return platformSchemaService.getSchemas([
							resourcePlantpricingConstantValues.schemes.pricelistType,
							resourcePlantpricingConstantValues.schemes.pricelist,
							resourcePlantpricingConstantValues.schemes.estPricelist
						]);
					}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['resource', 'logistic', 'basics', 'project', 'cloud']);
					}],
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
