(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'basics.country';

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
								{ typeName: 'CountryDto', moduleSubModule: 'Basics.Country'},
								{ typeName: 'StateDto', moduleSubModule: 'Basics.Country'}
							] );
						}]
					}
				};
				platformLayoutService.registerModule(options);
			}
		]);
})(angular);