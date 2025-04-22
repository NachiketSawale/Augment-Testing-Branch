/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals,_ */

	var moduleName = 'sales.contract';

	angular.module(moduleName, ['ui.router', 'platform', 'sales.common', 'model.main', 'model.evaluation']);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name sales.contract
	 * @description
	 * Module definition of the sales contract module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			mainViewServiceProvider.registerModule({
				'moduleName': moduleName,
				'resolve': {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function (platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					'loadDomains': ['platformSchemaService', 'boqMainSchemaService', function (platformSchemaService, boqMainSchemaService) {

						var schemas = _.concat([
							{typeName: 'OrdMandatoryDeadlineDto', moduleSubModule: 'Sales.Common'},
							{typeName: 'SalesHeaderblobDto',    moduleSubModule: 'Sales.Common'},
							{typeName: 'OrdHeaderDto',          moduleSubModule: 'Sales.Contract'},
							{typeName: 'GeneralsDto',           moduleSubModule: 'Sales.Contract'},
							{typeName: 'OrdBillingschemaDto',   moduleSubModule: 'Sales.Contract'},
							{typeName: 'DocumentDto',           moduleSubModule: 'Sales.Contract'},
							{typeName: 'OrdCertificateDto',     moduleSubModule: 'Sales.Contract'},
							{typeName: 'OrdPaymentScheduleDto', moduleSubModule: 'Sales.Contract'},
							{typeName: 'OrdTransactionDto',     moduleSubModule: 'Sales.Contract'},
							{typeName: 'OrdAdvanceDto',         moduleSubModule: 'Sales.Contract'},
							{typeName: 'OrdWarrantyDto',        moduleSubModule: 'Sales.Contract'},
							{typeName: 'OrdMilestoneDto',       moduleSubModule: 'Sales.Contract'},
							{typeName: 'OrdValidationDto',      moduleSubModule: 'Sales.Contract'},
							{typeName: 'GeneralsDto',           moduleSubModule: 'Sales.Billing'},
							{typeName: 'GeneralsDto',           moduleSubModule: 'Sales.Wip' },
							{typeName: 'WipHeaderDto',          moduleSubModule: 'Sales.Wip'},
							{typeName: 'BilHeaderDto',          moduleSubModule: 'Sales.Billing'},
							{typeName: 'ClobDto',               moduleSubModule: 'Cloud.Common'},
							{typeName: 'HeaderPparamDto',       moduleSubModule: 'Basics.PriceCondition'},
							{typeName: 'ClerkDataDto',          moduleSubModule: 'Basics.Common'},
							{typeName: 'CertificateDto',        moduleSubModule: 'BusinessPartner.Certificate'},
							{typeName: 'Certificate2subsidiaryDto', moduleSubModule: 'BusinessPartner.Certificate'},
							{typeName: 'GuarantorDto',          moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'ContactDto',            moduleSubModule: 'BusinessPartner.Contact'},
							{typeName: 'SubsidiaryDto',         moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'ChangeDto',             moduleSubModule: 'Change.Main'},
							{typeName: 'DocumentDto',           moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto',   moduleSubModule: 'Documents.Project'},
							{typeName: 'ObjectAttributeDto',    moduleSubModule: 'Model.Main'},
							{typeName: 'ViewerLegendItemDto',   moduleSubModule: 'Model.Main'},
							{typeName: 'ViewpointDto',          moduleSubModule: 'Model.Main'},
							{typeName: 'ModelRulesetDto',       moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRulesetGroupDto',  moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRuleDto',          moduleSubModule: 'Model.Evaluation'},
							{typeName: 'HeaderDto',             moduleSubModule: 'ProductionPlanning.Header'},
							{typeName: 'EventDto',              moduleSubModule: 'ProductionPlanning.Common'},
						], boqMainSchemaService.getSchemas());

						return platformSchemaService.getSchemas(schemas);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService',
						function (basicsLookupdataLookupDefinitionService) {
							return basicsLookupdataLookupDefinitionService.load([
								'boqMainTextComplementCombobox',
								'boqMainCatalogAssignmentModeCombobox'
							]);
						}],
					'loadContextData': ['controllingStructureContextService', function (controllingStructureContextService) {
						// TODO: from controlling module. change to sales service (which can use internally controlling-*)
						// init context information like current company, master data context, etc.
						return controllingStructureContextService.init();
					}],
					'loadTranslation': ['platformTranslateService',  function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName], true);
					}],
					registerPermissionParentObjectTypes: ['platformPermissionService', 'permissionObjectType',
						(platformPermissionService, permissionObjectType) => {
							return platformPermissionService.registerParentObjectTypes(moduleName, [permissionObjectType.project]);
						}],
					'loadPermissions': ['platformPermissionService', function (platformPermissionService) {
						return platformPermissionService.loadPermissions([
							'f86aa473785b4625adcabc18dfde57ac'
						]);
					}],
					'loadFunctionalRole': ['salesCommonFunctionalRoleService', function (salesCommonFunctionalRoleService) {
						return salesCommonFunctionalRoleService.loadFunctionalRolesForBillingMethods();
					}],
					'Configuration': ['basicsLookupdataLookupDescriptorService',
						function (basicsLookupdataLookupDescriptorService) {
							return basicsLookupdataLookupDescriptorService.loadData(['prcconfiguration']);
						}],
					'billingNumberGeneration': ['salesBillingNumberGenerationSettingsService',
						function (salesBillingNumberGenerationSettingsService) {
							return salesBillingNumberGenerationSettingsService.load();
						}],
					'initContext': ['salesCommonContextService',
						function (salesCommonContextService) {
							return salesCommonContextService.init();
						}
					],
					'statusLookup': [ 'salesContractStatusLookupDataService',
						function (salesContractStatusLookupDataService) {
							// invoke lookup loading
							return salesContractStatusLookupDataService.getList({lookupType: 'salesContractStatusLookupDataService'});
						}],
					'typeLookup': [ 'salesContractTypeLookupDataService',
						function (salesContractTypeLookupDataService) {
							// invoke lookup loading
							return salesContractTypeLookupDataService.getList();
						}
					],
					'registerWizards':  ['basicsConfigWizardSidebarService', function(wizardService) {
						var CreateWD = wizardService.WizardData;
						var wizardData = [
							// Contract
							new CreateWD('salesContractWizardService', '9C25C7FCC5964600B0E829CDA55B9E2C', 'changeContractStatus'),
							new CreateWD('salesContractWizardService', '314c998a4e4048bbac900c57e56c2c5d', 'changeCode'),
							new CreateWD('salesContractWizardService', '9d97cb3943864fe1a78b7d6af5e21944', 'setAdvancePaymentLineStatus'),
							// Create Wizards / Tools
							new CreateWD('salesContractWizardService', 'B812EA3D7DD64B3AA97387395D70B82D', 'createBill'),
							new CreateWD('salesContractWizardService', 'C3EEEDBC977049B08CB321A3D574B39C', 'createWip'),
							new CreateWD('salesContractWizardService', '2353CFD8CAF042A587FFAB9AC90BFDFA', 'createRevenue'),
							new CreateWD('salesContractWizardService', '225e48794c324d858c741c19159da545', 'createWicFromContract'),// createFrameworkWicCatalogWizard
							new CreateWD('salesContractWizardService', '45da63d5abdb47d260b56d1deffcc249', 'generateTransactions'),
							new CreateWD('salesContractWizardService', '7e4c43416c334aeaaa17be7c702235b1', 'generateAdvancePaymentBill'),
							// Payment Schedule
							new CreateWD('salesContractWizardService', '5d038199d29d41b4be0ba27956824e10', 'generatePaymentSchedule'),
							new CreateWD('salesContractWizardService', '04cf1b2cd29141a1bb7ff885d0ab3f8f', 'maintainPaymentScheduleVersion'),
							new CreateWD('salesContractWizardService', '917973f5ff674e618235d32e10c4077d', 'changePaymentScheduleStatus'),
							new CreateWD('salesContractWizardService', 'c0ce3e30b54e429b9995f8ecdf94f654', 'updatePaymentScheduleDOC'),
							new CreateWD('salesContractWizardService', 'e494c864688d4d999b7032c89ee6a02c', 'generateBillFromPaymentSchedule'),
							new CreateWD('salesContractWizardService', 'c89d65f760f04970ba295a62021f2e22', 'generatePaymentScheduleFromSchedule'),
							// BoQ
							new CreateWD('salesContractWizardService', '0DB63488DC384D54907EF03C2735C1A2', 'GaebImport'),
							new CreateWD('salesContractWizardService', '732A95C51789412395DEEC94101C42EA', 'GaebExport'),
							new CreateWD('salesContractWizardService', 'dc1f30673d25402f8791e854962aef72', 'importOenOnlv'),
							new CreateWD('salesContractWizardService', '244e3ab2210a4f55a10f9561b8a63b89', 'exportOenOnlv'),
							new CreateWD('salesContractWizardService', '862EE5DCB3BD44E9A6E367069100AD1C', 'importCrbSia'),
							new CreateWD('salesContractWizardService', '4E7E99B3C3714DC39819CC3F187578C4', 'exportCrbSia'),
							new CreateWD('salesContractWizardService', 'D93130BC39FE405DB26D8E50A4177CCF', 'RenumberBoQ'),
							new CreateWD('salesContractWizardService', '9656C946AD954772B4030861AE9A3C70', 'TakeoverBoQ'),
							new CreateWD('salesContractWizardService', 'a63da5e93d0e46a096e282fe35f41357', 'selectGroups'),
							new CreateWD('salesContractWizardService', '37b726a2ed9442f4ad3b39a858fe1509', 'BoqExcelExport'),
							new CreateWD('salesContractWizardService', 'ed5100547c6349e68b7cf92f4030ff37', 'BoqExcelImport'),
							new CreateWD('salesContractWizardService', '2d61b03531c448c38e22137e423182b5', 'startQuantityInspector'),
							new CreateWD('salesContractWizardService', '4626490160134270b69962eee026e817', 'scanBoq'),
							new CreateWD('salesContractWizardService', 'b94b6e7468434e8d9dab70d81114a2bb', 'createAndImportBoqs'),
							new CreateWD('salesContractWizardService', '76706b3ac25b4658b4728f06356a665a', 'changeBoqHeaderStatus'),
							new CreateWD('salesContractWizardService', '87AC76EC1B914A20AFC68BBC7E299C89', 'updateBoq'),
							new CreateWD('salesContractWizardService', '10ff30fba6614803a92f6098bb679619', 'updateProjectBoq'),
							// Estimate
							new CreateWD('salesContractWizardService', 'e5f4f53d40174379a5b612caf7d80d83', 'updateEstimate'),
							new CreateWD('salesContractWizardService', '4c51d56e1f084fa99640e47df9d0cb13', 'updateEstimate2'), // TODO: #143618 needs to be discussed see updateEstimate above (=> rename)
							// Userforms
							new CreateWD('basicsUserFormFormDataWizardService', '756badc830b74fdcbf6b6ddc3f92f7bd', 'changeFormDataStatus'),
							// Documents Project
							new CreateWD('documentsCentralQueryWizardService', '09e2088390c740e1ab8da6c98cf61fcc', 'changeRubricCategory', true,false,{moduleName: moduleName}),
							new CreateWD('salesContractWizardService', '3974B2D3F99148FF90A581263A1FFC0F', 'changeStatusForProjectDocument'),
							new CreateWD('salesContractWizardService', '83bf7ef150a24b999652f2b21b4081cc', 'changeSalesConfiguration'),
							new CreateWD('salesContractWizardService', '538325604B524F328FDF436FB14F1FC8', 'changeCertificateStatus')
						];

						wizardService.registerWizard(wizardData);
					}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', '$http', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue, $http) {
						var ppsEntityId = ppsCommonCodGeneratorConstantValue.PpsEntityConstant.PPSHeader;
						$http.get(globals.webApiBaseUrl + 'productionplanning/common/getRubricCatId?ppsEntityId=' + ppsEntityId).then(function (response) {
							ppsCommonCodGeneratorConstantValue.CategoryConstant.PpsHeaderCat = response.data;
						});
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsHeaderNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.ProductionPlanning).load();
					}]
				}
			});
		}
	]).run(['$injector', 'platformModuleNavigationService', 'basicsConfigWizardSidebarService', 'salesCommonGeneralsServiceFactory',
		function ($injector, naviService, wizardService, salesCommonGeneralsServiceFactory) {

			naviService.registerNavigationEndpoint({
				moduleName: moduleName,
				navFunc: function (item, triggerField) {
					$injector.get('salesContractService').setOrdHeader(item, triggerField);
				}
			});

			naviService.registerNavigationEndpoint({
				moduleName: moduleName + '-paymentSchedule',
				navFunc: function (item, triggerField){
					$injector.get('salesContractPaymentScheduleDataService').navigateHelpService(item, triggerField);
				}
			});

			salesCommonGeneralsServiceFactory.registerServiceContainer(moduleName, {
				parentService: 'salesContractService',
				apiUrl: 'sales/contract/generals/',
				moduleName: 'Sales.Contract'
			});
		}]);
})();
