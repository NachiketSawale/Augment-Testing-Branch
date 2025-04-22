/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals,_ */

	var moduleName = 'sales.billing';

	angular.module(moduleName, ['ui.router', 'platform', 'sales.common', 'model.main', 'model.evaluation']);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name sales.billing
	 * @description
	 * Module definition of the sales billing module
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
							{typeName: 'SalesHeaderblobDto',        moduleSubModule: 'Sales.Common'},
							{typeName: 'DocumentDto',               moduleSubModule: 'Sales.Billing'},
							{typeName: 'GeneralsDto',               moduleSubModule: 'Sales.Billing'},
							{typeName: 'BilHeaderDto',              moduleSubModule: 'Sales.Billing'},
							{typeName: 'TransactionDto',            moduleSubModule: 'Sales.Billing'},
							{typeName: 'ValidationDto',             moduleSubModule: 'Sales.Billing'},
							{typeName: 'ItemDto',                   moduleSubModule: 'Sales.Billing'},
							{typeName: 'PaymentDto',                moduleSubModule: 'Sales.Billing'},
							{typeName: 'BillingschemaDto',          moduleSubModule: 'Sales.Billing'},
							{typeName: 'AccrualDto',                moduleSubModule: 'Sales.Billing'},
							{typeName: 'IndirectCostBalancingConfigDetailDto', moduleSubModule: 'Sales.Billing'},
							{typeName: 'OrdPaymentScheduleDto',     moduleSubModule: 'Sales.Contract'},
							{typeName: 'WipHeaderDto',              moduleSubModule: 'Sales.Wip'},
							{typeName: 'DocumentDto',               moduleSubModule: 'Sales.Wip'},
							{typeName: 'ClerkDataDto',              moduleSubModule: 'Basics.Common'},
							{typeName: 'HeaderPparamDto',           moduleSubModule: 'Basics.PriceCondition'},
							{typeName: 'ClobDto',                   moduleSubModule: 'Cloud.Common'},
							{typeName: 'GuarantorDto',              moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'SubsidiaryDto',             moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'CertificateDto',            moduleSubModule: 'BusinessPartner.Certificate'},
							{typeName: 'ContactDto',                moduleSubModule: 'BusinessPartner.Contact'},
							{typeName: 'ChangeDto',                 moduleSubModule: 'Change.Main'},
							{typeName: 'ControllingGrpSetDTLDto',   moduleSubModule: 'Controlling.Structure'},
							{typeName: 'DocumentDto',               moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto',       moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentHistoryDto',        moduleSubModule: 'Documents.Project'},
							{typeName: 'EstLineItemDto',            moduleSubModule: 'Estimate.Main'},
							{typeName: 'EstResourceDto',            moduleSubModule: 'Estimate.Main'},
							{typeName: 'EstHeaderDto',              moduleSubModule: 'Estimate.Main'},
							{typeName: 'ViewpointDto',              moduleSubModule: 'Model.Main'},
							{typeName: 'ObjectAttributeDto',        moduleSubModule: 'Model.Main'},
							{typeName: 'ViewerLegendItemDto',       moduleSubModule: 'Model.Main'},
							{typeName: 'ModelRulesetDto',           moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRulesetGroupDto',      moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRuleDto',              moduleSubModule: 'Model.Evaluation'},
							{typeName: 'QtoDetailDto',              moduleSubModule: 'Qto.Main'},
							{typeName: 'BoqItem2DispatchRecordDto', moduleSubModule:'Boq.Main'},
						], boqMainSchemaService.getSchemas());

						return platformSchemaService.getSchemas(schemas);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService',
						function (basicsLookupdataLookupDefinitionService) {
							return basicsLookupdataLookupDefinitionService.load([
								'boqMainTextComplementCombobox'
							]);
						}
					],
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
					'statusLookup': ['salesBillingStatusLookupDataService',
						function (salesBillingStatusLookupDataService) {
							// invoke lookup loading
							return salesBillingStatusLookupDataService.getList({lookupType: 'salesBillingStatusLookupDataService'});
						}
					],
					'typeLookup': [ 'salesBillTypeLookupDataService',
						function (salesBillTypeLookupDataService) {
							// invoke lookup loading
							return salesBillTypeLookupDataService.getList();
						}
					],
					'invoiceTypeLookup': ['basicsLookupdataSimpleLookupService', 'salesBillingInvoiceTypeLookupOptions',
						function (basicsLookupdataSimpleLookupService, salesBillingInvoiceTypeLookupOptions) {
							return basicsLookupdataSimpleLookupService.getList(salesBillingInvoiceTypeLookupOptions);
						}
					],
					'billTypeLookup': ['basicsLookupdataSimpleLookupService', 'salesBillingBillTypeLookupOptions',
						function (basicsLookupdataSimpleLookupService, salesBillingBillTypeLookupOptions) {
							return basicsLookupdataSimpleLookupService.getList(salesBillingBillTypeLookupOptions);
						}
					],
					// TODO: taxcodematrix replace when lookup is available in basics tax code
					// TODO: see revision 118383 (trunk) => basicsCustomTaxCodeMatrixLookupDataService can be used again.
					'taxCodeMatrixLookup': ['_', '$http', 'basicsLookupdataLookupDescriptorService',
						function (_, $http, basicsLookupdataLookupDescriptorService) {
							return $http.post(globals.webApiBaseUrl + 'sales/billing/taxcodematrix')
								.then((result) => {
									var taxCodeMatrices = result.data;
									basicsLookupdataLookupDescriptorService.updateData('Sales_TaxCodeMatrix', taxCodeMatrices);
								})
								.catch(_.noop);
						}],
					'taxCodeLookup': ['basicsLookupdataLookupDescriptorService',
						function (basicsLookupdataLookupDescriptorService) {
							return basicsLookupdataLookupDescriptorService.loadData(['TaxCode']);
						}],
					'Configuration': ['basicsLookupdataLookupDescriptorService',
						function (basicsLookupdataLookupDescriptorService) {
							return basicsLookupdataLookupDescriptorService.loadData(['prcconfiguration']);
						}],
					'initSystemOptions': ['salesCommonSystemOptionService',
						function (salesCommonSystemOptionService) {
							return salesCommonSystemOptionService.init();
						}],
					'initStatusHelper': ['salesCommonStatusHelperService', function (salesCommonStatusHelperService) {
						return salesCommonStatusHelperService.initData();
					}],
					'initContext': ['salesCommonContextService',
						function (salesCommonContextService) {
							return salesCommonContextService.init();
						}
					],
					'registerWizards': ['basicsConfigWizardSidebarService', function (wizardService) {
						var wizardData = [
							{
								serviceName: 'documentsCentralQueryWizardService',
								wizardGuid: '09e2088390c740e1ab8da6c98cf61fcc',
								methodName: 'changeRubricCategory',
								canActivate: true,
								userParam: {
									'moduleName': moduleName
								}
							},
							{
								serviceName: 'salesBillingWizardService',
								wizardGuid: '538325604B524F328FDF436FB14F1FC8',
								methodName: 'changeCertificateStatus',
								canActivate: true,
							}
						];
						wizardService.registerWizard(wizardData);
					}]
				}
			});
		}
	]).run(['$injector', 'platformModuleNavigationService', 'basicsConfigWizardSidebarService', 'salesCommonGeneralsServiceFactory',
		function ($injector, naviService, wizardService, salesCommonGeneralsServiceFactory) {

			// register wizards
			var CreateWD = wizardService.WizardData;
			var wizardData = [
				// Billing
				new CreateWD('salesBillingWizardService', 'DF04A23B847F46A9AD9E9D174DBE7C80', 'changeBillStatus'),
				new CreateWD('salesBillingWizardService', 'd98d93b8448b4346857d9a5479db98e1', 'setPreviousBill'),
				new CreateWD('salesBillingWizardService', 'A12E48BB996F4113B58045FCEA70CA87', 'createXBill'),
				new CreateWD('salesBillingWizardService', '68f639053d854cc1a029f92286462f9d', 'changeCode'),
				new CreateWD('salesBillingWizardService', 'c29eb0251bef43ea8bd0237ec63bdeab', 'createAccruals'),
				new CreateWD('salesBillingWizardService', 'dabafbe9ed25475e8a1042f15987c3cf', 'createConsecutiveBillNo'),
				new CreateWD('salesBillingWizardService', '04cc282976bb4c3098325b37c67f29e3', 'createCreditMemo'),
				new CreateWD('salesBillingWizardService', '1e21abccb5984f9d8b200b720def6a50', 'assignBillToPaymentScheduleLine'),
				new CreateWD('procurementInvoiceWizardsService', 'fc993dfaef494f748180a24bfba8bfe8', 'createInterCompanyBill'),
				new CreateWD('salesBillingWizardService', 'ac5368e8644c40ef81bc53ad47e68994', 'changeBillPaymentStatus'),
				// BoQ
				new CreateWD('salesBillingWizardService', '4EFE1C85291F474888818EADB3A7FE4D', 'GaebImport'),
				new CreateWD('salesBillingWizardService', '384C07F178784E468DF6B0E932DABCE7', 'GaebExport'),
				new CreateWD('salesBillingWizardService', 'dc1f30673d25402f8791e854962aef72', 'importOenOnlv'),
				new CreateWD('salesBillingWizardService', '244e3ab2210a4f55a10f9561b8a63b89', 'exportOenOnlv'),
				new CreateWD('salesBillingWizardService', '759D819100CF4364865692F35042F441', 'importCrbSia'),
				new CreateWD('salesBillingWizardService', 'F7EFF32004324BDD925973799C175DF0', 'exportCrbSia'),
				new CreateWD('salesBillingWizardService', '37b726a2ed9442f4ad3b39a858fe1509', 'boqExportExcel'),
				new CreateWD('salesBillingWizardService', 'ed5100547c6349e68b7cf92f4030ff37', 'boqImportExcel'),
				new CreateWD('salesBillingWizardService', '2d61b03531c448c38e22137e423182b5', 'startQuantityInspector'),
				new CreateWD('salesBillingWizardService', '965110082D604CEDAB8CBC2E7C0219A4', 'RenumberBoQ'),
				new CreateWD('salesBillingWizardService', '015D77D0706A4977B983CB961E5B8242', 'TakeoverBoQ'),
				new CreateWD('salesBillingWizardService', '4626490160134270b69962eee026e817', 'scanBoq'),
				new CreateWD('salesBillingWizardService', 'F26DEA09A9664126B7AF736E943EBA40', 'updateBoq'),
				new CreateWD('salesBillingWizardService', '5d2cd8aa90c441b0b9470f418058d522', 'changeBoqHeaderStatus'),
				// Billing Posting
				new CreateWD('salesBillingWizardService', '5490051083a04e9dabc26c4c7398b162', 'createTransactions'),
				new CreateWD('salesBillingWizardService', '2D7061FD91824AE5900AE4DDF5331EB1', 'prepareTransaction'),
				new CreateWD('salesBillingWizardService', '5A36EEA7FC534B1CAFD93E8E59487EC7', 'prepareTransactionForAll'),
				// Indirect Cost Balancing
				new CreateWD('salesBillingWizardService', '465169acea5e490187ff22e0f6db0801', 'setBoqItemFlag'),
				new CreateWD('salesBillingWizardService', 'c0daf23f15e042969111a1ced47d0185', 'updateDirectCostPerUnit'),
				// Userforms
				new CreateWD('basicsUserFormFormDataWizardService', '756badc830b74fdcbf6b6ddc3f92f7bd', 'changeFormDataStatus'),
				// Documents Project
				new CreateWD('salesBillingWizardService', '9DB62F61A03642B7B8FC0437A0542A0F', 'changeStatusForProjectDocument'),
				new CreateWD('salesBillingWizardService', '5f6eccab1fe8481b8a1973c4daea0c8e', 'changeSalesConfiguration'),
				//Invoice
				new CreateWD('salesBillingWizardService', '67dfb8157a614de6aa24a81dda35b5f2', 'createInterCompanyInvoice'),
			];
			wizardService.registerWizard(wizardData);

			naviService.registerNavigationEndpoint({
				moduleName: moduleName,
				navFunc: function (item, triggerField) {
					$injector.get('salesBillingService').setBilHeader(item, triggerField);
				}
			});

			salesCommonGeneralsServiceFactory.registerServiceContainer(moduleName, {
				parentService: 'salesBillingService',
				apiUrl: 'sales/billing/generals/',
				moduleName: 'Sales.Billing'
			});
		}]);
})();
