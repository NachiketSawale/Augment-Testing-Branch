/**
 * Created by baf on 05.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.sundrygroup';

	angular.module(moduleName, ['ui.router', 'platform', 'basics.common', 'basics.lookupdata', 'basics.currency']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var wizardData = [{
				serviceName: 'logisticSundryServiceGroupSidebarWizardService',
				wizardGuid: '08745fea91ad46adaf812f265e8db38d',
				methodName: 'enableSundryServiceGroup',
				canActivate: true
			}, {
				serviceName: 'logisticSundryServiceGroupSidebarWizardService',
				wizardGuid: '88cc0e70d9d64390bfe823845af57049',
				methodName: 'disableSundryServiceGroup',
				canActivate: true
			}
			];

			var options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['platformSchemaService', 'basicsConfigWizardSidebarService', 'logisticSundryServiceGroupConstantValues',
						function (platformSchemaService, basicsConfigWizardSidebarService, logisticSundryServiceGroupConstantValues) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);

							return platformSchemaService.getSchemas([
								logisticSundryServiceGroupConstantValues.schemes.group,
								logisticSundryServiceGroupConstantValues.schemes.account,
								logisticSundryServiceGroupConstantValues.schemes.taxCode
							]);
						}
					],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['logistic', 'resource', 'basics', 'project', 'documents']);
					}],
					loadLookUps :['logisticSundryLookupService',function (logisticSundryLookupService) {
						return logisticSundryLookupService.loadAssignmentData();
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