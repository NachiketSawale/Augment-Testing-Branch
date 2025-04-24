(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'resource.reservation';

	angular.module(moduleName, ['resource.requisition']);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name resource.reservation
	 * @description
	 * Module definition of the resource module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var wizardData = [{
				serviceName: 'resourceReservationSidebarWizardService',
				wizardGuid: 'd80b7f24cc764c8da395f4d1e468185e',
				methodName: 'setReservationStatus',
				canActivate: true
			},
			{
				serviceName: 'resourceReservationSidebarWizardService',
				wizardGuid: '12f22d52a15045db9d78eb0a793aedb3',
				methodName: 'createDispatchNodesFromReservation',
				canActivate: true
			},
			{
				serviceName: 'resourceReservationHireContractWizardService',
				wizardGuid: '2c388bd6738f4a3888c7217547838c49',
				methodName: 'createHireContractFromReservation',
				canActivate: true
			},
			{
				serviceName: 'resourceReservationSidebarWizardService',
				wizardGuid: '078d4c51049e4687851b73c181efefb8',
				methodName: 'changeRequisitionStatus',
				canActivate: true
			},
			{
				serviceName: 'basicsUserFormFormDataWizardService',
				wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
				methodName: 'changeFormDataStatus',
				canActivate: true
			}
			];

			var options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['platformSchemaService', 'platformModuleInitialConfigurationService', 'basicsConfigWizardSidebarService',
						function (platformSchemaService, platformModuleInitialConfigurationService, basicsConfigWizardSidebarService) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							return platformModuleInitialConfigurationService.load('Resource.Reservation').then(function (modData) {
								var schemes = modData.schemes;
								schemes.push(
									{ typeName: 'ReservationDto', moduleSubModule: 'Resource.Reservation'},
									{ typeName: 'ResourceDto', moduleSubModule: 'Resource.Master'},
									{ typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'},
									{ typeName: 'DispatchRecordDto', moduleSubModule: 'Logistic.Dispatching' }
								);

								return platformSchemaService.getSchemas(schemes);
							});
						}
					],

					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['resource', 'logistic', 'basics', 'project', 'cloud']);
					}],

					loadModuleInfo: ['basicsDependentDataModuleLookupService', function (basicsDependentDataModuleLookupService) {
						basicsDependentDataModuleLookupService.loadData();
					}]
				}
			};
			platformLayoutService.registerModule(options);
		}
	]);
})(angular);
