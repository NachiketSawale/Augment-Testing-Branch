// <reference path='../help/10_angular/angular.js' />

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	/*
     ** basic.material module is created.
     */
	var moduleName = 'basics.material';

	angular.module(moduleName, ['ui.router', 'basics.lookupdata', 'cloud.common', 'ui.bootstrap']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([{
							typeName: 'MaterialCatalogDto',
							moduleSubModule: 'Basics.MaterialCatalog'
						}, {
							typeName: 'MaterialGroupDto',
							moduleSubModule: 'Basics.MaterialCatalog'
						}, {
							typeName: 'MaterialCharacteristicDto',
							moduleSubModule: 'Basics.Material'
						}, {
							typeName: 'MaterialAINeutralMappingDto',
							moduleSubModule: 'Basics.Material'
						}, {
							typeName: 'MaterialDocumentDto',
							moduleSubModule: 'Basics.Material'
						}, {
							typeName: 'MaterialDto',
							moduleSubModule: 'Basics.Material'
						}, {
							typeName: 'MaterialPriceConditionDto',
							moduleSubModule: 'Basics.Material'
						}, {
							typeName: 'MaterialDiscountGroupDto',
							moduleSubModule: 'Basics.MaterialCatalog'
						}, {
							typeName: 'MaterialPriceListDto',
							moduleSubModule: 'Basics.Material'
						}, {
							typeName: 'Material2ProjectStockVDto',
							moduleSubModule: 'Basics.Material'
						}, {typeName: 'Material2CertificateDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'Material2ProjectStockDto', moduleSubModule: 'Basics.Material'},
						{typeName: 'MdcMaterial2basUomDto', moduleSubModule: 'Basics.Material'},
						{typeName: 'MaterialScopeDto', moduleSubModule: 'Basics.Material'},
						{typeName: 'MaterialScopeDetailDto', moduleSubModule: 'Basics.Material'},
						{typeName: 'MaterialScopeDtlBlobDto', moduleSubModule: 'Basics.Material'},
						{typeName: 'MdcMaterialReferenceDto', moduleSubModule: 'Basics.Material'},
						{typeName: 'Stock2matPriceverDto', moduleSubModule: 'Basics.Material'},
						{typeName: 'Material2StockTotalVDto', moduleSubModule: 'Basics.Material'},
						{typeName: 'MaterialPortionDto', moduleSubModule: 'Basics.Material'},
						{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'}
						]);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load([
							'basicsMaterialWeightNumberComboBox',
							'basicsMaterialWeightTypeComboBox',
							'businessPartnerMainSupplierLookup'
						]);
					}],
					'loadRoundingData': ['basicsCommonRoundingService',
						function (basicsCommonRoundingService) {
							return basicsCommonRoundingService.getService('basics.material').loadRounding();
						}],
					'loadMaterialCatalogType':['basicsMaterialMaterialCatalogService', function(basicsMaterialMaterialCatalogService) {
						basicsMaterialMaterialCatalogService.getCatalogTypes();
					}],
					'loadSystemOption':['basicCustomizeSystemoptionLookupDataService', function(basicCustomizeSystemoptionLookupDataService) {
						basicCustomizeSystemoptionLookupDataService.getList();
					}],
					'loadtranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule(['model.viewer'], true);
					}],
					'getMaterialCodeLength': ['basicsMaterialRecordService', function(basicsMaterialRecordService){
						basicsMaterialRecordService.getMaterialCodeLength();
					}],
					'registerWizards': ['basicsConfigWizardSidebarService', function (wizardService) {

						var wizardData = [{
							serviceName: 'basicsMaterialWizardService',
							wizardGuid: '15D44284C7F241B3AC2978A400CFC238',
							methodName: 'importMaterialRecords',
							canActivate: true
						}, {
							serviceName: 'basicsMaterialWizardService',
							wizardGuid: '6980446B54D04C558A3FCDC79FBA3693',
							methodName: 'import3DModel',
							canActivate: true
						}, {
							serviceName: 'basicsMaterialWizardService',
							wizardGuid: '7EE9FA8F33994C8FBF97412A1FA3BCC0',
							methodName: 'delete3DModel',
							canActivate: true
						}, {
							serviceName: 'basicsMaterialWizardService',
							wizardGuid: '4667B7D5F0364CCF9D90AC0D4EE398C3',
							methodName: 'forecastTemp',
							canActivate: true
						}, {
							serviceName: 'basicsCharacteristicBulkEditorService',
							wizardGuid: '12f9d13b74d54c438dc7cc660743141e',
							methodName: 'showEditor',
							canActivate: true,
							userParam: {
								'parentService': 'basicsMaterialRecordService',
								'sectionId': 16,
								'moduleName': moduleName
							}
						}, {
							serviceName: 'basicsMaterialWizardService',
							wizardGuid: '00A045BB6A514F72A2A0835062382C88',
							methodName: 'NeutralMaterialAiMapping',
							canActivate: true
						}, {
							serviceName: 'basicsMaterialWizardService',
							wizardGuid: '1455ff210ae74b58ad51b76c2d30f57d',
							methodName: 'updateMaterialPrices',
							canActivate: true
						}, {
							serviceName: 'basicsMaterialWizardService',
							wizardGuid: 'f9939d2716fa4e8f94243e174d976c34',
							methodName: 'disableRecord',
							canActivate: true
						}, {
							serviceName: 'basicsMaterialWizardService',
							wizardGuid: 'ce48703dfb5f4679b0a6c44004b5eb7d',
							methodName: 'enableRecord',
							canActivate: true
						}, {
							serviceName: 'basicsMaterialWizardService',
							wizardGuid: '25221988687a44db97eb053f9ad80625',
							methodName: 'createMaterialFromTemplate',
							canActivate: true
						}, {
							serviceName: 'basicsMaterialWizardService',
							wizardGuid: '3989f9d232a04b568b1c24c3d30329a8',
							methodName: 'recalculateMaterialFromVariant',
							canActivate: true
						}, {
							serviceName: 'basicsMaterialWizardService',
							wizardGuid: '8e5788b865f19e5ce2c6a612e31530c8',
							methodName: 'syncFullText',
							canActivate: true
						},
						{
							serviceName: 'basicsMaterialWizardService',
							wizardGuid: 'a8c2353fca6b48a88c9b25901b0a7528',
							methodName: 'changeMaterialStatus',
							canActivate: true
						}];
						wizardService.registerWizard(wizardData);

					}]
				},
				'permissions': [
					'6ew98cfebf2f4540be89a255e6eb8b26'
				]
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', 'genericWizardContainerLayoutService',
		'basicsConfigWizardSidebarService', 'basicsWorkflowEventService', 'basicsCharacteristicDataServiceFactory', 'platformTranslateService',
		function ($injector, naviService, layoutService, wizardService, basicsWorkflowEventService, basicsCharacteristicDataServiceFactory, platformTranslateService) {
			naviService.registerNavigationEndpoint({
				moduleName: 'basics.material',
				navFunc: function (item, triggerField) {
					$injector.get('basicsMaterialRecordService').navigationCompleted(item, triggerField);
					// $injector.get('basicsMaterialRecordService').filterByCatalogItem(item);
				}
			});
			platformTranslateService.registerModule(moduleName);
			basicsWorkflowEventService.registerEvent('0234B6C0B79A48C49DD0B3918B8AC8B5', 'Material Forecast');
			basicsWorkflowEventService.registerEvent('73D41C523E8B4B2F9465F22F170AE349', 'Flex Demand');
			basicsWorkflowEventService.registerEvent('EB8021D0732E4284A1050C30390EA7B4', 'Material Creation');
			// todo: move to config block!
			// install listener for parent-service create event (even when characteristic container ist not activated)
			// basicsCharacteristicDataServiceFactory.getService(mainService, 16);

		}
	]);

})(angular);