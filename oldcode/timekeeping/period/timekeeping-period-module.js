/*
 * $Id: timekeeping-period-module.js 634255 2021-04-27 12:53:54Z welss $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'timekeeping.period';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			let options = {
				moduleName: moduleName,
				resolve: {
					registerWizards: ['$q', 'basicsConfigWizardSidebarService', function registerWizards($q, basicsConfigWizardSidebarService) {
						let wizardData = [{
							serviceName: 'timekeepingPeriodSidebarWizardService',
							wizardGuid: '7e9548a88f274be19fa6835155739ea8',
							methodName: 'setPeriodStatus',
							canActivate: true
						}, {
							serviceName: 'timekeepingPeriodSidebarWizardService',
							wizardGuid: 'e0ae4ed1c9d240959a3c4e15bd2df2d2',
							methodName: 'createPeriodTransactions',
							canActivate: true
						},{
							serviceName: 'timekeepingPeriodSidebarWizardService',
							wizardGuid: '50dfbe208ef2449b8ee5ac71ae55e523',
							methodName: 'generateTimeSheetRecords',
							canActivate: true
						},
						{
							serviceName: 'timekeepingPeriodSidebarWizardService',
							wizardGuid: '1e79a86fa23e4f298a6ecca95551ce8f',
							methodName: 'lockIsSuccess',
							canActivate: true
						},
						{
							serviceName: 'timekeepingPeriodSidebarWizardService',
							wizardGuid: 'afd60abe173546089f30b09e9eee24fc',
							methodName: 'unlockIsSuccess',
							canActivate: true
						}];
						basicsConfigWizardSidebarService.registerWizard(wizardData);

						return $q.when(true);
					}],
					loadDomains: ['platformSchemaService', 'timekeepingPeriodConstantValues',
						function (platformSchemaService, timekeepingPeriodConstantValues) {
							return platformSchemaService.getSchemas([
								timekeepingPeriodConstantValues.schemes.period,
								timekeepingPeriodConstantValues.schemes.transaction,
								timekeepingPeriodConstantValues.schemes.validation
							]);
						}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['timekeeping']);
					}]
					/*
										loadTranslation: ['platformTranslateService', function (platformTranslateService) {
											return platformTranslateService.registerModule([moduleName], true);
										}]
					*/
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
