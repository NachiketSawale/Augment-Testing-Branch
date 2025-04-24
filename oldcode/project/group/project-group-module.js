/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'project.group';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			let wizardData = [{
				serviceName: 'projectGroupSidebarWizardService',
				wizardGuid: '442d87ae14d84adf870f6dcdf164e598',
				methodName: 'setProjectGroupStatus',
				canActivate: true
			}];

			let options = {
				moduleName: moduleName,
				resolve: {
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['basics', 'project']);
					}],
					loadDomains: [
						'platformSchemaService', 'projectGroupConstantValues', 'basicsConfigWizardSidebarService',
						function (
							platformSchemaService, projectGroupConstantValues, basicsConfigWizardSidebarService
						)
						{
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							return platformSchemaService.getSchemas([
								projectGroupConstantValues.schemes.projectGroup
							]);
						}
					]
				},
				permissions: ['a3dbe3d8b5bf409e9563a13cd97f1eb5']
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
