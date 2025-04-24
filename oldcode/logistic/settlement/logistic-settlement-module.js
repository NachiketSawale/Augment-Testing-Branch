/**
 * Created by baf on 14.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	angular.module(moduleName, ['ui.router', 'platform', 'basics.common', 'basics.lookupdata', 'basics.currency']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var wizardData = [{
				serviceName: 'logisticSettlementSidebarWizardService',
				wizardGuid: '20113206036241a4947119b2b0478164',
				methodName: 'setSettlementStatus',
				canActivate: true
			},{
				serviceName: 'logisticSettlementSidebarWizardService',
				wizardGuid: '6fa756604f0440ec843a8a33c99a9327',
				methodName: 'startSettlementTransaction',
				canActivate: true
			},{
				serviceName: 'logisticSettlementSidebarWizardService',
				wizardGuid: '2fa328e2e20049cd932346249141ca96',
				methodName: 'createJobForSettlementTransaction',
				canActivate: true
			},{
				serviceName: 'logisticSettlementSidebarWizardService',
				wizardGuid: 'a703dea69c744386b8a3745af9bb12d6',
				methodName: 'startSettlementBatch',
				canActivate: true
			},{
				serviceName: 'logisticSettlementSidebarWizardService',
				wizardGuid: 'c3d202a5ec064725ad9c6f3beac25deb',
				methodName: 'createJobForSettlementBatch',
				canActivate: true
			},{
				serviceName: 'logisticSettlementSidebarWizardService',
				wizardGuid: '939abf10261941a8bca93f2d478544e6',
				methodName: 'changeTaxCodeOfSellectedSettlements',
				canActivate: true
			},{
				serviceName: 'logisticSettlementSidebarWizardService',
				wizardGuid: 'e207875ca13d4dbaa4275fab68896025',
				methodName: 'createSettlementClaims',
				canActivate: true
			},{
				serviceName: 'logisticSettlementSidebarWizardService',
				wizardGuid: '3524b8b99258477090b27ec9af0ca5a4',
				methodName: 'changeSettlementClaimStatus',
				canActivate: true
			},{
				serviceName: 'logisticSettlementSidebarWizardService',
				wizardGuid: '89136d3fb859457c9bf6ce9e6f96ee7e',
				methodName: 'correctDispatchRecord',
				canActivate: true
			},{
				serviceName: 'logisticSettlementSidebarWizardService',
				wizardGuid: '22a582601e3444e9b390aa37be2f2ae0',
				methodName: 'revertAllocationFromDispatchRecord',
				canActivate: true
			}];

			var options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['platformSchemaService', 'basicsConfigWizardSidebarService', 'logisticSettlementConstantValues',
						function (platformSchemaService, basicsConfigWizardSidebarService, logisticSettlementConstantValues) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);

							return platformSchemaService.getSchemas([
								logisticSettlementConstantValues.schemes.settlement,
								logisticSettlementConstantValues.schemes.item,
								logisticSettlementConstantValues.schemes.billingSchema,
								logisticSettlementConstantValues.schemes.transaction,
								logisticSettlementConstantValues.schemes.validation,
								logisticSettlementConstantValues.schemes.batch,
								logisticSettlementConstantValues.schemes.batchvalidation,
								logisticSettlementConstantValues.schemes.settledProjectChangeItem,
								logisticSettlementConstantValues.schemes.postedDispHeaderNotSettled,
								logisticSettlementConstantValues.schemes.settlementClaim,
								logisticSettlementConstantValues.schemes.jobsWithNegativeQuantityForBulk,
								logisticSettlementConstantValues.schemes.settlementStructV,
								{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
								{typeName: 'EquipmentPlantDto', moduleSubModule: 'Resource.Equipment'},
								{typeName: 'ResourceDto', moduleSubModule: 'Resource.Master'},
								{typeName: 'SundryServiceDto', moduleSubModule: 'Logistic.SundryService'},
								{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
								{typeName: 'MaterialDocumentDto', moduleSubModule: 'Basics.Material'},
								{typeName: 'MaterialCatalogDto', moduleSubModule: 'Basics.MaterialCatalog'},
								{typeName: 'MaterialPriceListDto', moduleSubModule: 'Basics.Material'},
								{typeName: 'MaterialCharacteristicDto', moduleSubModule: 'Basics.Material'},
								{typeName: 'Material2ProjectStockVDto', moduleSubModule: 'Basics.Material'},
								{typeName: 'CostCodeDto', moduleSubModule: 'Basics.CostCodes'},
								{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'BundleDto', moduleSubModule: 'TransportPlanning.Bundle'},
								{typeName: 'DispatchRecordDto', moduleSubModule: 'Logistic.Dispatching'},
								{typeName: 'ControllingGrpSetDTLDto', moduleSubModule: 'Controlling.Structure'},
								{typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'},
								{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'}
							]);
						}],
					loadLookup: ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load([
							'businessPartnerMainSupplierDialog'
						]);
					}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['logistic', 'resource', 'basics', 'project', 'documents']);
					}],
					loadPermissions: ['platformPermissionService', function (platformPermissionService) {
						return platformPermissionService.loadPermissions([
							'f86aa473785b4625adcabc18dfde57ac'
						]);
					}],
					loadModuleInfo: ['basicsDependentDataModuleLookupService', function (basicsDependentDataModuleLookupService) {
						basicsDependentDataModuleLookupService.loadData();
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
						$injector.get('logisticSettlementDataService').navigateTo(item, triggerField);
					}
				}
			);
		}]);

})(angular);