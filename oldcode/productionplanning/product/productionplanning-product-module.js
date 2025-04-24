/**
 * Created by zov on 7/26/2019.
 */
(function () {
	'use strict';
	/* global angular, globals */

	let moduleName = 'productionplanning.product';
	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			let wizardData = [
				{
					serviceName: 'productionplanningProductWizardService',
					wizardGuid: '0bd0c22574f841b4a907de00e5af3f46',
					methodName: 'changeProductStatus',
					canActivate: true
				}, {
					serviceName: 'productionplanningProductWizardService',
					wizardGuid: 'c66ed7f2a484423fa9532ce33d61b324',
					methodName: 'enableProduct',
					canActivate: true
				}, {
					serviceName: 'productionplanningProductWizardService',
					wizardGuid: '6c5ae92a6ec74435857d41d2409fcdb9',
					methodName: 'disableProduct',
					canActivate: true
				}, {
					serviceName: 'productionplanningProductWizardService',
					wizardGuid: '5f9934319add4d95ad912e0b5a4cdb83',
					methodName: 'dispatchProducts',
					canActivate: true
				}, {
					serviceName: 'productionplanningProductWizardService',
					wizardGuid: 'c11c1d89894d4e4d9a236268bc7356f8',
					methodName: 'bookProductsToStockLocation',
					canActivate: true
				}, {
					serviceName: 'productionplanningProductWizardService',
					wizardGuid: '1e418280631d4029b7e5f13373a64dbf',
					methodName: 'reuseProductFromStock',
					canActivate: true
				}, {
					serviceName: 'basicsUserFormFormDataWizardService',
					wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
					methodName: 'changeFormDataStatus',
					canActivate: true
				}, {
					serviceName: 'productionplanningProductWizardService',
					wizardGuid: 'b3ebe4845d254f138d06679cbf885921',
					methodName: 'changeProductPhaseRequirementStatus',
					canActivate: true
				}, {
					serviceName: 'productionplanningProductWizardService',
					wizardGuid: '66e36e4b3e1f49c3828b366d171ca3a3',
					methodName: 'doBillingDataProductAndMaterialSelection',
					canActivate: true
				}
			];
			let options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['$injector', 'platformSchemaService', 'basicsConfigWizardSidebarService', 'ppsCommonLoggingHelper', '$q', 'ppsCommonCustomColumnsServiceFactory', 'productionplanningCommonTranslationService',
						function ($injector, platformSchemaService, basicsConfigWizardSidebarService, ppsCommonLoggingHelper, $q, customColumnsServiceFactory, translationServ) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							let schemaOption = [
								{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'PpsCuttingProductVDto', moduleSubModule: 'ProductionPlanning.Product'},
								{typeName: 'ProductDescriptionDto', moduleSubModule: 'ProductionPlanning.ProductTemplate'},
								{typeName: 'ProductDescParamDto', moduleSubModule: 'ProductionPlanning.ProductTemplate'},
								{typeName: 'ProductParamDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'PpsDocumentDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'PpsDocumentRevisionDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'BundleDto', moduleSubModule: 'TransportPlanning.Bundle'},
								{typeName: 'StockTransactionDto', moduleSubModule: 'Procurement.Stock'},
								{typeName: 'PpsProductToProdPlaceDto', moduleSubModule: 'ProductionPlanning.Product'},
								{typeName: 'PpsProductionPlaceDto', moduleSubModule: 'ProductionPlanning.ProductionPlace'},
								{typeName: 'EngProdComponentDto', moduleSubModule: 'ProductionPlanning.Product'},
								{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'FormDataDto', moduleSubModule: 'Basics.UserForm'},
								{typeName: 'PpsPhaseDto', moduleSubModule: 'Productionplanning.ProcessConfiguration'},
								{typeName: 'PpsPhaseRequirementDto', moduleSubModule: 'Productionplanning.ProcessConfiguration'},
								{typeName: 'PPSItemDto', moduleSubModule: 'ProductionPlanning.Item'},
								{typeName: 'PpsRackAssignDto', moduleSubModule: 'ProductionPlanning.Product'},
								{typeName: 'ProductHistoryDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'PpsParameterDto', moduleSubModule: 'ProductionPlanning.FormulaConfiguration'},
								{typeName: 'SiteDto', moduleSubModule: 'Basics.Site'},
								{typeName: 'GenericDocumentDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'GenericDocumentRevisionDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'OrdHeaderDto', moduleSubModule: 'Sales.Contract'},
								{typeName: 'DispatchRecordDto', moduleSubModule: 'Logistic.Dispatching'},
								{typeName: 'DispatchHeaderDto', moduleSubModule: 'Logistic.Dispatching'},
								{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
							];
							let promises = [];
							promises.push(platformSchemaService.getSchemas(schemaOption).then(function (result) {
								return result;
							}));
							promises.push(ppsCommonLoggingHelper.initLoggingNecessity(schemaOption));
							let loadCommonCustomColumnsPromise =  new Promise(function (resolve, reject) {
								customColumnsServiceFactory.initCommonCustomColumnsService().then(function () {
									translationServ.setTranslationForCustomColumns();
									resolve(true);
								});
							});
							promises.push(loadCommonCustomColumnsPromise);
							return $q.all(promises).then(function (responses) {
								// for fix issue about missing adding validation methods for event slot column of product container, pre-building following dynamic dataservice should be after initializing product custom columns service.
								// to pre-build dynamic dataservice, which is nor registed in any angular module
								let prodDescDataSrv = $injector.get('productionplanningProducttemplateProductDescriptionDataServiceFactory').getService({
									serviceName: 'productionplanningProductProductDescriptionDataService',
									parentService: 'productionplanningProductMainService',
									usePostForRead: true,
									endRead: 'instance',
									onlyShowDetails: true,
									readOnly: true,
									hasCharacteristic: true,
								});

								$injector.get('ppsProducttemplateParamDataServiceFactory').getService({
									parentService: prodDescDataSrv,
									parentServiceName: prodDescDataSrv.getServiceName(),
									route: 'productionplanning/producttemplate/productdescparam/',
									endRead: 'listbyparent',
									readOnly: true
								});

								return responses[0];
							});
						}],
					'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'productionplanning.common', 'productionplanning.processconfiguration',
							'logistic.dispatching', 'sales.contract']);
					}],
					'loadTrsProjectConfig': ['transportplanningBundleTrsProjectConfigService', function (trsProjectConfigService) {
						trsProjectConfigService.load(); // just for previously loading trsPrjConfig data, trsPrjConfig data will be used in productionplanningProductBookStockLocationWizardService(HP_ALM 127307)
					}],
					'loadUom': ['basicsUnitLookupDataService',
						function (basicsUnitLookupDataService) {
							basicsUnitLookupDataService.getListSync({lookupType: 'basicsUnitLookupDataService'});
						}
					],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load([
							'basicsDependentDataDomainCombobox'
						]);
					}],
				}
			};
			mainViewServiceProvider.registerModule(options);
		}])
		.run(['$injector', 'platformModuleNavigationService',
			function ($injector, naviService) {
				naviService.registerNavigationEndpoint(
					{
						moduleName: moduleName,
						navFunc: function (item, triggerField) {
							var relField = {
								'Code': 'Id'
							}[triggerField] || triggerField;
							if (relField) {
								$injector.get('productionplanningProductMainService').searchByCalId(item[relField]);
							}
						}
					}
				);
			}]);
})();