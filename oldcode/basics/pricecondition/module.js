(function(angular) {
	'use strict';
	var moduleName = 'basics.pricecondition';
	angular.module(moduleName, ['ui.router', 'basics.lookupdata', 'cloud.common', 'ui.bootstrap']);

	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				'moduleName': moduleName,
				'controller': 'basicsPriceConditionController',
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {

						var moduleSubModule = 'Basics.PriceCondition';

						platformSchemaService.initialize();
						return platformSchemaService.getSchemas([
							{typeName: 'PriceConditionDto', moduleSubModule: moduleSubModule},
							{typeName: 'PriceConditionDetailDto', moduleSubModule: moduleSubModule}
						]);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);