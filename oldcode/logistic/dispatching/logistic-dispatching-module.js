/**
 * Created by baf on 29.01.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.dispatching';

	angular.module(moduleName, ['ui.router', 'platform', 'basics.common', 'basics.lookupdata', 'basics.currency',
		'logistic.common']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var wizardData = [{
				serviceName: 'logisticDispatchingSidebarWizardService',
				wizardGuid: 'bf7aa5b157f0496684c17252971f2f72',
				methodName: 'setDispatchHeaderStatus',
				canActivate: true
			}, {
				serviceName: 'logisticDispatchingSidebarWizardService',
				wizardGuid: 'f359f76baaa64e1f87e1b6ca77dc72a4',
				methodName: 'setDispatchRecordStatus',
				canActivate: true
			}, {
				serviceName: 'logisticDispatchingSidebarWizardService',
				wizardGuid: 'c60f71717aa2445a9b7d6863cf045b23',
				methodName: 'clearProject',
				canActivate: true
			}, {
				serviceName: 'logisticDispatchingSidebarWizardService',
				wizardGuid: 'e681148e901c467290cdffeaf97bec83',
				methodName: 'generateTransportRecords',
				canActivate: true
			},{
				serviceName: 'logisticDispatchingCreateBackOrdersWizardService',
				wizardGuid: 'f17e3ce3f9f64535a849d28fc81e36d4',
				methodName: 'createBackOrders',
				canActivate: true
			},{
				serviceName: 'logisticDispatchingSidebarWizardService',
				wizardGuid: 'f6ef9f2d05b94eda9c49e7c3f4280cb1',
				methodName: 'recalculateDispatchNotes',
				canActivate: true
			},
			{
				serviceName: 'basicsUserFormFormDataWizardService',
				wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
				methodName: 'changeFormDataStatus',
				canActivate: true
			},
			{
				serviceName: 'logisticDispatchingSidebarWizardService',
				wizardGuid: '31a21978d9f1430d952f109922d911b2',
				methodName: 'bulkSetWot',
				canActivate: true
			}, {
				serviceName: 'logisticDispatchingSidebarWizardService',
				wizardGuid: '577887b5022d4169925ee500691f24d8',
				methodName: 'createPES',
				canActivate: true
			},{
				serviceName: 'logisticDispatchingSidebarWizardService',
				wizardGuid: '1fc70d470aff456c857815c02df9621e',
				methodName: 'changeStatusForProjectDocument',
				canActivate: true
			},
			{
				serviceName: 'logisticDispatchingSidebarWizardService',
				wizardGuid: 'f3d23ab6ed43489c9fe64bf7e4d6d8e8',
				methodName: 'revertAllocationFromDispatchRecord',
				canActivate: true
			}];

			var options = {
				moduleName: moduleName,
				resolve: {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function (platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					loadDomains: ['platformSchemaService', 'basicsConfigWizardSidebarService', 'logisticJobConstantValues',
						'logisticDispatchingConstantValues', 'platformModuleInitialConfigurationService',
						function (platformSchemaService, basicsConfigWizardSidebarService, logisticJobConstantValues, logisticDispatchingConstantValues, platformModuleInitialConfigurationService) {
							return platformModuleInitialConfigurationService.load('Logistic.Dispatching').then(function (modData){
								basicsConfigWizardSidebarService.registerWizard(wizardData);
								let schemes = modData.schemes;
								schemes.push(
									{typeName: 'DispatchHeaderDto', moduleSubModule: 'Logistic.Dispatching'},
									{typeName: 'DispatchRecordDto', moduleSubModule: 'Logistic.Dispatching'},
									{typeName: 'DispatchDocumentDto', moduleSubModule: 'Logistic.Dispatching'},
									{typeName: 'StockHeaderVDto', moduleSubModule: 'Procurement.Stock'},
									{typeName: 'StockTotalVDto', moduleSubModule: 'Procurement.Stock'},
									{typeName: 'JobPlantAllocationDto', moduleSubModule: 'Logistic.Job'},
									{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
									{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
									{typeName: 'DispatchHeaderLinkageDto', moduleSubModule: 'Logistic.Dispatching'},
									{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
									{typeName: 'EquipmentPlantDto', moduleSubModule: 'Resource.Equipment'},
									{typeName: 'ResourceDto', moduleSubModule: 'Resource.Master'},
									{typeName: 'SundryServiceDto', moduleSubModule: 'Logistic.SundryService'},
									{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
									{typeName: 'MaterialDocumentDto', moduleSubModule: 'Basics.Material'},
									{typeName: 'MaterialCatalogDto', moduleSubModule: 'Basics.MaterialCatalog'},
									{typeName: 'MaterialPriceListDto', moduleSubModule: 'Basics.Material'},
									{typeName: 'MaterialCharacteristicDto', moduleSubModule: 'Basics.Material'},
									{typeName: 'Material2ProjectStockVDto', moduleSubModule: 'Basics.Material'},
									{typeName: 'CostCodeDto', moduleSubModule: 'Basics.CostCodes'},
									{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
									{typeName: 'BundleDto', moduleSubModule: 'TransportPlanning.Bundle'},
									{typeName: 'JobCardDto', moduleSubModule: 'Logistic.Card'},
									{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
									{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
									{typeName: 'TrsWaypointDto', moduleSubModule: 'TransportPlanning.Transport'},
									{typeName: 'TransportPackageDto', moduleSubModule: 'TransportPlanning.Package'},
									{typeName: 'RequisitionItemVDto', moduleSubModule: 'Logistic.Dispatching'},
									{typeName: 'PesHeaderDto', moduleSubModule: 'Procurement.Pes'},
									{typeName: 'PesBoqDto', moduleSubModule: 'Procurement.Pes'},
									{typeName: 'PesItemDto', moduleSubModule: 'Procurement.Pes'},
									{ typeName: 'BoqHeaderDto', moduleSubModule: 'Boq.Main' },
									logisticJobConstantValues.schemes.plantAllocation,
									logisticDispatchingConstantValues.schemes.header2Requisition,
									logisticDispatchingConstantValues.schemes.dispatchNoteSettled,
									logisticDispatchingConstantValues.schemes.dispatchRecordLoadingInfo,
									logisticDispatchingConstantValues.schemes.dispatchNoteTotalWeight,
									logisticDispatchingConstantValues.schemes.noteDelivery
								);

								return platformSchemaService.getSchemas(schemes);
							});
						}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'logisticDispatchingConstantValues', function (basicsCompanyNumberGenerationInfoService, logisticDispatchingConstantValues) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticDispatchingHeaderNumberInfoService', logisticDispatchingConstantValues.rubricId).load();
					}],
					loadCodeGenerationInfo2: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRouteNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.TransportPlanning).load();
					}],
					loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
						return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['logistic', 'resource', 'basics', 'project', 'documents']);
					}],
					loadModuleInfo: ['basicsDependentDataModuleLookupService', function (basicsDependentDataModuleLookupService) {
						basicsDependentDataModuleLookupService.loadData();
					}]
				}
			};
			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('logisticDispatchingHeaderDataService').navigateTo(item, triggerField);
					}
				}
			);
		}]);
})(angular);
