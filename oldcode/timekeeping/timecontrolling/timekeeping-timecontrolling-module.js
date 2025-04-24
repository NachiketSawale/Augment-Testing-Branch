/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'timekeeping.timecontrolling';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			let wizardData = [{
				serviceName: 'timekeepingTimeControllingSideBarWizardService',
				wizardGuid: '270c41ffa65f42b896df5514d1a50014',
				methodName: 'calculateOvertime',
				canActivate: true
			},
			{
				serviceName: 'timekeepingTimeControllingSideBarWizardService',
				wizardGuid: '3c5afd7ff2c649839a8816266392571f',
				methodName: 'calculateOtherDerivations',
				canActivate: true
			},
			{
				serviceName: 'timekeepingTimeControllingSideBarWizardService',
				wizardGuid: '67e70baabc0a4dedba0d499020078aa0',
				methodName: 'setReportStatus',
				canActivate: true
			},
			{
				serviceName: 'timekeepingTimeControllingSideBarWizardService',
				wizardGuid: '84a1e6ab3f5247bfb8eb26f08795a74c',
				methodName: 'enableReports',
				canActivate: true
			},
			{
				serviceName: 'timekeepingTimeControllingSideBarWizardService',
				wizardGuid: '22df9c21008848df9b575f61540427b3',
				methodName: 'disableReports',
				canActivate: true
			},
				{
					serviceName: 'timeKeepingRecordingSideBarWizardService',
					wizardGuid: '7a78d6d3ef7043a89167641c6c1de24b',
					methodName: 'setBulkReportStatus',
					canActivate: true
				}
			];

			let options = {
				'moduleName': moduleName,
				'resolve': {
					loadDomains: ['platformModuleInitialConfigurationService', 'platformSchemaService', 'basicsConfigWizardSidebarService','timekeepingTimeControllingConstantValues',
						'timekeepingRecordingReportClockingService', 'platformContextService', 'platformPermissionService', 'permissions',
						function (platformModuleInitialConfigurationService, platformSchemaService,basicsConfigWizardSidebarService,timekeepingTimeControllingConstantValues,
							timekeepingRecordingReportClockingService, platformContextService, platformPermissionService, permissions) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							let schemes = [
								timekeepingTimeControllingConstantValues.schemes.report,
								timekeepingTimeControllingConstantValues.schemes.break,
								timekeepingTimeControllingConstantValues.schemes.verification
							];
							return platformSchemaService.getSchemas(schemes);
						}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['timekeeping', 'basics']);
					}],
					setPermission: ['timekeepingTimeControllingConstantValues',
						'timekeepingRecordingReportClockingService', 'platformContextService', 'platformPermissionService', 'permissions',
						function (timekeepingTimeControllingConstantValues,
						timekeepingRecordingReportClockingService, platformContextService, platformPermissionService, permissions) {
							return timekeepingRecordingReportClockingService.checkUserConnectToEmployee(platformContextService.getCurrentUserId()).then(function (res) {
								if (res.employee && res.employee.IsClocking) {
									platformPermissionService.restrict([timekeepingTimeControllingConstantValues.permissionUuid.reports,
											timekeepingTimeControllingConstantValues.permissionUuid.breaks, timekeepingTimeControllingConstantValues.permissionUuid.verifications],
										permissions.read);
								}
							});
						}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
