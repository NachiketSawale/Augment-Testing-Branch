/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals, _ */
	var moduleName = 'sales.bid';

	angular.module(moduleName, ['ui.router', 'platform', 'sales.common', 'model.main', 'model.evaluation']);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name sales.bid
	 * @description
	 * Module definition of the sales bid module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			mainViewServiceProvider.registerModule({
				'moduleName': moduleName,
				'resolve': {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function (platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					'loadDomains': ['platformSchemaService', 'boqMainSchemaService', function(platformSchemaService, boqMainSchemaService) {
						var schemas = _.concat([
							{typeName: 'OrdMandatoryDeadlineDto', moduleSubModule: 'Sales.Common'},
							{typeName: 'SalesHeaderblobDto',    moduleSubModule: 'Sales.Common'},
							{typeName: 'BidHeaderDto',          moduleSubModule: 'Sales.Bid'},
							{typeName: 'GeneralsDto',           moduleSubModule: 'Sales.Bid'},
							{typeName: 'BidBillingschemaDto',   moduleSubModule: 'Sales.Bid'},
							{typeName: 'DocumentDto',           moduleSubModule: 'Sales.Bid'},
							{typeName: 'BidCertificateDto',     moduleSubModule: 'Sales.Bid'},
							{typeName: 'BidWarrantyDto',        moduleSubModule: 'Sales.Bid'},
							{typeName: 'BidMilestoneDto',       moduleSubModule: 'Sales.Bid'},
							{typeName: 'ClobDto',               moduleSubModule: 'Cloud.Common'},
							{typeName: 'HeaderPparamDto',       moduleSubModule: 'Basics.PriceCondition'},
							{typeName: 'ClerkDataDto',          moduleSubModule: 'Basics.Common'},
							{typeName: 'CertificateDto',        moduleSubModule: 'BusinessPartner.Certificate'},
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
						], boqMainSchemaService.getSchemas());

						return platformSchemaService.getSchemas(schemas);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService',
						function (basicsLookupdataLookupDefinitionService) {
							return basicsLookupdataLookupDefinitionService.load([
								'boqMainTextComplementCombobox',
								'boqMainCatalogAssignmentModeCombobox'
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
					'statusLookup': [ 'salesBidStatusLookupDataService',
						function (salesBidStatusLookupDataService) {
							// invoke lookup loading
							return salesBidStatusLookupDataService.getList({lookupType: 'salesBidStatusLookupDataService'});
						}
					],
					'typeLookup': [ 'salesBidTypeLookupDataService',
						function (salesBidTypeLookupDataService) {
							// invoke lookup loading
							return salesBidTypeLookupDataService.getList();
						}
					],
					'Configuration': ['basicsLookupdataLookupDescriptorService',
						function (basicsLookupdataLookupDescriptorService) {
							return basicsLookupdataLookupDescriptorService.loadData(['prcconfiguration']);
						}],
					'initContext': ['salesCommonContextService',
						function (salesCommonContextService) {
							return salesCommonContextService.init();
						}
					],
					'registerWizards':  ['basicsConfigWizardSidebarService', function(wizardService) {
						// register wizards
						var CreateWD = wizardService.WizardData;
						var wizardData = [
							// Bid
							new CreateWD('salesBidWizardService', '30CCCC5AE6F34808AAC013B72CD1D361', 'changeBidStatus'),
							new CreateWD('salesBidWizardService', 'b1bfa908348341cbbd74c73879e0d484', 'changeCode'),
							// Contract
							new CreateWD('salesBidWizardService', '43C3C8576E144541B8FC2CAA7CCD2872', 'createContract'),
							// BoQ
							new CreateWD('salesBidWizardService', '6DCBD03C0D7D4F72B8CEAFC357919243', 'generateBidBoQ'),
							new CreateWD('salesBidWizardService', 'A197474FD46F4F6E9DBB9DE13D974B2E', 'GaebImport'),
							new CreateWD('salesBidWizardService', 'B5757F090086481AB7B23754DEDDB584', 'GaebExport'),
							new CreateWD('salesBidWizardService', 'dc1f30673d25402f8791e854962aef72', 'importOenOnlv'),
							new CreateWD('salesBidWizardService', '244e3ab2210a4f55a10f9561b8a63b89', 'exportOenOnlv'),
							new CreateWD('salesBidWizardService', '1a98c62ee5ff4988aa05f76b891f1229', 'importCrbSia'),
							new CreateWD('salesBidWizardService', '69B4CFF0BD0A4DE0A16E7A26FF0341C3', 'exportCrbSia'),
							new CreateWD('salesBidWizardService', '2d61b03531c448c38e22137e423182b5', 'startQuantityInspector'),
							new CreateWD('salesBidWizardService', 'BB148245D8B84CAA8FBDD810E25B8D41', 'RenumberBoQ'),
							new CreateWD('salesBidWizardService', '900FBEAE9E044D43A49F575E5FB1B3A0', 'TakeoverBoQ'),
							new CreateWD('salesBidWizardService', 'a63da5e93d0e46a096e282fe35f41357', 'selectGroups'),
							new CreateWD('salesBidWizardService', '37b726a2ed9442f4ad3b39a858fe1509', 'BoqExcelExport'),
							new CreateWD('salesBidWizardService', 'ed5100547c6349e68b7cf92f4030ff37', 'BoqExcelImport'),
							new CreateWD('salesBidWizardService', '4626490160134270b69962eee026e817', 'scanBoq'),
							new CreateWD('salesBidWizardService', 'b94b6e7468434e8d9dab70d81114a2bb', 'createAndImportBoqs'),
							new CreateWD('salesBidWizardService', 'b4d3b6426ec64ea781b9936585b9d58f', 'changeBoqHeaderStatus'),
							new CreateWD('salesBidWizardService', 'D00D8B2D9FE44324940FBB40594B73DF', 'updateBoq'),
							new CreateWD('salesBidWizardService', 'C29DD6F35A014C23ACE7468264A86469', 'formatBoQSpecification'),
							new CreateWD('salesBidWizardService', '09b0fbce3937497390545ecfae6f7cea', 'updateProjectBoq'),
							new CreateWD('salesBidWizardService', 'ac771944d6ce486cb244a3c535d20e79', 'changeProjectChangeStatus'),
							new CreateWD('salesBidWizardService', 'b4ef772907bc4fb5aed0a56534225d2d', 'updateEstimate'),
							// Userforms
							new CreateWD('basicsUserFormFormDataWizardService', '756badc830b74fdcbf6b6ddc3f92f7bd', 'changeFormDataStatus'),
							// Documents Project
							new CreateWD('salesBidWizardService', '8632826CDACF41CB8822CA751F00DB0A', 'changeStatusForProjectDocument'),
							new CreateWD('salesBidWizardService', 'c8e6b8ee0a5b4df886ee508ce77d5bb4', 'changeSalesConfiguration'),
							new CreateWD('documentsCentralQueryWizardService', '09e2088390c740e1ab8da6c98cf61fcc', 'changeRubricCategory', true,false,{moduleName: moduleName}),
							new CreateWD('salesBidWizardService', '538325604B524F328FDF436FB14F1FC8', 'changeCertificateStatus'),
							new CreateWD('salesBidWizardService', '67bdfce363b94e7f93df3ef20f5de2fc', 'productionForecast'),
						];
						wizardService.registerWizard(wizardData);
					}]
				}
			});
		}
	]).run(['$injector', 'platformModuleNavigationService', 'basicsConfigWizardSidebarService', 'salesCommonGeneralsServiceFactory', 'basicsWorkflowEventService',
		function ($injector, naviService, wizardService, salesCommonGeneralsServiceFactory, basicsWorkflowEventService) {

			naviService.registerNavigationEndpoint({
				moduleName: moduleName,
				navFunc: function (item, triggerField) {
					$injector.get('salesBidService').setBidHeader(item, triggerField);
				}
			});

			salesCommonGeneralsServiceFactory.registerServiceContainer(moduleName, {
				parentService: 'salesBidService',
				apiUrl: 'sales/bid/generals/',
				moduleName: 'Sales.Bid'
			});

			basicsWorkflowEventService.registerEvent('9502b45eef3e48ce8952334c93abf001', 'New Sales Bid Created');
		}]);
})();
