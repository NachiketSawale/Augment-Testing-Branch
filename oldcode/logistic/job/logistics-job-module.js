(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.job';

	angular.module(moduleName, ['ui.router', 'platform', 'basics.common', 'basics.lookupdata']);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name logistic job
	 * @description
	 * Module definition of the logistic job module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var wizardData = [{
				serviceName: 'logisticJobSidebarWizardService',
				wizardGuid: 'f82091693e264f4e8bf7b5afd9e4a80c',
				methodName: 'setJobStatus',
				canActivate: true
			}, {
				// ALM: 116514 => vanilla data is removed => added again
				serviceName: 'logisticJobCreateDispatchFromJobCardWizardService',
				wizardGuid: '164bed577ae3489189b4c026c056f6ed',
				methodName: 'createDispatchNoteFromJobCard',
				canActivate: true
			}, {
				// ALM: 116514 => vanilla data is removed
				serviceName: 'logisticJobSidebarWizardService',
				wizardGuid: 'f0acc86943ab46a296e98f6968e89f56',
				methodName: 'createDispatchNoteFromJobCardBySelectedJob',
				canActivate: true
			}, {
				serviceName: 'logisticJobSidebarWizardService',
				wizardGuid: '80ba2ee402c64602a448bfd55fb44696',
				methodName: 'adjustQuantities',
				canActivate: true
			}, {
				serviceName: 'logisticJobSidebarWizardService',
				wizardGuid: '2720a555be50403cbe27782cab8c169b',
				methodName: 'clearProject',
				canActivate: true
			}, {
				serviceName: 'logisticJobSidebarWizardService',
				wizardGuid: 'f53cdb1778e64fa6a17443e0d1544f46',
				methodName: 'reserveMaterialAndStock',
				canActivate: true
			}, {
				serviceName: 'logisticJobSidebarWizardService',
				wizardGuid: '9beca341e9514e1c8259389e549c1eed',
				methodName: 'disableJob',
				canActivate: true
			}, {
				serviceName: 'logisticJobSidebarWizardService',
				wizardGuid: 'bf9c4cd39404459e8cc5b38b2e75747c',
				methodName: 'enableJob',
				canActivate: true
			}, {
				serviceName: 'logisticCardChangeWOTOfAssignedPlantWizardService',
				wizardGuid: '6FA888889ADA49A7B288484830116E6C',
				methodName: 'changeWOTOfAssignedPlant',
				canActivate: true
			},
			{
				serviceName: 'basicsUserFormFormDataWizardService',
				wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
				methodName: 'changeFormDataStatus',
				canActivate: true
			},{
					serviceName: 'logisticJobSidebarWizardService',
					wizardGuid: 'cd4407fa586d47e7b9319ebe841513af',
					methodName: 'changeStatusForProjectDocument',
					canActivate: true
				}];

			var options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['platformModuleInitialConfigurationService', 'platformSchemaService', 'basicsConfigWizardSidebarService',
						'logisticJobConstantValues',
						function (platformModuleInitialConfigurationService, platformSchemaService, basicsConfigWizardSidebarService, logisticJobConstantValues) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);

							return platformModuleInitialConfigurationService.load('Logistic.Job').then(function (modData) {
								var schemes = modData.schemes;

								schemes.push(logisticJobConstantValues.schemes.job);
								schemes.push({typeName: 'JobDocumentDto', moduleSubModule: 'Logistic.Job'});
								schemes.push({
									typeName: 'LogisticEquipmentCatalogPriceDto',
									moduleSubModule: 'Logistic.Job'
								});
								schemes.push({
									typeName: 'LogisticMaterialCatalogPriceDto',
									moduleSubModule: 'Logistic.Job'
								});
								schemes.push({
									typeName: 'LogisticMaterialRateDto',
									moduleSubModule: 'Logistic.Job'
								});
								schemes.push({typeName: 'LogisticPlantPriceDto', moduleSubModule: 'Logistic.Job'});
								schemes.push(logisticJobConstantValues.schemes.sundryServicePrice);
								schemes.push({
									typeName: 'LogisticCostCodeRateDto',
									moduleSubModule: 'Logistic.Job'
								});
								schemes.push({typeName: 'Project2MaterialDto', moduleSubModule: 'Logistic.Job'});
								schemes.push({
									typeName: 'Project2MaterialPriceConditionDto',
									moduleSubModule: 'Logistic.Job'
								});
								schemes.push(logisticJobConstantValues.schemes.plantAllocation);
								schemes.push(logisticJobConstantValues.schemes.plantLocation);
								schemes.push(logisticJobConstantValues.schemes.jobTask);
								schemes.push({typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'});
								schemes.push( {typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'});
								schemes.push({typeName: 'PrcItemDto', moduleSubModule: 'Procurement.Common'});
								schemes.push({typeName: 'InvOtherDto', moduleSubModule: 'Procurement.Invoice'});
								schemes.push({typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'});
								schemes.push({typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'});
								return platformSchemaService.getSchemas(schemes);
							});
						}
					],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'logisticJobConstantValues', function (basicsCompanyNumberGenerationInfoService, logisticJobConstantValues) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticJobNumberInfoService', logisticJobConstantValues.rubricId).load();
					}],

					loadCodeGenerationInfo2: ['basicsCompanyNumberGenerationInfoService', 'logisticDispatchingConstantValues', function (basicsCompanyNumberGenerationInfoService, logisticDispatchingConstantValues) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticDispatchingHeaderNumberInfoService', logisticDispatchingConstantValues.rubricId).load();
					}],

					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['logistic', 'resource', 'basics', 'project', 'documents']);
					}],
					loadModuleInfo: ['basicsDependentDataModuleLookupService', function (basicsDependentDataModuleLookupService) {
						basicsDependentDataModuleLookupService.loadData();
					}]
				}
			};
			platformLayoutService.registerModule(options);
		}]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('logisticJobDataService').navigateTo(item, triggerField);
					}
				}
			);
		}]);
})(angular);
