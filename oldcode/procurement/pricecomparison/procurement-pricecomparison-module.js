(function config(angular) {
	/* global globals */
	'use strict';

	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName, ['ui.router', 'cloud.common', 'procurement.common']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider', function init(mainViewServiceProvider) {
		let options = {
			'moduleName': moduleName,
			'resolve': {
				'loadDomains': ['platformSchemaService', function loadDomains(platformSchemaService) {
					return platformSchemaService.getSchemas([
						{typeName: 'RfqHeaderDto', moduleSubModule: 'Procurement.RfQ'},
						{typeName: 'ConHeaderDto', moduleSubModule: 'Procurement.Contract'},
						{typeName: 'ConTotalDto', moduleSubModule: 'Procurement.Contract'},
						{typeName: 'ReqHeaderDto', moduleSubModule: 'Procurement.Requisition'},
						{typeName: 'EvaluationDto', moduleSubModule: 'BusinessPartner.Main'},
						{typeName: 'EvaluationItemDataDto', moduleSubModule: 'BusinessPartner.Main'},
						{typeName: 'EvaluationGroupDataDto', moduleSubModule: 'BusinessPartner.Main'},
						{typeName: 'EvaluationDocumentDto', moduleSubModule: 'BusinessPartner.Main'},
						{typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'},
						{typeName: 'MaterialPriceConditionDto', moduleSubModule: 'Basics.Material'},
						{typeName: 'PrcHeaderblobDto', moduleSubModule: 'Procurement.Common'},
						{typeName: 'PrcItemblobDto', moduleSubModule: 'Procurement.Common'},
						{typeName: 'MaterialPriceConditionDto', moduleSubModule: 'Basics.Material'},
						{typeName: 'CommonBillingSchemaDto', moduleSubModule: 'Basics.BillingSchema'},
						{typeName: 'PrcItemDto', moduleSubModule: 'Procurement.Common'},
						{typeName: 'QuoteHeaderDto', moduleSubModule: 'Procurement.Quote'},
						{typeName: 'QuoteRequisitionDto', moduleSubModule: 'Procurement.Quote'},
						{typeName: 'BoqItemDto', moduleSubModule: 'Boq.Main'},
						{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
						{typeName: 'BoqItemDto', moduleSubModule: 'Boq.Main'},
						{typeName: 'MtoPowerbiDto', moduleSubModule: 'Mtwo.ControlTower'},
						{typeName: 'MtoPowerbiitemDto', moduleSubModule: 'Mtwo.ControlTower'},
						{typeName: 'Quote2RfqVDto', moduleSubModule: 'Procurement.PriceComparison'},
						{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
						{typeName: 'PrcGeneralsDto', moduleSubModule: 'Procurement.Common'},
						{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
						{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'}
					]);
				}],
				'loadConfiguration': ['procurementPriceComparisonConfigurationService', function loadConfiguration(procurementPriceComparisonConfigurationService) {
					return procurementPriceComparisonConfigurationService.loadAllDefaultConfiguration();
				}],
				'loadLookup': ['$q', 'basicsLookupdataLookupDefinitionService', 'procurementPriceComparisonCommonHelperService', 'basicsLookupdataLookupDescriptorService', function loadLookup($q, lookupDefinitionService, commonHelperService, lookupDescriptorService) {
					return $q.all(lookupDefinitionService.load([
						'businessPartnerEvaluationSchemaIconCombobox'
					]), commonHelperService.setBoqItemTypeCodes(), commonHelperService.setBoqItemType2Codes(), lookupDescriptorService.loadData('MdcTaxCode'), commonHelperService.setProjectChangeStatus());
				}],
				registerPermissionParentObjectTypes: ['platformPermissionService', 'permissionObjectType',
					(platformPermissionService, permissionObjectType) => {
						return platformPermissionService.registerParentObjectTypes(moduleName, [permissionObjectType.project]);
					}],
				'loadPermissions': ['platformPermissionService', function loadPermissions(platformPermissionService) {
					return platformPermissionService.loadPermissions([
						'e5b91a61dbdd4276b3d92ddc84470162' // Contract
					]);
				}],
				'loadAsyncData': ['$q', 'procurementPriceComparisonCommonHelperService', function loadAsyncData($q, commonHelperService) {
					return $q.all([commonHelperService.setBoqLineTypes(), commonHelperService.loadCompareConfig()]);
				}],
				'registerWizards': ['genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService', function registerWizards(layoutService, wizardService) {
					let wizardData = [{
						serviceName: 'procurementPriceComparisonWizardService',
						wizardGuid: '8890F23EC30C4A9A8F4C638C0A2694AA',
						methodName: 'createContract',
						canActivate: true
					}, {
						serviceName: 'procurementPriceComparisonWizardService',
						wizardGuid: '3283F5E5635B4C8F9F0F8A0C2CACC81F',
						methodName: 'exportCompareData2Excel',
						canActivate: true
					}, {
						serviceName: 'procurementPriceComparisonWizardService',
						wizardGuid: 'DAE6CEAF9F1545B39C95A47C0120EEF9',
						methodName: 'exportMaterial',
						canActivate: true
					}, {
						serviceName: 'procurementPriceComparisonWizardService',
						wizardGuid: '6D6F73278226412E856BBDEEBD814840',
						methodName: 'updateEstimate',
						canActivate: true
					}, {
						serviceName: 'procurementPriceComparisonWizardService',
						wizardGuid: '435b57201a4f41e799e0e2f2c93b641e',
						methodName: 'copyBoqItemToWIC',
						canActivate: true
					}, {
						serviceName: 'procurementPriceComparisonWizardService',
						wizardGuid: 'babfbe6284b848659ad3b0d01f7ad1bf',
						methodName: 'itemEvaluation',
						canActivate: true
					}, {
						serviceName: 'procurementPriceComparisonWizardService',
						wizardGuid: 'd184de8c85954f739fa7f434963ad894',
						methodName: 'copyNewBoqItem',
						canActivate: true
					}, {
						serviceName: 'procurementPriceComparisonWizardService',
						wizardGuid: '1b7e4b0aa5be4618a7ae434c8a71c5c3',
						methodName: 'copyMaterialItem',
						canActivate: true
					}];
					wizardService.registerWizard(wizardData);
				}],
				'loadRoundingData': ['basicsCommonRoundingService', function (roundingService) {
					return roundingService.getService('basics.material').loadRounding();
				}]
			}
		};

		mainViewServiceProvider.registerModule(options);
	}]).run(['$injector', 'platformModuleNavigationService', function run($injector, navService) {
		navService.registerNavigationEndpoint({
			moduleName: moduleName,
			navFunc: function (item, triggerField) {
				$injector.get('procurementPriceComparisonMainService').navigationCompleted(item, triggerField);
			}
		});
	}]);
})(angular);
