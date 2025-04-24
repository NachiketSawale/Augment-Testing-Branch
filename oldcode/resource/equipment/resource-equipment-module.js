(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'resource.equipment';
	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name resource.equipment
	 * @description
	 * Module definition of the resource equipment module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var wizardData = [{
				serviceName: 'resourceEquipmentPlantWizardService',
				wizardGuid: '35c498f4be29422d8d4276022ee6945d',
				methodName: 'disablePlant',
				canActivate: true
			}, {
				serviceName: 'resourceEquipmentPlantWizardService',
				wizardGuid: 'cb81b18aafbe4faeac4d1eb06040a0b4',
				methodName: 'enablePlant',
				canActivate: true
			}, {
				serviceName: 'resourceEquipmentPlantWizardService',
				wizardGuid: '3fa82a69b50841cd8c54f3f7632adb8f',
				methodName: 'setPlantStatus',
				canActivate: true
			}, {
				serviceName: 'resourceEquipmentSidebarWizardService',
				wizardGuid: 'ae0b2a016a9447f8a772a7fa9cbc8ec1',
				methodName: 'setPlantMaintenanceStatus',
				canActivate: true
			}, {
				serviceName: 'resourceEquipmentSidebarWizardService',
				wizardGuid: 'aa886cb3f1c34260b88741d969a8840a',
				methodName: 'createRequisitionsOrReservations',
				canActivate: true
			}, {
				serviceName: 'resourceEquipmentSidebarWizardService',
				wizardGuid: 'd862a5fcf60c46e8adf94511d484bdf1',
				methodName: 'createMaintenances',
				canActivate: true
			}, {
				serviceName: 'resourceEquipmentSidebarWizardService',
				wizardGuid: '4e7869367fe844f7ba2a09cbd9ad6c65',
				methodName: 'setMaintenanceToDue',
				canActivate: true
			}, {
				serviceName: 'resourceEquipmentSidebarWizardService',
				wizardGuid: '439da1c45b1945b9bbdd058170d370ea',
				methodName: 'createJobForMaintenanceToDue',
				canActivate: true
			},{
				serviceName: 'resourceEquipmentSidebarWizardService',
				wizardGuid: '54d6dbf336104916bf26978a467b4803',
				methodName: 'adjustQuantities',
				canActivate: true
			},{
				serviceName: 'resourceEquipmentPlantWizardService',
				wizardGuid: 'd9af7fa9047841b491b3438464bdd237',
				methodName: 'createNewResourceFromPlant',
				canActivate: true
			},{
				serviceName: 'resourceEquipmentSidebarWizardService',
				wizardGuid: 'f048484dd2e24f10a9df32b8a2ec71f9',
				methodName: 'createRequestForExternalMaintenance',
				canActivate: true
			}, {
				serviceName: 'resourceEquipmentSidebarWizardService',
				wizardGuid: '81be94f2e6724543a36192d9188650cd',
				methodName: 'setPlantComponentWarrantyStatus',
				canActivate: true
			}, {
				serviceName: 'basicsUserFormFormDataWizardService',
				wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
				methodName: 'changeFormDataStatus',
				canActivate: true
			}, {
				serviceName: 'resourceEquipmentSidebarWizardService',
				wizardGuid: '2ec1e9f0bd504132a38e2b318aaa5992',
				methodName: 'CreateInitialAllocationForPlants',
				canActivate: true
			},{
				serviceName: 'resourceEquipmentSpecificValueWizardService',
				wizardGuid: '96b98be699814a1cbe879fc336866fe7',
				methodName: 'takeoverGroupSpecificValues',
				canActivate: true
			}];

			var options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: [
						'platformSchemaService', 'platformModuleInitialConfigurationService', 'basicsConfigWizardSidebarService',
						'resourceEquipmentConstantValues', 'logisticJobConstantValues', 'resourceCatalogConstantValues',
						function (
							platformSchemaService, platformModuleInitialConfigurationService, basicsConfigWizardSidebarService,
							resourceEquipmentConstantValues, logisticJobConstantValues, resourceCatalogConstantValues
						) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							return platformModuleInitialConfigurationService.load('Resource.Equipment').then(function (modData) {
								var schemes = modData.schemes;
								schemes.push(
									{typeName: 'CostCodeDto', moduleSubModule: 'Basics.CostCodes'},
									{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'},
									{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Assemblies'},
									{typeName: 'EstResourceDto', moduleSubModule: 'Estimate.Main'},
									{typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
									{typeName: 'Operation2PlantTypeDto', moduleSubModule: 'Resource.Wot'},
									resourceEquipmentConstantValues.schemes.businessPartner,
									resourceEquipmentConstantValues.schemes.controllingUnit,
									resourceEquipmentConstantValues.schemes.fixedAsset,
									resourceEquipmentConstantValues.schemes.meterReading,
									resourceEquipmentConstantValues.schemes.plant,
									resourceEquipmentConstantValues.schemes.plantAccessory,
									resourceEquipmentConstantValues.schemes.plantAllocation,
									resourceEquipmentConstantValues.schemes.plantMaintenanceView,
									resourceEquipmentConstantValues.schemes.plantAssignment,
									resourceEquipmentConstantValues.schemes.plantCatalogCalc,
									resourceEquipmentConstantValues.schemes.plantComponent,
									resourceEquipmentConstantValues.schemes.plantDocument,
									resourceEquipmentConstantValues.schemes.plantMaintenance,
									resourceEquipmentConstantValues.schemes.plantPicture,
									resourceEquipmentConstantValues.schemes.plantPrices,
									resourceEquipmentConstantValues.schemes.plantCertificate,
									resourceEquipmentConstantValues.schemes.plantCostV,
									resourceEquipmentConstantValues.schemes.plantComponentMaintSchema,
									resourceEquipmentConstantValues.schemes.plant2Clerk,
									logisticJobConstantValues.schemes.plantAllocation,
									resourceEquipmentConstantValues.schemes.plant2EstimatePriceList,
									resourceEquipmentConstantValues.schemes.plantWarranty,
									resourceEquipmentConstantValues.schemes.compatibleMaterial,
									resourceCatalogConstantValues.schemes.catalogRecord,
									resourceEquipmentConstantValues.schemes.contractProcurement,
									resourceEquipmentConstantValues.schemes.specificValues,
									resourceEquipmentConstantValues.schemes.bulkPlantOwner
								);
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
					loadModuleInfo: ['basicsDependentDataModuleLookupService', function (basicsDependentDataModuleLookupService) {
						return basicsDependentDataModuleLookupService.loadData();
					}],
					loadContextData: ['resourceCommonContextService', function (resourceCommonContextService) {
						return resourceCommonContextService.init();
					}],
					loadAccessRights: ['platformPermissionService', function (platformPermissionService) {
						return platformPermissionService.loadPermissions(['86669bb5495346cfb2086463b29863da']);
					}]
				}
			};

			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('resourceEquipmentPlantDataService').loadAfterNavigation(item, triggerField);
					}
				}
			);
		}]);
})(angular);


