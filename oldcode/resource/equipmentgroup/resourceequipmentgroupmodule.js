(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'resource.equipmentgroup';

	angular.module(moduleName, ['ui.router', 'basics.common', 'basics.lookupdata', 'basics.currency', 'platform']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var wizardData = [{
				serviceName: 'resourceEquipmentGroupSidebarWizardService',
				wizardGuid: '60c2750ce724432dacc360a7c29de2a9',
				methodName: 'disableGroup',
				canActivate: true
			}, {
				serviceName: 'resourceEquipmentGroupSidebarWizardService',
				wizardGuid: '1c20470ae22b41b2a321944a6977c22e',
				methodName: 'enableGroup',
				canActivate: true
			},
			{
				serviceName: 'resourceEquipmentGroupSetCharacteristicWizardService',
				wizardGuid: 'f689e4821f7411ec96210242ac130002',
				methodName: 'setCharacteristicsforEquipment',
				canActivate: true
			},
			{
				serviceName: 'resourceEquipmentGroupSidebarWizardService',
				wizardGuid: '02c2d4ff252b43b7be418a644122ffbd',
				methodName: 'createPlant',
				canActivate: true
			},
			{
				serviceName: 'resourceEquipmentGroupSidebarWizardService',
				wizardGuid: 'eff9b62ab60945ff8a49fa0834e9a6b4',
				methodName: 'createResTypeStructure',
				canActivate: true
			}
			];

			var options = {
				moduleName: moduleName,
				loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
					return platformModuleEntityCreationConfigurationService.load(moduleName);
				}],
				resolve: {
					loadDomains: [
						'platformSchemaService', 'platformModuleInitialConfigurationService', 'basicsConfigWizardSidebarService',
						'resourceEquipmentGroupConstantValues', 'resourceEquipmentConstantValues', 'logisticJobConstantValues',
						'resourceCatalogConstantValues',
						function(
							platformSchemaService, platformModuleInitialConfigurationService, basicsConfigWizardSidebarService,
							resourceEquipmentGroupConstantValues,resourceEquipmentConstantValues, logisticJobConstantValues,
							resourceCatalogConstantValues
						){
							basicsConfigWizardSidebarService.registerWizard(wizardData);

							return platformModuleInitialConfigurationService.load('Resource.EquipmentGroup').then(function (modData) {
								var schemes = modData.schemes;
								schemes.push(
									{ typeName: 'CostCodeDto', moduleSubModule: 'Basics.CostCodes' },
									{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'},
									{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Assemblies'},
									{typeName: 'EstResourceDto', moduleSubModule: 'Estimate.Main'},
									resourceEquipmentGroupConstantValues.schemes.taxCode,
									resourceEquipmentGroupConstantValues.schemes.group,
									resourceEquipmentGroupConstantValues.schemes.groupAccount,
									resourceEquipmentGroupConstantValues.schemes.groupControllingUnit,
									resourceEquipmentGroupConstantValues.schemes.groupEurolist,
									resourceEquipmentGroupConstantValues.schemes.groupPrice,
									resourceEquipmentGroupConstantValues.schemes.groupWoT,
									resourceEquipmentGroupConstantValues.schemes.plantGroupPicture,
									resourceEquipmentConstantValues.schemes.plantCertificate,
									resourceEquipmentConstantValues.schemes.plantCostV,
									logisticJobConstantValues.schemes.plantAllocation,
									resourceEquipmentGroupConstantValues.schemes.plantGroup2CostCode,
									resourceEquipmentGroupConstantValues.schemes.plantGroup2EstimatePriceList,
									resourceCatalogConstantValues.schemes.catalogRecord,
									resourceEquipmentGroupConstantValues.schemes.specificValue,
									resourceEquipmentGroupConstantValues.schemes.compmaintschematemplate,
									resourceEquipmentGroupConstantValues.schemes.document
								);
								return platformSchemaService.getSchemas(schemes);
							});
						}
					],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'resourceEquipmentGroupConstantValues', function (basicsCompanyNumberGenerationInfoService, resourceEquipmentGroupConstantValues) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('resourceEquipmentGroupNumberInfoService', resourceEquipmentGroupConstantValues.rubricId).load();
					}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['resource', 'services', 'project', 'basics', 'cloud', 'documents']);
					}],
					loadLookUps :['resourceEquipmentGroupLookupService',function (resourceEquipmentGroupLookupService) {
						return resourceEquipmentGroupLookupService.loadAssignmentData();
					}],
					loadContextData: ['resourceCommonContextService', function (resourceCommonContextService) {
						return resourceCommonContextService.init();
					}]
				}
			};
			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);

