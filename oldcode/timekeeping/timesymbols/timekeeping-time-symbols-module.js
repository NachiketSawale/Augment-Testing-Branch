/**
 * Created by nit on 07.05.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'timekeeping.timesymbols';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name timesymbols
	 * @description
	 * Module definition of the timekeeping time symbols module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			let wizardData = [
				{
					serviceName: 'timekeepingTimeSymbolsSidebarWizardService',
					wizardGuid: 'e7664f809aa442578263986b197a9f06',
					methodName: 'enableTimeSymbol',
					canActivate: true
				},
				{
					serviceName: 'timekeepingTimeSymbolsSidebarWizardService',
					wizardGuid: '4205c27f59144dd8ad638a99f650bff7',
					methodName: 'disableTimeSymbol',
					canActivate: true
				}

			];

			let options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', 'timekeepingTimeSymbolsConstantValues','basicsConfigWizardSidebarService', function (platformSchemaService, timekeepingTimeSymbolsConstantValues,basicsConfigWizardSidebarService) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);
						return platformSchemaService.getSchemas([
							timekeepingTimeSymbolsConstantValues.schemes.timeSymbol,
							timekeepingTimeSymbolsConstantValues.schemes.timeSymbolAccount,
							timekeepingTimeSymbolsConstantValues.schemes.timeSymbol2Group
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
