/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/* global globals,_ */
	var moduleName = 'sales.wip';

	angular.module(moduleName, ['ui.router', 'platform', 'sales.common', 'model.main', 'model.evaluation']);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name sales.wip
	 * @description
	 * Module definition of the sales wip module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			mainViewServiceProvider.registerModule({
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function (platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['platformSchemaService', 'boqMainSchemaService', function (platformSchemaService, boqMainSchemaService) {
						var schemas = _.concat([
							{typeName: 'SalesHeaderblobDto', moduleSubModule: 'Sales.Common'},
							{typeName: 'OrdHeaderDto', moduleSubModule: 'Sales.Contract'},
							{typeName: 'GeneralsDto', moduleSubModule: 'Sales.Wip'},
							{typeName: 'WipTransactionDto', moduleSubModule: 'Sales.Wip'},
							{typeName: 'WipValidationDto', moduleSubModule: 'Sales.Wip'},
							{typeName: 'WipAccrualDto', moduleSubModule: 'Sales.Wip'},
							{typeName: 'DocumentDto', moduleSubModule: 'Sales.Wip'},
							{typeName: 'WipBillingschemaDto', moduleSubModule: 'Sales.Wip'},
							{typeName: 'WipHeaderDto', moduleSubModule: 'Sales.Wip'},
							{typeName: 'GeneralsDto', moduleSubModule: 'Sales.Billing'},
							{typeName: 'BilHeaderDto', moduleSubModule: 'Sales.Billing'},
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'HeaderPparamDto', moduleSubModule: 'Basics.PriceCondition'},
							{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
							{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'ChangeDto', moduleSubModule: 'Change.Main'},
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'EstResourceDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'EstHeaderDto', moduleSubModule: 'Estimate.Main'},
							{typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ModelRulesetDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRulesetGroupDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRuleDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'QtoDetailDto', moduleSubModule: 'Qto.Main'},
							{typeName: 'BoqItem2DispatchRecordDto', moduleSubModule:'Boq.Main'},
						], boqMainSchemaService.getSchemas());

						return platformSchemaService.getSchemas(schemas);
					}],
					loadLookup: ['basicsLookupdataLookupDefinitionService',
						function (basicsLookupdataLookupDefinitionService) {
							return basicsLookupdataLookupDefinitionService.load([
								'boqMainTextComplementCombobox'
							]);
						}],
					loadContextData: ['controllingStructureContextService', function (controllingStructureContextService) {
						// TODO: from controlling module. change to sales service (which can use internally controlling-*)
						// init context information like current company, master data context, etc.
						return controllingStructureContextService.init();
					}],
					loadTranslation: ['platformTranslateService',
						function (platformTranslateService) {
							return platformTranslateService.registerModule([moduleName], true);
						}],
					registerPermissionParentObjectTypes: ['platformPermissionService', 'permissionObjectType',
						(platformPermissionService, permissionObjectType) => {
							return platformPermissionService.registerParentObjectTypes(moduleName, [permissionObjectType.project]);
						}],
					loadPermissions: ['platformPermissionService',
						(platformPermissionService) => {
							return platformPermissionService.loadPermissions([
								'f86aa473785b4625adcabc18dfde57ac'
							]);
						}],
					'loadFunctionalRole': ['salesCommonFunctionalRoleService', function (salesCommonFunctionalRoleService) {
						return salesCommonFunctionalRoleService.loadFunctionalRolesForBillingMethods();
					}],
					statusLookup: ['salesWipStatusLookupDataService',
						function (salesWipStatusLookupDataService) {
							// Defect #79467: invoke lookup loading
							return salesWipStatusLookupDataService.getList({lookupType: 'salesWipStatusLookupDataService'});
						}],
					configuration: ['basicsLookupdataLookupDescriptorService',
						function (basicsLookupdataLookupDescriptorService) {
							return basicsLookupdataLookupDescriptorService.loadData(['prcconfiguration']);
						}],
					taxCodeLookup: ['basicsLookupdataLookupDescriptorService',
						function (basicsLookupdataLookupDescriptorService) {
							return basicsLookupdataLookupDescriptorService.loadData(['TaxCode']);
						}],
					wipNumberGeneration: ['salesWipNumberGenerationSettingsService',
						function (salesWipNumberGenerationSettingsService) {
							return salesWipNumberGenerationSettingsService.load();
						}],
					billingNumberGeneration: ['salesBillingNumberGenerationSettingsService',
						function (salesBillingNumberGenerationSettingsService) {
							return salesBillingNumberGenerationSettingsService.load();
						}],
					initContext: ['salesCommonContextService',
						function (salesCommonContextService) {
							return salesCommonContextService.init();
						}
					],
					registerWizards: ['basicsConfigWizardSidebarService', function (wizardService) {
						// register wizards
						var CreateWD = wizardService.WizardData;
						var wizardData = [
							// Wip
							new CreateWD('salesWipWizardService', 'F7CE1DE0712F45AABD838D74DAED5230', 'changeWipStatus'),
							new CreateWD('salesWipWizardService', 'bd22d19d486848db8a628ef2c6427768', 'changeCode'),
							new CreateWD('salesWipWizardService', 'e97fc71537d34237bc8db9486e41b571', 'setPreviousWip'),
							// Create Wizards / Tools
							new CreateWD('salesWipWizardService', 'CA5FF47747054AF3BC9C441C264F0761', 'createBill'),
							new CreateWD('salesWipWizardService', '248fae351d76437d80b1284306b0284e', 'createAccruals'),
							new CreateWD('salesWipWizardService', '2a34314ad0e6f82afd70140fd80205eb', 'generateTransactions'),
							// BoQ
							new CreateWD('salesWipWizardService', '7D29BA7776A54AC7AC61150965DEF37D', 'GaebImport'),
							new CreateWD('salesWipWizardService', 'BD224FA0FB0D465498638B47573F2B11', 'GaebExport'),
							new CreateWD('salesWipWizardService', 'dc1f30673d25402f8791e854962aef72', 'importOenOnlv'),
							new CreateWD('salesWipWizardService', '244e3ab2210a4f55a10f9561b8a63b89', 'exportOenOnlv'),
							new CreateWD('salesWipWizardService', '78435BBCEFBB423A922737744225D185', 'importCrbSia'),
							new CreateWD('salesWipWizardService', 'B031C4DF0A67438C91FE005D59CFBD00', 'exportCrbSia'),
							new CreateWD('salesWipWizardService', '37b726a2ed9442f4ad3b39a858fe1509', 'boqExportExcel'),
							new CreateWD('salesWipWizardService', 'ed5100547c6349e68b7cf92f4030ff37', 'boqImportExcel'),
							new CreateWD('salesWipWizardService', '2d61b03531c448c38e22137e423182b5', 'startQuantityInspector'),
							new CreateWD('salesWipWizardService', 'F8F6B9EB85644124A8EC77DBCEBFF577', 'RenumberBoQ'),
							new CreateWD('salesWipWizardService', '74C6169EB266421E8D70581699BAB956', 'TakeoverBoQ'),
							new CreateWD('salesWipWizardService', 'a63da5e93d0e46a096e282fe35f41357', 'selectGroups'),
							new CreateWD('salesWipWizardService', '4626490160134270b69962eee026e817', 'scanBoq'),
							new CreateWD('salesWipWizardService', '4831bd86bb1c47f79d41998976fb534b', 'updateQuantity'),
							new CreateWD('salesWipWizardService', 'b94b6e7468434e8d9dab70d81114a2bb', 'createAndImportBoqs'),
							new CreateWD('salesWipWizardService', '795B8C89F1BC4FDA923B62E3D6507CC9', 'updateBoq'),
							new CreateWD('salesWipWizardService', '8799d51a51394a448e1f4086c498bc34', 'changeBoqHeaderStatus'),
							new CreateWD('salesWipWizardService', 'b08281a460f2442a94c00eb195b4147b', 'updateDirectCostPerUnit'),
							// Userforms
							new CreateWD('basicsUserFormFormDataWizardService', '756badc830b74fdcbf6b6ddc3f92f7bd', 'changeFormDataStatus'),
							// Documents Project
							new CreateWD('documentsCentralQueryWizardService', '09e2088390c740e1ab8da6c98cf61fcc', 'changeRubricCategory', true, false, {moduleName: moduleName}),
							new CreateWD('salesWipWizardService', 'DE851D1A516A444C85458B5AC722B939', 'changeStatusForProjectDocument'),
							new CreateWD('salesWipWizardService', '3064f8fed2bd47189cd35a5582b2a483', 'changeSalesConfiguration'),
						];
						wizardService.registerWizard(wizardData);
					}]

				}
			});
		}
	]).run(['$injector', 'platformModuleNavigationService', 'salesCommonGeneralsServiceFactory',
		function ($injector, naviService, salesCommonGeneralsServiceFactory) {

			naviService.registerNavigationEndpoint({
				moduleName: moduleName,
				navFunc: function (item, triggerField) {
					$injector.get('salesWipService').setWipHeader(item, triggerField);
				}
			});

			salesCommonGeneralsServiceFactory.registerServiceContainer(moduleName, {
				parentService: 'salesWipService',
				apiUrl: 'sales/wip/generals/',
				moduleName: 'Sales.Wip'
			});
		}]);
})();
