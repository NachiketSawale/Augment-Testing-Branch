/**
 * Created by leo on 02.05.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'timekeeping.shiftmodel';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name timekeeping.shiftmodel
	 * @description
	 * Module definition of the timekeeping shift model module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			let wizardData = [{
				serviceName: 'timekeepingShiftModelSideBarWizardService',
				wizardGuid: '882667d0186f4138a1dd3d051003ab27',
				methodName: 'createExceptionDaysFromCalendar',
				canActivate: true
			}
			];

			let options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', 'timekeepingShiftModelConstantValues','platformModuleInitialConfigurationService','basicsConfigWizardSidebarService',
						function (platformSchemaService,timekeepingShiftModelConstantValues,platformModuleInitialConfigurationService,basicsConfigWizardSidebarService) {
							return platformModuleInitialConfigurationService.load('Timekeeping.TimeAllocation').then(function (modData) {
								basicsConfigWizardSidebarService.registerWizard(wizardData);
								let schemes = modData.schemes;
								schemes.push(
									timekeepingShiftModelConstantValues.schemes.shift,
									timekeepingShiftModelConstantValues.schemes.break,
									timekeepingShiftModelConstantValues.schemes.workingTime,
									timekeepingShiftModelConstantValues.schemes.exceptionDay,
									timekeepingShiftModelConstantValues.schemes.shift2Group
								);

								return platformSchemaService.getSchemas(schemes);
							});
						}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['timekeeping', 'basics']);
					}]

				}
			};
			platformLayoutService.registerModule(options);
		}
	]);
})(angular);
