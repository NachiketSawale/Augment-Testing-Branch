/**
 * Created by anl on 2/2/2018.
 */

(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);


	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var wizardData = [
				{
					serviceName: 'productionplanningActivityWizardService',
					wizardGuid: '9ed5ebb452a74ce2902f068941d1e946',
					methodName: 'changeActivityStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningActivityWizardService',
					wizardGuid: 'e9b208a0275f49c991986c38c9c20b51',
					methodName: 'changeReportStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningActivityWizardService',
					wizardGuid: '5e577cf4cc8145368e4ab0abaff154ac',
					methodName: 'changeTrsRequisitionStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningActivityWizardService',
					wizardGuid: 'b21c3d58890f4c8baca8172d3a3cd684',
					methodName: 'enableMountingActivity',
					canActivate: true
				},
				{
					serviceName: 'productionplanningActivityWizardService',
					wizardGuid: '63de717a10bd44f98400f91875b68bc8',
					methodName: 'disableMountingActivity',
					canActivate: true
				},
				{
					serviceName: 'productionplanningActivityWizardService',
					wizardGuid: 'be7fcaad7f954353a9b7daff4559cabf',
					methodName: 'changeActResRequisitionStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningActivityWizardService',
					wizardGuid: '417ec9fc8ca445dfa5690e0330770fb6',
					methodName: 'changeTrsResRequisitionStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningActivityWizardService',
					wizardGuid: '0e9c506a79364e7bbcbb25a69bdd5d2e',
					methodName: 'changeActResReservationStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningActivityWizardService',
					wizardGuid: '35f1b03c5ec4414cb99b857bd0ee2407',
					methodName: 'changeTrsResReservationStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningActivityWizardService',
					wizardGuid: '49df633e97a2429e826606703667068c',
					methodName: 'changeBoardResReservationStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningActivityWizardService',
					wizardGuid: 'a1c8c3367cdb46478d3183ac430dffe3',
					methodName: 'synchronizeActivityPlanningInfo',
					canActivate: true
				},
				{
					serviceName: 'resourceReservationSidebarWizardService',
					wizardGuid: '12f22d52a15045db9d78eb0a793aedb3',
					methodName: 'createDispatchNodesFromActivity',
					canActivate: true
				}];


			var options = {
				'moduleName': moduleName,
				'permissions': ['c9ab062b470a455b91e5aee998a44752'],
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService', 'platformModuleInitialConfigurationService',
						'transportplanningBundleTrsProjectConfigService',
						function (platformSchemaService, wizardService, platformModuleInitialConfigurationService,
								 trsProjectConfigService) {
							wizardService.registerWizard(wizardData);
							return platformModuleInitialConfigurationService.load('ProductionPlanning.Activity').then(function (modData) {
								var schemes = modData.schemes;

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
								schemes.push({
									typeName: 'PPSItemDto', moduleSubModule: 'ProductionPlanning.Item'
								});
								schemes.push({
									typeName: 'LocationDto', moduleSubModule: 'Project.Location'
								});
								schemes.push({
									typeName: 'ActivityDto', moduleSubModule: 'Scheduling.Main'
								});
								schemes.push({typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'});
								schemes.push({typeName: 'CostGroupCatDto', moduleSubModule: 'Basics.CostGroups'});
								schemes.push({typeName: 'TrsGoodsDto', moduleSubModule: 'TransportPlanning.Requisition'});
								schemes.push({typeName: 'ReservationDto',moduleSubModule: 'Resource.Reservation'});
								schemes.push({typeName: 'ProductDescriptionDto', moduleSubModule: 'ProductionPlanning.ProductTemplate'}); // for fixing error of #135751
								schemes.push({typeName: 'EngDrawingDto', moduleSubModule: 'ProductionPlanning.Drawing'});

								trsProjectConfigService.load();
								return platformSchemaService.getSchemas(schemes);
							});
						}],
					'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'resource.master', 'productionplanning.common']);
						// remark: wiki of platformTranslateService is http://rib-s-wiki01.rib-software.com/cloud/wiki/54/angular-translation#Platform-Translation-Service
					}],
					initializeUnitQuantity: ['basicsUnitQuantityProcessorFactoryService', function (basicsUnitQuantityProcessorFactoryService) {
						return basicsUnitQuantityProcessorFactoryService.initialize();
					}],
					'loadCommonCustomColumns': ['ppsCommonCustomColumnsServiceFactory', 'productionplanningCommonTranslationService', function (customColumnsServiceFactory, translationServ) {
						return customColumnsServiceFactory.initCommonCustomColumnsService().then(function () {
							translationServ.setTranslationForCustomColumns();
						});
					}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', '$http', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue, $http) {
						var entityId = ppsCommonCodGeneratorConstantValue.PpsEntityConstant.MountingActivity;
						$http.get(globals.webApiBaseUrl + 'productionplanning/common/getRubricCatId?ppsEntityId='+ entityId).then(function (response) {
							ppsCommonCodGeneratorConstantValue.CategoryConstant.MountingActivityCat = response.data;
						});
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsMntActivitySetNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.Mounting).load();
					}],
					// load CodeGenerationInfo of trsRequisition for Activity-TrsRequisition container
					loadCodeGenerationInfo2: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRequsitionNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.TransportPlanning).load();
					}],
					loadEventType: ['ppsCommonCodGeneratorConstantValue', function (ppsCommonCodGeneratorConstantValue) {
						return ppsCommonCodGeneratorConstantValue.loadEventType();
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
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint({
					moduleName: moduleName,
					navFunc: function (item) {
						var dataService = $injector.get('productionplanningActivityActivityDataService');
						if (angular.isDefined(item.ActStatusFk)) {
							dataService.navigateByActivity(item);
						} else if (angular.isDefined(item.MntActivityFk)) {
							dataService.navigateByActivityId(item.MntActivityFk);
						} else if (angular.isDefined(item.ReqStatusFk)) {
							dataService.navigateByMntRequisition(item);
						} else if (angular.isDefined(item.RepStatusFk)) {
							dataService.navigateByReport(item);
						}
					}
				}
			);
		}]);
})(angular);