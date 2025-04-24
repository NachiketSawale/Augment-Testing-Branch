(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'basics.bank';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);


	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (platformLayoutService) {

				var options = {
					'moduleName': moduleName,
					'resolve': {
						'loadDomains': ['platformSchemaService', function(platformSchemaService) {

							return platformSchemaService.getSchemas( [
								{ typeName: 'BankDto', moduleSubModule: 'Basics.Bank'}
							] );
						}]
					}
				};
				platformLayoutService.registerModule(options);
			}
		]);
})(angular);