/*
 * $Id: timekeeping-layout-module.js 580623 2020-03-25 19:03:23Z baf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'timekeeping.layout';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', 'timekeepingLayoutConstantValues',
						function (platformSchemaService, timekeepingLayoutConstantValues) {
							return platformSchemaService.getSchemas([
								timekeepingLayoutConstantValues.schemes.inputPhase,
								timekeepingLayoutConstantValues.schemes.inputPhaseGroup,
								timekeepingLayoutConstantValues.schemes.inputPhaseTimeSymbol,
								timekeepingLayoutConstantValues.schemes.userInterfaceLayout
							]);
						}],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName], true);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
