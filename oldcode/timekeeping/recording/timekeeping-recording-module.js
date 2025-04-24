/*
 * $Id: timekeeping-recording-module.js 634255 2021-04-27 12:53:54Z welss $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'timekeeping.recording';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			let wizardData = [{
				serviceName: 'timeKeepingRecordingSideBarWizardService',
				wizardGuid: '270c41ffa65f42b896df5514d1a50014',
				methodName: 'calculateOvertime',
				canActivate: true
			},
			{
				serviceName: 'timeKeepingRecordingSideBarWizardService',
				wizardGuid: '3c5afd7ff2c649839a8816266392571f',
				methodName: 'calculateOtherDerivations',
				canActivate: true
			},
			{
				serviceName: 'timeKeepingRecordingSideBarWizardService',
				wizardGuid: '4833891d71fb4b978c8f5c8310c36450',
				methodName: 'setRecordingStatus',
				canActivate: true
			},
			{
				serviceName: 'timeKeepingRecordingSideBarWizardService',
				wizardGuid: '67e70baabc0a4dedba0d499020078aa0',
				methodName: 'setReportStatus',
				canActivate: true
			},
			{
				serviceName: 'timeKeepingRecordingSideBarWizardService',
				wizardGuid: '7a78d6d3ef7043a89167641c6c1de24b',
				methodName: 'setBulkReportStatus',
				canActivate: true
			},
			{
				serviceName: 'timeKeepingRecordingSideBarWizardService',
				wizardGuid: 'e25cba20c7c84b44a55734cb439d6e90',
				methodName: 'setSheetStatus',
				canActivate: true
			},
			{
				serviceName: 'timeKeepingRecordingSideBarWizardService',
				wizardGuid: 'ed0025985a164543914136124b9fa81a',
				methodName: 'setResultStatus',
				canActivate: true
			},
			{
				serviceName: 'timeKeepingRecordingSideBarWizardService',
				wizardGuid: '6e953200d9464579beb9d70f7684c4eb',
				methodName: 'createReportsFromCrewLeader',
				canActivate: true
			},
			{
				serviceName: 'timeKeepingRecordingSideBarWizardService',
				wizardGuid: '84a1e6ab3f5247bfb8eb26f08795a74c',
				methodName: 'enableReports',
				canActivate: true
			},
			{
				serviceName: 'timeKeepingRecordingSideBarWizardService',
				wizardGuid: '22df9c21008848df9b575f61540427b3',
				methodName: 'disableReports',
				canActivate: true
			},
			{
				serviceName: 'timeKeepingRecordingSideBarWizardService',
				wizardGuid: '8038db7bf72743c1a90fc6ad221f17de',
				methodName: 'unlockUsedForTransaction',
				canActivate: true
			}
			];


			let options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformModuleInitialConfigurationService', 'platformSchemaService', 'basicsConfigWizardSidebarService','timekeepingRecordingConstantValues', 'timekeepingEmployeeConstantValues',
						'timekeepingShiftModelConstantValues', 'timekeepingRecordingReportClockingService', 'platformContextService', 'platformPermissionService', 'permissions',
						function (platformModuleInitialConfigurationService, platformSchemaService,basicsConfigWizardSidebarService,timekeepingRecordingConstantValues, timekeepingEmployeeConstantValues,
							timekeepingShiftModelConstantValues, timekeepingRecordingReportClockingService, platformContextService, platformPermissionService, permissions) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							let schemes = [
								timekeepingRecordingConstantValues.schemes.recording,
								timekeepingRecordingConstantValues.schemes.report,
								timekeepingRecordingConstantValues.schemes.result,
								timekeepingRecordingConstantValues.schemes.break,
								timekeepingRecordingConstantValues.schemes.sheet,
								timekeepingRecordingConstantValues.schemes.verification,
								timekeepingEmployeeConstantValues.schemes.employee,
								timekeepingShiftModelConstantValues.schemes.workingTime
							];
							return platformModuleInitialConfigurationService.load('Timekeeping.Recording').then(function (modData) {
								timekeepingRecordingReportClockingService.checkUserConnectToEmployee(platformContextService.getCurrentUserId()).then(function (res) {
									if (res.employee && res.employee.IsClocking) {
										platformPermissionService.restrict([timekeepingRecordingConstantValues.permissionUuid.recordings, timekeepingRecordingConstantValues.permissionUuid.reports, timekeepingRecordingConstantValues.permissionUuid.results,
												timekeepingRecordingConstantValues.permissionUuid.sheets, timekeepingRecordingConstantValues.permissionUuid.breaks, timekeepingRecordingConstantValues.permissionUuid.verifications],
											permissions.read);
									}
								});
								return platformSchemaService.getSchemas(schemes.concat(modData.schemes));
							});
						}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'timekeepingRecordingConstantValues', function (basicsCompanyNumberGenerationInfoService, timekeepingRecordingConstantValues) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('timekeepingRecordingNumberInfoService', timekeepingRecordingConstantValues.rubricId).load();
					}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['timekeeping', 'resource', 'logistic', 'basics']);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
