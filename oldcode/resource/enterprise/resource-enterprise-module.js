/**
 * Created by baf on 05.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'resource.enterprise';

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
					methodName: 'createDispatchNodesFromEnterprise',
					canActivate: true
				},
				{
					serviceName: 'resourceEnterpriseWizardService',
					wizardGuid: '64b7ce1ad52c4380ab20074bf6f5381b',
					methodName: 'changeReservationStatus',
					canActivate: true
				},	{
					serviceName: 'resourceReservationHireContractWizardService',
					wizardGuid: '2c388bd6738f4a3888c7217547838c49',
					methodName: 'createHireContractFromEnterprise',
					canActivate: true
				},
				{
					serviceName: 'resourceEnterpriseWizardService',
					wizardGuid: '6ca96af71f9c4c9293a00c7de64bbf94',
					methodName: 'changeRequisitionStatus',
					canActivate: true
				},
			];

			var options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', 'platformModuleInitialConfigurationService', 'basicsConfigWizardSidebarService',
						function (platformSchemaService, platformModuleInitialConfigurationService, basicsConfigWizardSidebarService) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							return platformModuleInitialConfigurationService.load('Resource.Enterprise').then(function (modData) {
								var schemes = modData.schemes;
								schemes.push(
									{ typeName: 'ResourceDto', moduleSubModule: 'Resource.Master' },
									{ typeName: 'BasicsCustomizeLogisticsDispatcherGroupDTO', moduleSubModule: 'Basics.Customize' },
									{ typeName: 'ReservationDto', moduleSubModule: 'Resource.Reservation' },
									{ typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition' },
									{ typeName: 'DispatcherGroups2ReservationVDto', moduleSubModule: 'Resource.Enterprise' },
									{ typeName: 'DispatchRecordDto', moduleSubModule: 'Logistic.Dispatching' }
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
