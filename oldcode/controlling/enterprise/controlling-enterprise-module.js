/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'controlling.enterprise';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			mainViewServiceProvider.registerModule({
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							// {typeName: 'SomeDto', moduleSubModule: 'Controlling.Enterprise'}
						]);
					}]
				}
			});
		}
	]).run(['basicsConfigWizardSidebarService',
		function (wizardService) {
			// register wizards
			var CreateWD = wizardService.WizardData;
			wizardService.registerWizard([
				new CreateWD('controllingEnterpriseWizardService', 'a6ec65f73d3342bc8476ea0b9b6fe2ec', 'syncUser')
			]);
		}]);

})(angular);
