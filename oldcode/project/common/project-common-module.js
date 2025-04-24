/*
 * $Id: project-common-module.js 573141 2020-01-14 11:14:20Z leo $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'project.common';

	angular.module(moduleName, ['ui.router', 'platform', 'basics.common', 'basics.lookupdata', 'basics.currency']);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							// {typeName: 'SomeDto', moduleSubModule: 'Project.Common'}
						]);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);
})(angular);
