/*
 * $Id: privacy-main-module.js 629240 2021-03-23 13:52:05Z leo $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'privacy.main';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			let wizardData = [{
				serviceName: 'privacyMainSidebarWizardService',
				wizardGuid: 'c494a1067e9c42e88adab3edb8c6bbe9',
				methodName: 'prepareToAnonymiseClerk',
				canActivate: true
			}, {
				serviceName: 'privacyMainSidebarWizardService',
				wizardGuid: 'f4f3df84edc9495d946a3de88fe9962e',
				methodName: 'anonymiseClerk',
				canActivate: true
			}, {
				serviceName: 'privacyMainSidebarWizardService',
				wizardGuid: 'ab9b270e5bf64be79242b2e8ce36f570',
				methodName: 'prepareToAnonymiseUser',
				canActivate: true
			}, {
				serviceName: 'privacyMainSidebarWizardService',
				wizardGuid: '1948c733cc1a4d9fbd0389484df016ab',
				methodName: 'anonymiseUser',
				canActivate: true
			}, {
				serviceName: 'privacyMainSidebarWizardService',
				wizardGuid: '0ad691ba7f704807bdf88e6e7dd2d205',
				methodName: 'prepareToAnonymiseContact',
				canActivate: true
			}, {
				serviceName: 'privacyMainSidebarWizardService',
				wizardGuid: 'd83881ac0f90487192912793cc1e295d',
				methodName: 'anonymiseContact',
				canActivate: true
			}, {
				serviceName: 'privacyMainSidebarWizardService',
				wizardGuid: '2ec1d2a9ded24da6a910564fe8527550',
				methodName: 'prepareToAnonymiseBp',
				canActivate: true
			}, {
				serviceName: 'privacyMainSidebarWizardService',
				wizardGuid: '6ce980e0de884c809e99fca91c99c88c',
				methodName: 'anonymiseBp',
				canActivate: true
			}, {
				serviceName: 'privacyMainSidebarWizardService',
				wizardGuid: '96c5ec26f949425ba2ae93d5ea18ce1c',
				methodName: 'deleteAnonymised',
				canActivate: true
			}];

			let options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService', function (platformSchemaService, basicsConfigWizardSidebarService) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);
						return platformSchemaService.getSchemas([
							{typeName: 'PrivacyRequestDto', moduleSubModule: 'Privacy.Main'}
						]);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
