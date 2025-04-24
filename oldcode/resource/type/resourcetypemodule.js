(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'resource.type';

	angular.module(moduleName, ['ui.router', 'basics.common', 'basics.lookupdata', 'basics.currency', 'platform']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider', function (mainViewServiceProvider) {
		const options = {
			moduleName: moduleName,
			resolve: {
				loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
					return platformModuleEntityCreationConfigurationService.load(moduleName);
				}],
				loadDomains: ['platformSchemaService', 'resourceTypeConstantValues', function(platformSchemaService, resourceTypeConstantValues){
					var schemes = resourceTypeConstantValues.schemes;
					return platformSchemaService.getSchemas( [ schemes.type, schemes.requiredSkill, schemes.planningBoardFilter, schemes.requestedType, schemes.requestedSkillV, schemes.alternativeResType] );
				}],
				loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
					return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['resource', 'logistic', 'basics', 'project', 'cloud']);
				}],
				loadContextData: ['logisticCommonContextService', function (logisticCommonContextService) {
					return logisticCommonContextService.init();
				}]
			}
		};
		mainViewServiceProvider.registerModule(options);
	}
	]);
})(angular);

