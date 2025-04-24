/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/*
	 ** model.project module is created.
	 */
	var moduleName = 'model.project';
	var languageModuleName = 'cloud.common';

	angular.module(moduleName, [languageModuleName, 'platform', 'basics.common', 'model.administration']);

	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {

						platformSchemaService.initialize();
						return platformSchemaService.getSchemas([
							{typeName: 'ModelDto', moduleSubModule: 'Model.Project'},
							{typeName: 'ModelFileDto', moduleSubModule: 'Model.Project'},
							{typeName: 'ModelComparePropertykeyBlackListDto', moduleSubModule: 'Model.Administration'},
							{typeName: 'ModelStakeholderDto', moduleSubModule: 'Model.Project'}
						]);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);


		}
	]);

})(angular);
