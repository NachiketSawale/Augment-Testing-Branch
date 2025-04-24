/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'resource.plantestimate';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			const wizardData = [{
				serviceName: 'resourcePlantEstimatePlantWizardService',
				wizardGuid: '35c498f4be29422d8d4276022ee6945d',
				methodName: 'disablePlant',
				canActivate: true
			}, {
				serviceName: 'resourcePlantEstimatePlantWizardService',
				wizardGuid: 'cb81b18aafbe4faeac4d1eb06040a0b4',
				methodName: 'enablePlant',
				canActivate: true
			}, {
				serviceName: 'resourcePlantEstimatePlantWizardService',
				wizardGuid: '3fa82a69b50841cd8c54f3f7632adb8f',
				methodName: 'setPlantStatus',
				canActivate: true
			},{
				serviceName: 'resourcePlantEstimatePlantWizardService',
				wizardGuid: 'd9af7fa9047841b491b3438464bdd237',
				methodName: 'createNewResourceFromPlant',
				canActivate: true
			},{
				serviceName: 'resourcePlantEstimateSpecificValueWizardService',
				wizardGuid: '96b98be699814a1cbe879fc336866fe7',
				methodName: 'takeoverGroupSpecificValues',
				canActivate: true
			},{
				serviceName: 'resourcePlantEstimateRecalcAssemblyWizardService',
				wizardGuid: 'fa495ad5127d495c92c5d41f7b2d739d',
				methodName: 'recalcPlantAssemblies',
				canActivate: true
			}];

			let options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['_', 'platformSchemaService', 'platformModuleInitialConfigurationService', 'basicsConfigWizardSidebarService',
						'resourcePlantEstimateConstantValues', 'resourceCatalogConstantValues',
						function (_, platformSchemaService, platformModuleInitialConfigurationService, basicsConfigWizardSidebarService,
							resourcePlantEstimateConstantValues, resourceCatalogConstantValues) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							return platformModuleInitialConfigurationService.load('Resource.Plantestimate').then(function (modData) {
								let schemes = [
									resourcePlantEstimateConstantValues.schemes.plant,
									resourcePlantEstimateConstantValues.schemes.plantAccessory,
									resourcePlantEstimateConstantValues.schemes.plantAssignment,
									resourcePlantEstimateConstantValues.schemes.plantCatalogCalc,
									resourcePlantEstimateConstantValues.schemes.plantCompatibleMaterial,
									resourcePlantEstimateConstantValues.schemes.plantCostV,
									resourcePlantEstimateConstantValues.schemes.plantEstimatePriceList,
									resourcePlantEstimateConstantValues.schemes.plantPrices,
									resourcePlantEstimateConstantValues.schemes.specificValue,
									resourceCatalogConstantValues.schemes.catalogRecord
								];
								_.forEach(modData.schemes, function(scheme) {
									schemes.push(scheme);
								});

								return platformSchemaService.getSchemas(schemes);
							});
						}
					],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'resourceEquipmentConstantValues', function (basicsCompanyNumberGenerationInfoService, resourceEquipmentConstantValues) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('resourceEquipmentNumberInfoService', resourceEquipmentConstantValues.rubricId).load();
					}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['resource', 'services', 'project',
							'basics', 'cloud', 'documents', 'estimate']);
					}],
					loadContextData: ['resourceCommonContextService', function (resourceCommonContextService) {
						return resourceCommonContextService.init();
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
						$injector.get('resourcePlantEstimateEquipmentDataService').navigateTo(item, triggerField);
						$injector.get('resourcePlantEstimatePriceListDataService').navigateTo(item, triggerField);
					}
				}
			);
		}]);

})(angular);
