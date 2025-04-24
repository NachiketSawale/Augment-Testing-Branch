(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'object.main';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name object.main
	 * @description
	 * Module definition of the object module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var wizardData = [
				{
					serviceName: 'objectMainSidebarWizardService',
					wizardGuid: '2577fcb628944f66b5f96d3a4674f593',
					methodName: 'objectUnitStatus',
					canActivate: true
				},
				{
					serviceName: 'objectMainSidebarWizardService',
					wizardGuid: '62e6416e88be4fe887595b0debee6fba',
					methodName: 'objectProspectStatus',
					canActivate: true
				},
				{
					serviceName: 'objectMainOfferWizardService',
					wizardGuid: 'ec13c7b656674ca7aeff21c45997dcd9',
					methodName: 'createObjectUnitOffer',
					canActivate: true
				},
				{
					serviceName: 'objectMainBillWizardService',
					wizardGuid: '633b9a5124dc4670a351998e2a7fbe02',
					methodName: 'createObjectUnitBill',
					canActivate: true
				},
				{
					serviceName: 'objectMainSidebarWizardService',
					wizardGuid: '1c7402bc10a149d9b93138baf1903530',
					methodName: 'changeStatusForProjectDocument',
					canActivate: true
				},
				{
					serviceName: 'objectMainSidebarWizardService',
					wizardGuid: '446b60bf73574872bef79baa75b75a7a',
					methodName: 'objectInstallmentAgreementStatus',
					canActivate: true
				},
				{
					serviceName: 'documentsCentralQueryWizardService',
					wizardGuid: '09e2088390c740e1ab8da6c98cf61fcc',
					methodName: 'changeRubricCategory',
					canActivate: true,
					userParam: {
						'moduleName': moduleName
					}
				}
			];

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformModuleInitialConfigurationService', 'platformSchemaService', 'basicsConfigWizardSidebarService', function (platformModuleInitialConfigurationService, platformSchemaService, basicsConfigWizardSidebarService) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);
						return platformModuleInitialConfigurationService.load('Object.Main').then(function (modData) {
							var schemes = modData.schemes;
							schemes.push(
								{typeName: 'DocumentDto', moduleSubModule: 'Object.Main'},
								{typeName: 'ProspectActivityDto', moduleSubModule: 'Object.Main'},
								{typeName: 'ProspectChangeDto', moduleSubModule: 'Object.Main'},
								{typeName: 'ProspectDocDto', moduleSubModule: 'Object.Main'},
								{typeName: 'ProspectDto', moduleSubModule: 'Object.Main'},
								{typeName: 'UnitAreaDto', moduleSubModule: 'Object.Main'},
								{typeName: 'UnitDto', moduleSubModule: 'Object.Main'},
								{typeName: 'UnitPriceDto', moduleSubModule: 'Object.Main'},
								{typeName: 'UnitPhotoDto', moduleSubModule: 'Object.Main'},
								{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
								{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
								{typeName: 'Unit2ObjUnitDto', moduleSubModule: 'Object.Main'},
								{typeName: 'MeterTypeReadingDto', moduleSubModule: 'Object.Main'},
								{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
								{typeName: 'UnitInstallmentDto', moduleSubModule: 'Object.Main'}
							);
							return platformSchemaService.getSchemas(schemes);
						});
					}],

					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'objectMainConstantValues', function (basicsCompanyNumberGenerationInfoService, objectMainConstantValues) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('objectMainUnitNumberInfoService', objectMainConstantValues.rubricId).load();
					}],

					// needed to install listener for parent-service create event (even when characteristic container ist not activated)
					'initCharacteristicDataService': ['basicsCharacteristicDataServiceFactory', 'objectMainUnitService',
						function (basicsCharacteristicDataServiceFactory, objectMainUnitService) {
							basicsCharacteristicDataServiceFactory.getService(objectMainUnitService, 36);
						}
					]

				}
			};
			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('objectMainUnitService').loadAfterNavigation(item, triggerField);
					}
				}
			);
		}]);
})(angular);