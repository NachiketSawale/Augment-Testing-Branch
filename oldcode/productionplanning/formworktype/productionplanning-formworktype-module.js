/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.formworktype';

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
					'loadDomains': ['platformSchemaService', 'productionplanningFormworktypeConstantValues', function (platformSchemaService, constantValues) {
						return platformSchemaService.getSchemas([
							constantValues.schemes.formworktype,
						]);
					}],
					'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'basics.customize']);
					}],
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
