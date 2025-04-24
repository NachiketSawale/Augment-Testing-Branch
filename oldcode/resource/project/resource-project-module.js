/**
 * Created by cakiral on 27.005.2021
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'resource.project';

	angular.module(moduleName, ['ui.router', 'platform', 'basics.common', 'basics.lookupdata', 'basics.currency']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var wizardData = [
				{
					serviceName: 'resourceReservationSidebarWizardService',
					wizardGuid: '12f22d52a15045db9d78eb0a793aedb3',
					methodName: 'createDispatchNodesFromProject',
					canActivate: true
				},
				{
					serviceName: 'resourceProjectWizardService',
					wizardGuid: '02e66432bed411eb85290242ac130003',
					methodName: 'changeReservationStatus',
					canActivate: true
				},
				{
					serviceName: 'resourceProjectWizardService',
					wizardGuid: 'b9ca64e1af9440c4a0b2de3b2c45ef08',
					methodName: 'createReservation',
					canActivate: true
				},
				{
					serviceName: 'resourceReservationHireContractWizardService',
					wizardGuid: '2c388bd6738f4a3888c7217547838c49',
					methodName: 'createHireContractFromProject',
					canActivate: true
				},
				{
					serviceName: 'resourceProjectWizardService',
					wizardGuid: 'ab3e12e9e01941ad9733d72b10a1209a',
					methodName: 'changeRequisitionStatus',
					canActivate: true
				},
				{
					serviceName: 'resourceProjectWizardService',
					wizardGuid: '631de06069da434ca11f19cf8946166b',
					methodName: 'genResRequisitionFromEst',
					canActivate: true
				},
				{
					serviceName: 'resourceProjectWizardService',
					wizardGuid: 'e058918c4c0b46e2bee42bb7b4f4b411',
					methodName: 'createExecutionPlannerItem',
					canActivate: true
				},
				{
					serviceName: 'resourceProjectWizardService',
					wizardGuid: '50b8e64ad5f14c9897ffe5fc28ec475b',
					methodName: 'changeActionItemStatus',
					canActivate: true
				},
				{
					serviceName: 'resourceProjectWizardService',
					wizardGuid: '67068c4204724a789a68a02f225c5ceb',
					methodName: 'assignTimeslotToRequisition',
					canActivate: true
				},
				{
					serviceName: 'resourceProjectWizardService',
					wizardGuid: '9e429dfe9ae24a679c327882d078bca2',
					methodName: 'updateTimeslotToRequisition',
					canActivate: true
				}
			];
			var options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', 'platformModuleInitialConfigurationService', 'resourceProjectConstantValues', 'basicsConfigWizardSidebarService',
						function (platformSchemaService, platformModuleInitialConfigurationService, resourceProjectConstantValues, basicsConfigWizardSidebarService) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							return platformModuleInitialConfigurationService.load('Resource.Project').then(function (modData) {
								var schemes = modData.schemes;
								schemes.push(
									resourceProjectConstantValues.schemes.resource,
									resourceProjectConstantValues.schemes.project,
									resourceProjectConstantValues.schemes.estimateHeader,
									resourceProjectConstantValues.schemes.plantCostCode,
									resourceProjectConstantValues.schemes.dispatchRecord,
									resourceProjectConstantValues.schemes.execPlannerItem,
									resourceProjectConstantValues.schemes.requisitionTimeslot,
									{ typeName: 'ReservationDto', moduleSubModule: 'Resource.Reservation' },
									{ typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition' },
									{ typeName: 'ReservationDto', moduleSubModule: 'Resource.Reservation' }
								);
								return platformSchemaService.getSchemas(schemes);
							});
						}
					],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['resource', 'logistic', 'basics', 'project', 'cloud']);
					}]
				}
			};
			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
