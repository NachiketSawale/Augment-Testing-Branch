/**
 * Created by baf on 02.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.sundryservice';

	angular.module(moduleName, ['ui.router', 'platform', 'basics.common', 'basics.lookupdata', 'basics.currency']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'SundryServiceDto', moduleSubModule: 'Logistic.SundryService'},
							{typeName: 'SundryServicePriceListDto', moduleSubModule: 'Logistic.SundryService'}
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