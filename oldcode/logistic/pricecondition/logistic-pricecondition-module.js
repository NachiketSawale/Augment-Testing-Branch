/**
 * Created by baf on 28.02.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.pricecondition';

	angular.module(moduleName, ['ui.router', 'platform', 'basics.common', 'basics.lookupdata', 'basics.currency']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var wizardData = [{
				serviceName: 'logisticsPriceConditionSideBarWizardService',
				wizardGuid: '6c02515c8ec04a3cbb9dcb04fc9fa1b5',
				methodName: 'generatePlantCostCodes',
				canActivate: true
			}];
			var options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService',
						function(platformModuleEntityCreationConfigurationService) {
							return platformModuleEntityCreationConfigurationService.load(moduleName);
						}],
					loadDomains: ['platformSchemaService', 'logisticPriceConditionConstantValues','basicsConfigWizardSidebarService',
						function (platformSchemaService, logisticPriceConditionConstantValues,basicsConfigWizardSidebarService) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);


							return platformSchemaService.getSchemas([
								logisticPriceConditionConstantValues.schemes.priceCondition,
								logisticPriceConditionConstantValues.schemes.priceConditionItem,
								logisticPriceConditionConstantValues.schemes.costCodeRate,
								logisticPriceConditionConstantValues.schemes.plantCatalogPrice,
								logisticPriceConditionConstantValues.schemes.materialCatalogPrice,
								logisticPriceConditionConstantValues.schemes.plantPrice,
								logisticPriceConditionConstantValues.schemes.sundryServicePrice,
								logisticPriceConditionConstantValues.schemes.materialPrice,
								logisticPriceConditionConstantValues.schemes.plantCostCode
							]);
						}
					],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['logistic', 'resource', 'basics', 'project', 'documents']);
					}]
				}
			};
			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('logisticPriceConditionDataService').navigateTo(item, triggerField);
					}
				}
			);
		}]);

})(angular);