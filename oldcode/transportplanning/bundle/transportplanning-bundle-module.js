(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';
	var moduleName = 'transportplanning.bundle';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider', function (platformLayoutService) {
		var options = {
			'moduleName': moduleName,
			'resolve': {
				'loadDomains': ['platformSchemaService',
					function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'BundleDto', moduleSubModule: 'TransportPlanning.Bundle'},
							{typeName: 'TrsGoodsDto', moduleSubModule: 'TransportPlanning.Requisition'},
							{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'},
							{typeName: 'ReservationDto', moduleSubModule: 'Resource.Reservation'},
							{typeName: 'PpsDocumentDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'PpsDocumentRevisionDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'CostGroupCatDto', moduleSubModule: 'Basics.CostGroups'},
							{typeName: 'ProductHistoryDto', moduleSubModule: 'ProductionPlanning.Common'},
						]);
				}],
				'loadCustomColumns': ['ppsCommonCustomColumnsServiceFactory', function (customColumnsServiceFactory) {
					var customColumnsService = customColumnsServiceFactory.getService(moduleName);
					return customColumnsService.init('transportplanning/bundle/bundle/customcolumn');
				}],
				'loadCommonCustomColumns': ['ppsCommonCustomColumnsServiceFactory', 'productionplanningCommonTranslationService', function (customColumnsServiceFactory, translationServ) {
					return customColumnsServiceFactory.initCommonCustomColumnsService().then(function () {
						translationServ.setTranslationForCustomColumns();
					});
				}],
				loadCodeGenerationInfo2: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', '$http', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue, $http) {
					var ppsEntityId = ppsCommonCodGeneratorConstantValue.PpsEntityConstant.TransportBundle;
					$http.get(globals.webApiBaseUrl + 'productionplanning/common/getRubricCatId?ppsEntityId=' + ppsEntityId).then(function (response) {
						ppsCommonCodGeneratorConstantValue.CategoryConstant.TrsBundleCat = response.data;
					});
					return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsBundleNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.TransportPlanning).load();
				}],
				'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
					return platformTranslateService.registerModule([moduleName, 'productionplanning.common']);
				}],
				'loadTrsProjectConfig': ['transportplanningBundleTrsProjectConfigService', function (trsProjectConfigService) {
					trsProjectConfigService.load(); // just for previously loading trsPrjConfig data, trsPrjConfig data will be used in productionplanningProductBookStockLocationWizardService(HP_ALM 127307)
				}],
				'loadUom': [ 'basicsUnitLookupDataService',
					function (basicsUnitLookupDataService) {
						basicsUnitLookupDataService.getListSync({lookupType: 'basicsUnitLookupDataService'});
					}
				],
			}
		};
		platformLayoutService.registerModule(options);
	}]).run(['$injector', 'platformModuleNavigationService', function ($injector, naviService) {
		naviService.registerNavigationEndpoint(
			{
				moduleName: moduleName,
				navFunc: function (item, triggerField) {
					if (triggerField === 'TrsProductBundleFk') {
						$injector.get('transportplanningBundleMainService').searchItem(item.TrsProductBundleFk);
					}
					if (triggerField === 'Code') {
						$injector.get('transportplanningBundleMainService').searchItem(item.Id);
					}
				}
			}
		);
	}]).run(['basicsConfigWizardSidebarService', function (basicsConfigWizardSidebarService) {
		var wizards = [{
			serviceName: 'transportplanningBundleWizardService',
			wizardGuid: '71971307faea44bba2746ce521c41647',
			methodName: 'enableBundle',
			canActivate: true
		}, {
			serviceName: 'transportplanningBundleWizardService',
			wizardGuid: 'e272c441c313404c80eed31aeb529ee4',
			methodName: 'disableBundle',
			canActivate: true
		},{
			serviceName: 'transportplanningBundleWizardService',
			wizardGuid: '5d16a3c4313c4ac5aac5081ed158fd74',
			methodName: 'changeBundleStatus',
			canActivate: true
		},{
			serviceName: 'transportplanningBundleWizardService',
			wizardGuid: 'd539cfb139254231b45431c71ed1e7b0',
			methodName: 'bookProductsToStockLocation',
			canActivate: true
		}];
		basicsConfigWizardSidebarService.registerWizard(wizards);
	}]);
})(angular);
