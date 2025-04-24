(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'resource.requisition';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name resource.requisition
	 * @description
	 * Module definition of the resource requisition module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var wizardData = [{
				serviceName: 'resourceRequisitionSidebarWizardService',
				wizardGuid: '17bea516f8cd44e79d77ff18067303af',
				methodName: 'setRequisitionStatus',
				canActivate: true
			},
			{
				serviceName: 'resourceRequisitionSidebarWizardService',
				wizardGuid: 'b125fd7acb964dfcb4041b7f7f0ed008',
				methodName: 'reserveMaterialAndStock',
				canActivate: true
			},{
				serviceName: 'resourceRequisitionSidebarWizardService',
				wizardGuid: '0421023029a24b46aa418921bbadfbba',
				methodName: 'createDispatchingForMaterialReservation',
				canActivate: true
			},{
				serviceName: 'resourceRequisitionSidebarWizardService',
				wizardGuid: 'af2dd97d6ce141b2b33c489b00d68eba',
				methodName: 'createHireContractFromRequisition',
				canActivate: true
			},
			{
				serviceName: 'basicsUserFormFormDataWizardService',
				wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
				methodName: 'changeFormDataStatus',
				canActivate: true
			},
			{
				serviceName: 'resourceRequisitionSidebarWizardService',
				wizardGuid: '4481a958496c45b3a7b18fdef7e082d9',
				methodName: 'changeRequisitionRequestedDate',
				canActivate: true
			}];

			var options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['platformSchemaService', 'basicsConfigWizardSidebarService', 'resourceRequisitionConstantValues',
						function (platformSchemaService, basicsConfigWizardSidebarService, resourceRequisitionConstantValues) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							return platformSchemaService.getSchemas([
								resourceRequisitionConstantValues.schemes.requisition,
								resourceRequisitionConstantValues.schemes.requiredSkill,
								resourceRequisitionConstantValues.schemes.requisitionDocument,
								resourceRequisitionConstantValues.schemes.requisitionItem,
								resourceRequisitionConstantValues.schemes.stock,
								{typeName: 'StockHeaderVDto', moduleSubModule: 'Procurement.Stock'},
								{typeName: 'StockTotalVDto', moduleSubModule: 'Procurement.Stock'},
								{typeName: 'StockTransactionDto', moduleSubModule: 'Procurement.Stock'},
								{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
								{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'}
							]);
						}
					],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'resourceRequisitionConstantValues', function (basicsCompanyNumberGenerationInfoService, resourceRequisitionConstantValues) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('resourceRequsitionNumberInfoService', resourceRequisitionConstantValues.rubricId).load();
					}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['resource', 'logistic', 'basics', 'project', 'scheduling', 'services','documents']);
					}],
					loadModuleInfo: ['basicsDependentDataModuleLookupService', function (basicsDependentDataModuleLookupService) {
						basicsDependentDataModuleLookupService.loadData();
					}]
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
							$injector.get('resourceRequisitionDataService').loadAfterNavigation(item, triggerField);
						}
					}
			);
		}]);
})(angular);
