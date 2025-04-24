/**
 * Created by baf on 28.05.2021.
 */
(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'timekeeping.worktimemodel';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name worktimemodel
	 * @description
	 * Module definition of the timekeeping time work time model module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			let wizardData = [
				{
					serviceName: 'timekeepingWorkTimeModelSidebarWizardService',
					wizardGuid: '50964ae0506c461fb7099b8e1bc7eab8',
					methodName: 'enableWorkTimeModel',
					canActivate: true
				},
				{
					serviceName: 'timekeepingWorkTimeModelSidebarWizardService',
					wizardGuid: '8fdef7489ab7418f917f9286eb257d01',
					methodName: 'disableWorkTimeModel',
					canActivate: true
				}

			];
			let options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', 'timekeepingWorkTimeModelConstantValues','basicsConfigWizardSidebarService', function (platformSchemaService, timekeepingWorkTimeModelConstantValues,basicsConfigWizardSidebarService) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);
						return platformSchemaService.getSchemas([
							timekeepingWorkTimeModelConstantValues.schemes.workTimeModel,
							timekeepingWorkTimeModelConstantValues.schemes.derivation,
							timekeepingWorkTimeModelConstantValues.schemes.day,
							timekeepingWorkTimeModelConstantValues.schemes.dtl,
							timekeepingWorkTimeModelConstantValues.schemes.ts2wtm
						]);
					}],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName], true);
					}]
				}

			};

			mainViewServiceProvider.registerModule(options);
		}
	]);
})(angular);
