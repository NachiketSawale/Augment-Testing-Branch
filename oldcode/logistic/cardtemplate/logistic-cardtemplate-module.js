/*
 * $Id: logistic-cardtemplate-module.js 619687 2021-01-13 00:37:15Z henkel $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'logistic.cardtemplate';

	angular.module(moduleName, ['logistic.cardtemplate']);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['platformSchemaService', 'logisticCardTemplateConstantValues', function (platformSchemaService, constValues) {
						return platformSchemaService.getSchemas([
							constValues.schemes.cardTemplate,
							constValues.schemes.cardTemplateActivity,
							constValues.schemes.cardTemplateRecord,
							constValues.schemes.cardTemplateDocument
						]);
					}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['logistic', 'resource', 'services', 'project', 'basics', 'documents']);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
