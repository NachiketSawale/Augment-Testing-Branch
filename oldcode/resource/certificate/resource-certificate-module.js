/*
 * $Id: resource-certificate-module.js 609635 2020-10-29 13:18:12Z baf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'resource.certificate';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var wizardData = [{
				serviceName: 'resourceCertificateSidebarWizardService',
				wizardGuid: '54d4d0a726ab46899ce0c6a29698378b',
				methodName: 'changeCertificateStatus',
				canActivate: true
			}];

			var options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function (platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['platformSchemaService', 'resourceCertificateConstantValues', 'basicsConfigWizardSidebarService',
						function (platformSchemaService, resourceCertificateConstantValues, basicsConfigWizardSidebarService) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							return platformSchemaService.getSchemas([
								resourceCertificateConstantValues.schemes.certificate,
								resourceCertificateConstantValues.schemes.certificateDoc,
								resourceCertificateConstantValues.schemes.certificatedPlant,
								{typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'},
								{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'}
							]);
						}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['resource', 'logistic', 'basics', 'project', 'cloud']);
					}],
					// needed to install listener for parent-service create event (even when characteristic container ist not activated)
					'initCharacteristicDataService': ['basicsCharacteristicDataServiceFactory', 'resourceCertificateDataService',
						function (basicsCharacteristicDataServiceFactory, resourceCertificateDataService) {
							basicsCharacteristicDataServiceFactory.getService(resourceCertificateDataService, 58);
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
					moduleName: 'resource.certificate',
					navFunc: function (item, triggerField) {
						$injector.get('resourceCertificateDataService').navigateTo(item, triggerField);
					}
				}
			);
		}]);
})(angular);
