/**
 * Created by anl on 7/20/2017.
 */


(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);


	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var wizardData = [
				{
					serviceName: 'productionplanningMountingWizardService',
					wizardGuid: '9bf94138c6fd4c34bd94c99218cfce0e',
					methodName: 'changeRequisitionStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningMountingWizardService',
					wizardGuid: '0a2bf0c4980e48b185ca5f088c618d31',
					methodName: 'changeActivityStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningMountingWizardService',
					wizardGuid: '6e369082b9f34eed9ff36d3dc9ff643a',
					methodName: 'changeReportStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningMountingWizardService',
					wizardGuid: 'fd7d2a0785c94c2ebf1b37bc6b5b9d99',
					methodName: 'changeTrsRequisitionStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningMountingWizardService',
					wizardGuid: 'f68126fa9bd948b58a8d35a4e4f4b221',
					methodName: 'enableMountingRequisition',
					canActivate: true
				},
				{
					serviceName: 'productionplanningMountingWizardService',
					wizardGuid: 'f6f0a4397efa48b283e941b7dc204afa',
					methodName: 'disableMountingRequisition',
					canActivate: true
				},
				{
					serviceName: 'productionplanningMountingWizardService',
					wizardGuid: '468d36abdc844bf8b3d4cb7a5d40c75b',
					methodName: 'enableMountingActivity',
					canActivate: true
				},
				{
					serviceName: 'productionplanningMountingWizardService',
					wizardGuid: '731e623ecedc4120801c92cdd9ad9466',
					methodName: 'disableMountingActivity',
					canActivate: true
				},
				{
					serviceName: 'productionplanningMountingWizardService',
					wizardGuid: '8a64eb9832854dbeb5e0dbd1f898f143',
					methodName: 'changeActResRequisitionStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningMountingWizardService',
					wizardGuid: '48dac913560645e1b38b89268f2e6e29',
					methodName: 'changeTrsResRequisitionStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningMountingWizardService',
					wizardGuid: 'd03c45ca02fa45d5ac97d5844bb0c985',
					methodName: 'changeActResReservationStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningMountingWizardService',
					wizardGuid: '3fa8da63bbfd49d5988f90de54177c12',
					methodName: 'changeTrsResReservationStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningMountingWizardService',
					wizardGuid: '800206dd373849c6be74e98a26b5d54c',
					methodName: 'changeBoardResReservationStatus',
					canActivate: true
				},
				{
					serviceName: 'resourceReservationSidebarWizardService',
					wizardGuid: '12f22d52a15045db9d78eb0a793aedb3',
					methodName: 'createDispatchNodesFromMounting',
					canActivate: true
				},
				{
					serviceName: 'basicsUserFormFormDataWizardService',
					wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
					methodName: 'changeFormDataStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningMountingWizardService',
					wizardGuid: '80ba0ec32ff34a54bb8f0fa4cf3f0f11',
					methodName: 'changeStatusForProjectDocument',
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
				},
				{
					serviceName: 'productionPlanningCommonWizardService',
					wizardGuid: 'ef994e6fed7644ba8ea3c34c693537eb',
					methodName: 'createLoadSequencePlan',
					canActivate: true,
					userParam:
						{
							dataServiceName: 'productionplanningMountingRequisitionDataService',
							FilterEntityName: 'InstallationRequisition',
							FilterEntityId: 'Id'
						}
				}];


			var options = {
				'moduleName': moduleName,
				'permissions': ['c9ab062b470a455b91e5aee998a44752'],
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService', 'platformModuleInitialConfigurationService', 'ppsCommonLoggingHelper',
						'transportplanningBundleTrsProjectConfigService',
						function (platformSchemaService, wizardService, platformModuleInitialConfigurationService, ppsCommonLoggingHelper,
								  trsProjectConfigService) {

							wizardService.registerWizard(wizardData);
							return platformModuleInitialConfigurationService.load('ProductionPlanning.Mounting').then(function (modData) {
								var schemes = modData.schemes;

								schemes.push({
									typeName: 'RequisitionDto',
									moduleSubModule: 'ProductionPlanning.Mounting'
								});
								schemes.push({typeName: 'ActivityDto', moduleSubModule: 'ProductionPlanning.Activity'});
								schemes.push({typeName: 'ReportDto', moduleSubModule: 'ProductionPlanning.Report'});
								schemes.push({
									typeName: 'Report2ProductDto',
									moduleSubModule: 'ProductionPlanning.Report'
								});
								schemes.push({
									typeName: 'Report2CostCodeDto',
									moduleSubModule: 'ProductionPlanning.Report'
								});
								schemes.push({
									typeName: 'TimeSheetDto',
									moduleSubModule: 'ProductionPlanning.Report'
								});

								schemes.push({typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'});
								schemes.push({typeName: 'BundleDto', moduleSubModule: 'TransportPlanning.Bundle'});
								schemes.push({
									typeName: 'RequisitionDto',
									moduleSubModule: 'TransportPlanning.Requisition'
								});
								schemes.push({
									typeName: 'TrsGoodsDto',
									moduleSubModule: 'TransportPlanning.Requisition'
								});
								schemes.push({typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'});
								schemes.push({typeName: 'ResourceDto', moduleSubModule: 'Resource.Master'});
								schemes.push({typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'});
								schemes.push({
									typeName: 'PpsDocumentDto',
									moduleSubModule: 'ProductionPlanning.Common'
								});
								schemes.push({
									typeName: 'PpsDocumentRevisionDto',
									moduleSubModule: 'ProductionPlanning.Common'
								});
								schemes.push({typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'});
								schemes.push({typeName: 'Requisition2BizPartnerDto', moduleSubModule: 'ProductionPlanning.Mounting'});
								schemes.push({typeName: 'Requisition2ContactDto', moduleSubModule: 'ProductionPlanning.Mounting'});
								schemes.push({typeName: 'Project2BusinessPartnerDto', moduleSubModule: 'Project.Main'});
								schemes.push({typeName: 'Project2BusinessPartnerContactDto', moduleSubModule: 'Project.Main'});
								schemes.push({typeName: 'CommonBizPartnerDto', moduleSubModule: 'ProductionPlanning.Common'});
								schemes.push({typeName: 'CommonBizPartnerContactDto', moduleSubModule: 'ProductionPlanning.Common'});
								schemes.push({typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'});
								schemes.push({typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'});
								schemes.push({typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'});
								schemes.push({typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'});
								schemes.push({typeName: 'TrsGoodsDto', moduleSubModule: 'TransportPlanning.Requisition'});
								schemes.push({typeName: 'ReservationDto',moduleSubModule: 'Resource.Reservation'});
								schemes.push({typeName: 'SubsidiaryDto',moduleSubModule: 'BusinessPartner.Main'});
								schemes.push({typeName: 'FormDataDto', moduleSubModule: 'Basics.UserForm'});
								schemes.push({typeName: 'PpsLogReportVDto', moduleSubModule: 'ProductionPlanning.Common'});
								schemes.push({typeName: 'PPSItemDto', moduleSubModule: 'ProductionPlanning.Item'}); // for fixing error of #135751
								schemes.push({typeName: 'ProductDescriptionDto', moduleSubModule: 'ProductionPlanning.ProductTemplate'}); // for fixing error of #135751

								trsProjectConfigService.load();
								return ppsCommonLoggingHelper.initLoggingNecessity(schemes).then(function () {
									return platformSchemaService.getSchemas(schemes);
								});
							});
						}],
					initializeUnitQuantity: ['basicsUnitQuantityProcessorFactoryService', function (basicsUnitQuantityProcessorFactoryService) {
						return basicsUnitQuantityProcessorFactoryService.initialize();
					}],
					'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName,'basics.customize','productionplanning.common','resource.master','transportplanning.bundle','productionplanning.header']);
						// remark: wiki of platformTranslateService is http://rib-s-wiki01.rib-software.com/cloud/wiki/54/angular-translation#Platform-Translation-Service
					}],
					'loadPermissions': ['platformPermissionService', function (platformPermissionService) {
						return platformPermissionService.loadPermissions('a78a23e2b050418cb19df541ab9bf028');
					}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'ppsMountingConstantValues', '$http', function (basicsCompanyNumberGenerationInfoService, ppsMountingConstantValues, $http) {
						$http.get(globals.webApiBaseUrl + 'productionplanning/common/getRubricCatId?ppsEntityId=3').then(function (response) {
							ppsMountingConstantValues.requsitionRubricCat = response.data;
						});
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsMountingNumberInfoService', ppsMountingConstantValues.mountingRubricId).load();
					}],
					// load CodeGenerationInfo of trsRequisition for Activity-TrsRequisition container
					loadCodeGenerationInfo2: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRequsitionNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.TransportPlanning).load();
					}],
					loadEventType: ['ppsCommonCodGeneratorConstantValue', function (ppsCommonCodGeneratorConstantValue) {
						return ppsCommonCodGeneratorConstantValue.loadEventType();
					}],
					loadMntRequisitionLookupItems:['basicsLookupdataLookupDescriptorService', function (basicsLookupdataLookupDescriptorService) {
						return basicsLookupdataLookupDescriptorService.loadData('MntRequisition');
					}],
					loadResourcesStatus: ['productionplanningCommonRequisitionProcessor','productionplanningCommonResReservationProcessor',
						function (productionplanningCommonRequisitionProcessor,productionplanningCommonResReservationProcessor) {
							productionplanningCommonRequisitionProcessor.loadData();
							productionplanningCommonResReservationProcessor.loadData();
						}],
				}
			};

			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', 'basicsWorkflowEventService',
		function ($injector, naviService, basicsWorkflowEventService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						var dataService = $injector.get('productionplanningMountingRequisitionDataService');
						if (angular.isDefined(item.ReqStatusFk)) {
							dataService.navigateByProject(item);
						}
						else if (triggerField === 'Ids') {
							dataService.navigateByIds(item);
						}
						else if (angular.isDefined(item.ActStatusFk)) {
							dataService.navigateByActivity(item);
						}
						else if(angular.isDefined(item.MntRequisitionFk || item.MntRequisitionId)){
							dataService.searchByCalId(item.MntRequisitionFk || item.MntRequisitionId);
						}
					}
				}
			);

			//register workflow events
			basicsWorkflowEventService.registerEvent('1ff41b5d62e4447cbda820572863629a', 'Change Mounting Activity');
			basicsWorkflowEventService.registerEvent('2bb9b9a632c14936babb2edef83fc3ba', 'Delete Mounting Activity');
			basicsWorkflowEventService.registerEvent('6f9eb9a6edc1yh36bv7h9ldhfq3586va', 'Mounting Requisition Changed');
		}]);
})(angular);
