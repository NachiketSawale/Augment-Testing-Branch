/**
 * Created by wuj on 8/25/2015.
 */

(function (angular) {
	'use strict';

	/*
	 ** basics.procurementconfiguration module is created.
	 */
	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName, ['ui.router', 'basics.lookupdata', 'cloud.common', 'ui.bootstrap']);
	globals.modules.push(moduleName);


	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						var moduleSubModule = 'Basics.ProcurementConfiguration';
						return platformSchemaService.getSchemas([
							{typeName: 'PrcConfigHeaderDto', moduleSubModule: moduleSubModule},
							{typeName: 'PrcConfigurationDto', moduleSubModule: moduleSubModule},
							{typeName: 'PrcConfiguration2BSchemaDto', moduleSubModule: moduleSubModule},
							{typeName: 'PrcConfiguration2StrategyDto', moduleSubModule: moduleSubModule},
							{typeName: 'PrcConfiguration2TabDto', moduleSubModule: moduleSubModule},
							{typeName: 'PrcConfiguration2TextTypeDto', moduleSubModule: moduleSubModule},
							{typeName: 'PrcTotalTypeDto', moduleSubModule: moduleSubModule},
							{typeName: 'PrcConfiguration2Prj2TextTypeDto', moduleSubModule: moduleSubModule},
							{typeName: 'PrcConfig2ReportDto', moduleSubModule: moduleSubModule},
							{typeName: 'PrcConfig2documentDto', moduleSubModule: moduleSubModule},
							{typeName: 'PrcConfig2dataformatDto', moduleSubModule: moduleSubModule},
							{typeName: 'PrcConfig2ConApprovalDto', moduleSubModule: moduleSubModule},
							{typeName: 'PrcConfiguration2TextTypeItemDto', moduleSubModule: moduleSubModule }
						]);
					}]
				}
			};

			platformLayoutService.registerModule(options);
		}
	]).run([
		'platformTranslateService',
		function(
			platformTranslateService
		) {
			platformTranslateService.registerModule(moduleName);
		}
	]);

})(angular);