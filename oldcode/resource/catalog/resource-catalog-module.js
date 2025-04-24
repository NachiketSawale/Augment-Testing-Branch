/**
 * Created by baf on 27.10.2017
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'resource.catalog';

	angular.module(moduleName, ['ui.router', 'platform', 'basics.common', 'basics.lookupdata', 'basics.currency']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['platformSchemaService', 'resourceCatalogConstantValues',
						function (platformSchemaService, resourceCatalogConstantValues) {
							return platformSchemaService.getSchemas([
								resourceCatalogConstantValues.schemes.catalog,
								resourceCatalogConstantValues.schemes.catalogRecord,
								resourceCatalogConstantValues.schemes.priceIndex
							]);
						}
					],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['resource', 'logistic', 'basics', 'project', 'cloud']);
					}]
				}
			};
			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'basicsConfigWizardSidebarService', '_', 'platformSidebarWizardDefinitions', 'platformModuleNavigationService',
		function ($injector,  basicsConfigWizardSidebarService, _, platformSidebarWizardDefinitions, platformModuleNavigationService) {

			var wizardData = _.concat([{
				serviceName: 'resourceCatalogWizardService',
				wizardGuid: 'e0e5015e100e45b6b6afb97b069f10c5',
				methodName: 'importEquipmentCatalog',
				canActivate: true
			}], platformSidebarWizardDefinitions.model.sets.default);
			basicsConfigWizardSidebarService.registerWizard(wizardData);
			platformModuleNavigationService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('schedulingMainService').selectAfterNavigation(item, triggerField);
					}
				}
			);
		}]);

})(angular);