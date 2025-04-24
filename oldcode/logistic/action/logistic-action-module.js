/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'logistic.action';

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
					loadDomains: ['platformSchemaService','logisticActionConstantValues', function (platformSchemaService,logisticActionConstantValues) {
						return platformSchemaService.getSchemas([
							logisticActionConstantValues.schemes.actionTarget,
							logisticActionConstantValues.schemes.actionItemTemplates,
							logisticActionConstantValues.schemes.actionItemTypes,
							logisticActionConstantValues.schemes.actionItemTemplatesByType,
						]);
					}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['logistic', 'resource', 'basics', 'project', 'documents']);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
