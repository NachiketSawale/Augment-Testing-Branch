/*
 * $Id: mtwo-aiconfiguration-module.js 634843 2021-04-30 06:32:46Z chd $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName, ['ui.router', 'platform', 'basics.common', 'basics.lookupdata']);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name ai configuration
	 * @description
	 * Module definition of the ai configuration module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			let wizardData = [{
				serviceName: 'mtwoAIConfigurationWizardService',
				wizardGuid: 'd6370a7db4354843b4e09c004c4061aa',
				methodName: 'uploadAIModel',
				canActivate: true
			}];

			let options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function (platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['platformModuleInitialConfigurationService', 'platformSchemaService', 'basicsConfigWizardSidebarService',
						function (platformModuleInitialConfigurationService, platformSchemaService, basicsConfigWizardSidebarService) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							return platformSchemaService.getSchemas([
								{typeName: 'ModelDto', moduleSubModule: 'Mtwo.AIConfiguration'},
								{typeName: 'ModelVersionDto', moduleSubModule: 'Mtwo.AIConfiguration'},
								{typeName: 'ModelParameterDto', moduleSubModule: 'Mtwo.AIConfiguration'}
							]);
						}
					],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName], true);
					}]
				}
			};
			platformLayoutService.registerModule(options);
		}]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('mtwoAIConfigurationModelListDataService').navigateTo(item, triggerField);
					}
				}
			);
		}]);
})(angular);
