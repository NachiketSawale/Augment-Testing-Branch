/*
 * $Id$
 * Copyright (c) RIB Software SE
 */
/* global globals */

(function (angular) {
	'use strict';

	let moduleName = 'timekeeping.timeallocation';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			let wizardData = [{
				serviceName: 'timekeepingTimeallocationSideBarWizardService',
				wizardGuid: '5bf44f7c795c4564ba6e6479aba781ea',
				methodName: 'createResult',
				canActivate: true
			},{
				serviceName: 'timekeepingTimeallocationSideBarWizardService',
				wizardGuid: '2f9936fd0ec641399cdffe45e975e5e1',
				methodName: 'setTimeAllocationStatus',
				canActivate: true
			},{
				serviceName: 'timekeepingTimeallocationSideBarWizardService',
				wizardGuid: '00e8423f11724c9f943adbbe09e2d3f8',
				methodName: 'createDispatchingRecords',
				canActivate: true
			},{
				serviceName: 'timekeepingTimeallocationSideBarWizardService',
				wizardGuid: '3648738db0f24eb08b67af4ce31c5f7a',
				methodName: 'setReportStatus',
				canActivate: true
			},{
				serviceName: 'timekeepingTimeallocationSideBarWizardService',
				wizardGuid: '49167b7f96ee4ef3a104858eab3a3fb1',
				methodName: 'levelAllocatedTimes',
				canActivate: true
			},{
				serviceName: 'timekeepingTimeallocationSideBarWizardService',
				wizardGuid: 'e0fbd61d382c41ae8e9a6eb84224b931',
				methodName: 'createResultHeaders',
				canActivate: true
			}
			];

			let options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', 'platformModuleInitialConfigurationService', 'basicsConfigWizardSidebarService', 'timekeepingTimeallocationConstantValues',
						function (platformSchemaService, platformModuleInitialConfigurationService, basicsConfigWizardSidebarService, timekeepingTimeallocationConstantValues) {
							return platformModuleInitialConfigurationService.load('Timekeeping.TimeAllocation').then(function (modData) {
								basicsConfigWizardSidebarService.registerWizard(wizardData);
								let schemes = modData.schemes;
								schemes.push(
									timekeepingTimeallocationConstantValues.schemes.timeallocationheader,
									timekeepingTimeallocationConstantValues.schemes.timeallocationitem
								);

								return platformSchemaService.getSchemas(schemes);
							});
						}],
					/*
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName], true);
					}],
*/
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['timekeeping', 'resource', 'logistic', 'basics']);
					}],
					loadCodeGenerationInfo:['basicsCompanyNumberGenerationInfoService', function (basicsCompanyNumberGenerationInfoService){
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticDispatchingHeaderNumberInfoService',34).load();
					}],

					loadModuleInfo: ['basicsDependentDataModuleLookupService', function (basicsDependentDataModuleLookupService) {
						basicsDependentDataModuleLookupService.loadData();
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
