/*
 * $Id: timekeeping-common-module.js 634255 2021-04-27 12:53:54Z welss $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'timekeeping.common';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			let options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							// {typeName: 'SomeDto', moduleSubModule: 'Timekeeping.Common'}
						]);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
