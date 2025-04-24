/*
 * $Id: logistic-card-module.js 627387 2021-03-12 08:12:42Z shen $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'logistic.card';

	angular.module(moduleName, ['logistic.cardtemplate', 'resource.common', 'resource.equipment']);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var wizardData = [{
				serviceName: 'logisticCardSidebarWizardService',
				wizardGuid: '36418540fe5641b19edc4c7bb88119b7',
				methodName: 'reserveMaterialAndStock',
				canActivate: true
			}, {
				serviceName: 'logisticCardSidebarWizardService',
				wizardGuid: 'db22cbc273704edfb9cd9c28cf6d40b6',
				methodName: 'changeCardStatus',
				canActivate: true
			},
			{
				serviceName: 'logisticCardBookDownTimeWizardService',
				wizardGuid: '0f6594cf945b4455a03741bcf3c3e45b',
				methodName: 'bookDowntime',
				canActivate: true
			},
			{
				serviceName: 'logisticCardCreateDispatchNotesWizardService',
				wizardGuid: 'd93ac7abc4f54688926a02a625fd437a',
				methodName: 'createDispatchNotesFromJobCards',
				canActivate: true
			},
			{
				serviceName: 'basicsUserFormFormDataWizardService',
				wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
				methodName: 'changeFormDataStatus',
				canActivate: true
			}
			];


			var options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['platformSchemaService', 'logisticCardConstantValues', 'basicsConfigWizardSidebarService',
						function (platformSchemaService, logisticCardConstantValues, basicsConfigWizardSidebarService) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);

							return platformSchemaService.getSchemas([
								logisticCardConstantValues.schemes.card,
								logisticCardConstantValues.schemes.activity,
								logisticCardConstantValues.schemes.record,
								logisticCardConstantValues.schemes.carddocument,
								logisticCardConstantValues.schemes.work,
								logisticCardConstantValues.schemes.cardactivityclerk,
								logisticCardConstantValues.schemes.plantLocation,
								{typeName:'StockTotalVDto', moduleSubModule: 'Procurement.Stock'},
								{moduleSubModule: 'Resource.Equipment', typeName: 'EquipmentPlantDto'},
								{moduleSubModule: 'Resource.Equipment', typeName: 'PlantAllocVDto'},
								logisticCardConstantValues.schemes.plantCompatibleMaterial
							]);
						}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'logisticCardConstantValues', function (basicsCompanyNumberGenerationInfoService, logisticCardConstantValues) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticCardNumberInfoService', logisticCardConstantValues.rubricId).load();
					}],
					loadCodeGenerationInfo2: ['basicsCompanyNumberGenerationInfoService', 'logisticDispatchingConstantValues', function (basicsCompanyNumberGenerationInfoService, logisticDispatchingConstantValues) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticDispatchingHeaderNumberInfoService', logisticDispatchingConstantValues.rubricId).load();
					}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['logistic', 'resource', 'services', 'project', 'basics', 'documents']);
					}],
					loadModuleInfo: ['basicsDependentDataModuleLookupService', function (basicsDependentDataModuleLookupService) {
						basicsDependentDataModuleLookupService.loadData();
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);


