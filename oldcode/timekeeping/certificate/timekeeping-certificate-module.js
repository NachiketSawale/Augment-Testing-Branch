/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'timekeeping.certificate';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			let wizardData = [{
				serviceName: 'timekeepingCertificateSidebarWizardService',
				wizardGuid: '382c0f1a7456446890600c601237c7ca',
				methodName: 'changeCertificateStatus',
				canActivate: true
			}];

			let options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function (platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['platformSchemaService', 'timekeepingCertificateConstantValues', 'basicsConfigWizardSidebarService',
						function (platformSchemaService, timekeepingCertificateConstantValues,basicsConfigWizardSidebarService) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							return platformSchemaService.getSchemas([
								timekeepingCertificateConstantValues.schemes.certificate,
								timekeepingCertificateConstantValues.schemes.certifiedEmployee,
								timekeepingCertificateConstantValues.schemes.certificateDoc
							]);
						}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['resource', 'logistic', 'basics', 'project', 'cloud']);
					}],
					// needed to install listener for parent-service create event (even when characteristic container ist not activated)
					'initCharacteristicDataService': ['basicsCharacteristicDataServiceFactory', 'timekeepingCertificateDataService',
						function (basicsCharacteristicDataServiceFactory, timekeepingCertificateDataService) {
							basicsCharacteristicDataServiceFactory.getService(timekeepingCertificateDataService, 58);
						}
					]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: 'timekeeping.certificate',
					navFunc: function (item, triggerField) {
						$injector.get('timekeepingCertificateDataService').navigateTo(item, triggerField);
					}
				}
			);
		}]);
})(angular);
