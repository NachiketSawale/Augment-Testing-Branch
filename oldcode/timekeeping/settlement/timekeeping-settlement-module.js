/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'timekeeping.settlement';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			let wizardData = [
				{
					serviceName: 'timekeepingSettlementSidebarWizardService',
					wizardGuid: '543cf5918f2b4fb0b9b0547c0aee7f02',
					methodName: 'setTimekeepingSettlementStatus',
					canActivate: true
				}
			];
			let options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', 'timekeepingSettlementConstantValues','basicsConfigWizardSidebarService', function (platformSchemaService, timekeepingSettlementConstantValues,basicsConfigWizardSidebarService) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);
						return platformSchemaService.getSchemas([
							timekeepingSettlementConstantValues.schemes.settlement,
							timekeepingSettlementConstantValues.schemes.item
						]);
					}],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName], true);
					}]
				}
			};

			platformLayoutService.registerModule(options);
		}
	]);
})(angular);
