/**
 * Created by las on 7/10/2017.
 */

(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';
	var moduleName = 'transportplanning.package';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var wizardData = [{
				serviceName: 'transportplanningPackageWizardService',
				wizardGuid: '822a54da829149cdbd8b01e26b855d00',
				methodName: 'changePackageStatus',
				canActivate: true
			}];

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService',
						function (platformSchemaService, basicsConfigWizardSidebarService) {

							basicsConfigWizardSidebarService.registerWizard(wizardData);

							return platformSchemaService.getSchemas([
								{typeName: 'TransportPackageDto', moduleSubModule: 'TransportPlanning.Package'},
								{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'BundleDto', moduleSubModule: 'TransportPlanning.Bundle'},
								{typeName: 'PpsDocumentDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'PpsDocumentRevisionDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'CostGroupCatDto', moduleSubModule: 'Basics.CostGroups'},
								{typeName: 'TrsGoodsDto', moduleSubModule: 'TransportPlanning.Requisition'},
								{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
							]);
						}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', '$http', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue, $http) {
						var ppsEntityId = ppsCommonCodGeneratorConstantValue.PpsEntityConstant.TransportPackage;
						$http.get(globals.webApiBaseUrl + 'productionplanning/common/getRubricCatId?ppsEntityId=' + ppsEntityId).then(function (response) {
							ppsCommonCodGeneratorConstantValue.CategoryConstant.TrsPackageCat = response.data;
						});
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsPackageNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.TransportPlanning).load();
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
						var field = {
							'TrsPackageFk': 'TrsPackageFk',
							'Code': 'Id'
						}[triggerField];
						if (field) {
							$injector.get('transportplanningPackageMainService').selectItemByID(item[field]);
						}
					}
				}
			);
		}]);
})(angular);