/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/*global angular, globals*/
	var moduleName = 'productionplanning.fabricationunit';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var wizardData = [{
				serviceName: 'ppsFabricationunitWizardService',
				wizardGuid: '595d240801504ec6ae145c8e4401bcb5',
				methodName: 'enableFabricationUnit',
				canActivate: true
			}, {
				serviceName: 'ppsFabricationunitWizardService',
				wizardGuid: 'eea38a7830e747b5a59a652b5a1363b9',
				methodName: 'disableFabricationUnit',
				canActivate: true
			}];
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService', function (platformSchemaService, basicsConfigWizardSidebarService) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);
						return platformSchemaService.getSchemas([
							{typeName: 'PpsFabricationUnitDto', moduleSubModule: 'Productionplanning.Fabricationunit'},
							{typeName: 'PpsNestingDto', moduleSubModule: 'Productionplanning.Fabricationunit'},
							{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'BundleDto', moduleSubModule: 'TransportPlanning.Bundle'},
							{typeName: 'SiteDto', moduleSubModule: 'Basics.Site'},
							{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'}
						]);
					}],
					'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'productionplanning.common']);
						// remark: wiki of platformTranslateService is http://rib-s-wiki01.rib-software.com/cloud/wiki/54/angular-translation#Platform-Translation-Service
					}],
					loadEventType: ['ppsCommonCodGeneratorConstantValue', function (ppsCommonCodGeneratorConstantValue) {
						return ppsCommonCodGeneratorConstantValue.loadEventType(); // eventType is indirectly referenced by ppsCommonCodGeneratorConstantValue.getCategoryFkviaEventType() in processItem() of dataProcessor of ppsFabricationunitDataService
					}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue',  function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsFfabricationUnitNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.ProductionPlanning).load();
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
