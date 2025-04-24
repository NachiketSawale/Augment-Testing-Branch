(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';
	var moduleName = 'productionplanning.productionset';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var wizardData = [
				{
					serviceName: 'productionplanningProductionsetWizardService',
					wizardGuid: '2abf1a28062742b0be2931942e0638f8',
					methodName: 'changeProductionsetStatus',
					canActivate: true
				}
			];
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'ppsCommonLoggingHelper', 'basicsConfigWizardSidebarService', function (platformSchemaService, ppsCommonLoggingHelper, basicsConfigWizardSidebarService) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);
						var schemas = [
							{typeName: 'ProductionsetDto', moduleSubModule: 'ProductionPlanning.ProductionSet'},
							{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'BundleDto', moduleSubModule: 'TransportPlanning.Bundle'},
							{typeName: 'PpsLogReportVDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'PpsProductionSubsetDto', moduleSubModule: 'Productionplanning.Fabricationunit'}
						];
						return ppsCommonLoggingHelper.initLoggingNecessity(schemas).then(function () {
							return platformSchemaService.getSchemas(schemas);
						});
					}],
					'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'productionplanning.common']);
					}],
					'loadItemCustomColumns': ['ppsCommonCustomColumnsServiceFactory', function (customColumnsServiceFactory) {
						var customColumnsService = customColumnsServiceFactory.getService(moduleName);
						return customColumnsService.init('productionplanning/productionset/productionset/customcolumn');
					}],
					'loadCommonCustomColumns': ['ppsCommonCustomColumnsServiceFactory', 'productionplanningCommonTranslationService', function (customColumnsServiceFactory, translationServ) {
						return customColumnsServiceFactory.initCommonCustomColumnsService().then(function () {
							translationServ.setTranslationForCustomColumns();
						});
					}],
					loadEventType: ['ppsCommonCodGeneratorConstantValue', function (ppsCommonCodGeneratorConstantValue) {
						return ppsCommonCodGeneratorConstantValue.loadEventType(); // eventType is indirectly referenced by ppsCommonCodGeneratorConstantValue.getCategoryFkviaEventType() in productionplanningProductionsetProcessor
					}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsProductionSetNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.ProductionPlanning).load();
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
						if (triggerField === 'ProductionSetFk') {
							$injector.get('productionplanningProductionsetMainService').selectItemByID(item.ProductionSetFk);
						}
					}
				}
			);
		}]);
})(angular);
