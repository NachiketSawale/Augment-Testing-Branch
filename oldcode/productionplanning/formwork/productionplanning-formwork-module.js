/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.formwork';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'FormworkDto', moduleSubModule: 'Productionplanning.Formwork'},
							{typeName: 'PpsPhaseDto', moduleSubModule: 'Productionplanning.ProcessConfiguration'},
							{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'BundleDto', moduleSubModule: 'TransportPlanning.Bundle'}
						]);
					}],
					'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'basics.site']);
					}],
					'loadCommonCustomColumns': ['ppsCommonCustomColumnsServiceFactory', 'productionplanningCommonTranslationService', function (customColumnsServiceFactory, translationServ) {
						return customColumnsServiceFactory.initCommonCustomColumnsService().then(function () {
							translationServ.setTranslationForCustomColumns();
						});
					}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsFormworkNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.ProductionPlanning).load();
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
