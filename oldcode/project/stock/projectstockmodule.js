(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'project.stock';

	angular.module(moduleName, ['ui.router', 'basics.common', 'basics.clerk', 'basics.lookupdata', 'basics.currency', 'platform']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {
				var options = {
					'moduleName': moduleName,
					'resolve': {
						'loadDomains': ['platformSchemaService', function(platformSchemaService) {

							return platformSchemaService.getSchemas( [
								{ typeName: 'ProjectStockDto', moduleSubModule: 'Project.Stock'},
								{ typeName: 'ProjectStockLocationDto', moduleSubModule: 'Project.Stock'}
							]);
						}]
					}
				};
				mainViewServiceProvider.registerModule(options);
			}
		]);

})(angular);

