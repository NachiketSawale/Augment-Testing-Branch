/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'project.droppoints';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				moduleName: moduleName,
				'resolve': {
					loadDomains: [
						'platformSchemaService', 'projectDropPointsConstantValues',
						function (platformSchemaService, projectDropPointsConstantValues) {
							return platformSchemaService.getSchemas([
								projectDropPointsConstantValues.schemes.project,
								projectDropPointsConstantValues.schemes.dropPoint,
								projectDropPointsConstantValues.schemes.dropPointArticles,
								{ typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common' },
								{ typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common' }
							]);
					}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['project', 'cloud', 'basics', 'resource', 'logistic']);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
