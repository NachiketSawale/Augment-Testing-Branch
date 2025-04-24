/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */

	let moduleName = 'basics.textmodules';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name estimate.main
	 * @description
	 * Module definition of the estimate module
	 **/
	angular.module(moduleName).
		config(['mainViewServiceProvider', '$logProvider',
			function (mainViewServiceProvider, $logProvider) {
				$logProvider.debugEnabled(false);

				let options = {
					'moduleName': moduleName,
					'resolve': {
						'loadDomains': ['platformSchemaService', function (platformSchemaService) {

							platformSchemaService.initialize();

							return platformSchemaService.getSchemas([
								{typeName: 'TextModuleDto', moduleSubModule: 'Basics.TextModules'},
								{ typeName: 'TextModuleHyperlinkDto', moduleSubModule: 'Basics.TextModules' },
								{ typeName: 'TextModuleTextDto', moduleSubModule: 'Basics.TextModules' }
							]);
						}]
					}
				};

				mainViewServiceProvider.registerModule(options);
			}
		]);
})(angular);