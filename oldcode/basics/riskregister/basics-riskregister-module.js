/*
 * Created by salopek on 02.10.2019.
 */

(function (angular) {
	'use strict';
	/*global angular,globals*/
	var moduleName = 'basics.riskregister';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {
				var options = {
					'moduleName': moduleName,
					'resolve': {
						'loadDomains': ['platformSchemaService', function(platformSchemaService) {

							platformSchemaService.initialize();

							return platformSchemaService.getSchemas([
								{ typeName: 'RiskRegisterDto', moduleSubModule: 'Basics.RiskRegister'},
								{typeName: 'CostCodeDto', moduleSubModule: 'Basics.CostCodes'},
								{typeName: 'RiskResourcesDto', moduleSubModule:'Basics.RiskRegister'},
								{typeName: 'RiskRegisterImpactDto', moduleSubModule: 'Basics.RiskRegister'}
							]);
						}]
					}
				};

				mainViewServiceProvider.registerModule(options);
			}
		]);
})(angular);
