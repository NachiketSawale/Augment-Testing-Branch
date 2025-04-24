(function (angular) {

	'use strict';
	/* global globals, _, angular */
	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var wizardData = [{
				serviceName: 'transportplanningRequisitionWizardService',
				wizardGuid: 'ad207c65bb014fda816d00baecb80fb4',
				methodName: 'changeRequisitionStatus',
				canActivate: true
			}, {
				serviceName: 'transportplanningRequisitionWizardService',
				wizardGuid: 'bf64822b8a8d422bb9348c930f05f9b5',
				methodName: 'enableRequisition',
				canActivate: true
			}, {
				serviceName: 'transportplanningRequisitionWizardService',
				wizardGuid: 'eccc3f084c864b909400fd0b9523b0be',
				methodName: 'disableRequisition',
				canActivate: true
			}, {
				serviceName: 'transportplanningRequisitionWizardService',
				wizardGuid: '8b40e876078f4bf1a1135276922f1ead',
				methodName: 'changeTrsResRequisitionStatus',
				canActivate: true
			}, {
				serviceName: 'transportplanningRequisitionWizardService',
				wizardGuid: '00a1f687d31342ad9582d70ca9847e84',
				methodName: 'changeTrsResReservationStatus',
				canActivate: true
			}, {
				serviceName: 'transportplanningRequisitionWizardService',
				wizardGuid: 'c2878edd5e70466eB99edce75d649363',
				methodName: 'createTransportRouteFromTrsReq',
				canActivate: true
			}, {
				serviceName: 'transportplanningRequisitionWizardService',
				wizardGuid: 'ff1b2654a5ef49a2a3885e61a6caccc2',
				methodName: 'synchronizeTransportRequisition',
				canActivate: true
			}, {
				serviceName: 'transportplanningRequisitionWizardService',
				wizardGuid: '256a69f2995543c3b0225f3ff994142e',
				methodName: 'createReturnRequisition',
				canActivate: true
			}, {
				serviceName: 'transportplanningRequisitionWizardService',
				wizardGuid: '826dbdf0b0e54866ad637c2e07d9f00d',
				methodName: 'createReturnPlantRequisition',
				canActivate: true
			}];


			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService', 'platformModuleInitialConfigurationService',
						'ppsCommonLoggingHelper',
						function (platformSchemaService, basicsConfigWizardSidebarService, platformModuleInitialConfigurationService,
								  ppsCommonLoggingHelper) {

							basicsConfigWizardSidebarService.registerWizard(wizardData);

							return platformModuleInitialConfigurationService.load('Transportplanning.Requisition').then(function (modData) {

								var schemes = [
									{typeName: 'RequisitionDto', moduleSubModule: 'TransportPlanning.Requisition'},
									{typeName: 'BundleDto', moduleSubModule: 'TransportPlanning.Bundle'},
									{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
									{typeName: 'PpsDocumentDto', moduleSubModule: 'ProductionPlanning.Common'},
									{typeName: 'PpsDocumentRevisionDto', moduleSubModule: 'ProductionPlanning.Common'},
									{typeName: 'PPSItemDto', moduleSubModule: 'ProductionPlanning.Item'},
									{typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'},
									{typeName: 'SiteDto', moduleSubModule: 'Basics.Site'},
									{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
									{typeName: 'ActivityDto', moduleSubModule: 'ProductionPlanning.Activity'},
									{typeName: 'PpsLogReportVDto', moduleSubModule: 'ProductionPlanning.Common'},
									{typeName: 'TrsGoodsDto', moduleSubModule: 'TransportPlanning.Requisition'},
									{typeName: 'Requisition2ClerkDto', moduleSubModule: 'TransportPlanning.Requisition'},
									{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
									{typeName: 'ProductDescriptionDto', moduleSubModule: 'ProductionPlanning.ProductTemplate'}, // for fixing error of #135751
									{typeName: 'NotificationDto', moduleSubModule: 'Basics.Common'},
									{typeName: 'PpsUpstreamItemDto', moduleSubModule: 'ProductionPlanning.Item'},
									{typeName: 'CommonBizPartnerDto', moduleSubModule: 'ProductionPlanning.Common'},
									{typeName: 'Project2BusinessPartnerDto', moduleSubModule: 'Project.Main'},
									{typeName: 'CommonBizPartnerContactDto', moduleSubModule: 'ProductionPlanning.Common'},
									{typeName: 'ToBeAssignedDto', moduleSubModule: 'TransportPlanning.Bundle'},
									{typeName: 'EngDrawingDto', moduleSubModule: 'ProductionPlanning.Drawing'},
									{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
								];
								schemes = modData.schemes.concat(schemes);
								return ppsCommonLoggingHelper.initLoggingNecessity(schemes).then(function () {
									return platformSchemaService.getSchemas(schemes);
								});
							});
						}],
					'loadTrsReqStatus': ['$http', 'basicsLookupdataLookupDescriptorService', '$q', 'basicsLookupdataSimpleLookupService',
						function ($http, basicsLookupdataLookupDescriptorService, $q, basicsLookupdataSimpleLookupService) {
							var promises = [];
							promises.push($http.post(globals.webApiBaseUrl + 'basics/customize/transportrequisitionstatus/list'));
							promises.push(basicsLookupdataSimpleLookupService.getList({
								lookupModuleQualifier: 'basics.customize.transportrequisitionstatus',
								displayMember: 'Description',
								valueMember: 'Id'
							}));
							return $q.all(promises).then(function (responses) {
								var orgStatus = _.sortBy(responses[0].data, 'Id');
								var lookupStatus = _.sortBy(responses[1], 'Id');
								var combinedStatus = angular.merge(orgStatus, lookupStatus);
								basicsLookupdataLookupDescriptorService.updateData('basics.customize.transportrequisitionstatus', combinedStatus);
								basicsLookupdataLookupDescriptorService.updateData('TrsRequisitionStatus', combinedStatus);
							});
						}],
					'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'productionplanning.common', 'project.costcodes', 'productionplanning.item']);
					}],
					'loadCustomColumns': ['ppsCommonCustomColumnsServiceFactory', 'transportplanningRequisitionTranslationService', function (customColumnsServiceFactory, translationService) {
						var customColumnsService = customColumnsServiceFactory.getService(moduleName);
						return customColumnsService.init('transportplanning/requisition/customcolumn').then(function () {
							translationService.setTranslationForCustomColumns();
						});
					}],
					'loadBundleCustomColumns': ['ppsCommonCustomColumnsServiceFactory', function (customColumnsServiceFactory) {
						var customBundleColumnsService = customColumnsServiceFactory.getService('transportplanning.bundle');
						return customBundleColumnsService.init('transportplanning/bundle/bundle/customcolumn');
					}],
					loadEventType: ['ppsCommonCodGeneratorConstantValue', function (ppsCommonCodGeneratorConstantValue) {
						return ppsCommonCodGeneratorConstantValue.loadEventType(); // eventType is indirectly referenced by ppsCommonCodGeneratorConstantValue.getCategoryFkviaEventType() in processItem() of transportplanningRequisitionDataProcessorService
					}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRequsitionNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.TransportPlanning).load();
					}],
					loadCodeGenerationInfo2: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRouteNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.TransportPlanning).load();
					}],
					loadResourcesStatus: ['productionplanningCommonRequisitionProcessor','productionplanningCommonResReservationProcessor',
						function (productionplanningCommonRequisitionProcessor,productionplanningCommonResReservationProcessor) {
							productionplanningCommonRequisitionProcessor.loadData();
							productionplanningCommonResReservationProcessor.loadData();
						}],
					loadStatus: ['productionplanningUpStreamStatusLookupService','productionplanningCommonProductStatusLookupService',
						function (productionplanningUpStreamStatusLookupService,productionplanningCommonProductStatusLookupService) {
							productionplanningUpStreamStatusLookupService.load();
							productionplanningCommonProductStatusLookupService.load();
						}],
					loadTrsPrjConfig:['transportplanningBundleTrsProjectConfigService',
						function (trsProjectConfigService) {
							return trsProjectConfigService.load();
						}
					]
				}
			};
			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', 'basicsWorkflowEventService', 'cloudDesktopSidebarService',
		function ($injector, naviService, basicsWorkflowEventService, cloudDesktopSidebarService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						if (triggerField === 'TrsRequisitionFk') {
							$injector.get('transportplanningRequisitionMainService').searchItem(item.TrsRequisitionFk);
						} else if (triggerField === 'Code') {
							$injector.get('transportplanningRequisitionMainService').navigateByCode(item);
						} else if (triggerField === 'TrsProductBundleFk') {
							var bundle = $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('TrsBundleLookup', item.TrsProductBundleFk);
							$injector.get('transportplanningRequisitionMainService').searchItem(bundle.TrsRequisitionFk);
						} else if (triggerField === 'MountingAcitivity') {
							$injector.get('transportplanningRequisitionMainService').searchItemByActivity(item);
							$injector.get('basicsLookupdataLookupDescriptorService').updateData('MntActivity', [item]);
						} else if (triggerField === 'Ids' && item.FromGoToBtn && _.isString(item.Ids)) {
							const ids = item.Ids.split(',');
							cloudDesktopSidebarService.filterSearchFromPKeys(ids);
						} else if(triggerField === 'RequisitionsInfo.Ids' || triggerField === 'RequisitionsInfo.Codes'){
							 var requisitionIds = item.RequisitionsInfo.Ids;
							cloudDesktopSidebarService.filterSearchFromPKeys(requisitionIds);
						}
					}
				}
			);

			//register workflow events
			basicsWorkflowEventService.registerEvent('1d9aa60b77914759a4a0e27bcd82e5c6', 'Change Transport Requisition');
			basicsWorkflowEventService.registerEvent('25c8c725d75f490eb0992732afccc245', 'Delete Transport Requisition');


		}])
		.constant('ItemTypes', {
			Product: 1,
			Bundle: 2,
			Resource: 3,
			ResourceReservation: 4,
			Material: 5,
			MaterialRequisition: 6,
			Route: 7,
			Plant: 8,
			properties: {
				3: {
					directive: 'resource-master-resource-lookup-dialog-new',
					lookupType: 'ResourceMasterResource',
					displayMember: 'Code',
					descriptionPropertyName: 'DescriptionInfo.Translated',
					version: 3
				},
				6: {
					directive: 'basics-material-material-lookup',
					lookupType: 'MaterialCommodity',
					displayMember: 'Code',
					descriptionPropertyName: 'DescriptionInfo.Translated'
				}
			}
		});
})(angular);
