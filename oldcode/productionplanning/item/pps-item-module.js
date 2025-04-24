/**
 * Created by anl on 5/3/2017.
 */


(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);


	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var wizardData = [{
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: '0247d02a88d244c186636726d7e6106b',
				methodName: 'disableItem',
				canActivate: true
			}, {
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: '18fbf93276074426b1d613284329dedb',
				methodName: 'enableItem',
				canActivate: true
			}, {
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: 'b441e44b1c7d4f8e902b14bbc376a186',
				methodName: 'changeItemStatus',
				canActivate: true
			}, {
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: '498e8bcb27a341749d63a0438392530a',
				methodName: 'deleteCompleteItem',
				canActivate: true
			}, {
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: '0bd0c22574f841b4a907de00e5af3f46',
				methodName: 'changeProductStatus',
				canActivate: true
			}, {
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: 'c66ed7f2a484423fa9532ce33d61b324',
				methodName: 'enableProduct',
				canActivate: true
			}, {
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: '6c5ae92a6ec74435857d41d2409fcdb9',
				methodName: 'disableProduct',
				canActivate: true
			}, {
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: 'eeb7c253fc3f46279c080d3f972a7035',
				methodName: 'reuseProductFromStock',
				canActivate: true
			},{
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: 'e4c1bc1d9f8740b6947f0fb7b76fae2f',
				methodName: 'splitItem',
				canActivate: true
			}, {
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: '0c4b7b5dd90a427da0deea7e1b9d3203',
				methodName: 'reproduction',
				canActivate: true
			}, {
				serviceName: 'productionPlanningCommonWizardService',
				wizardGuid: 'ef994e6fed7644ba8ea3c34c693537eb',
				methodName: 'createLoadSequencePlan',
				canActivate: true,
				userParam:
					{
						dataServiceName: 'productionplanningItemDataService',
						FilterEntityName: 'Drawing',
						FilterEntityId: 'EngDrawingDefFk'
					}
			},{
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: 'e6a1c90a7a1a41caa860f8961c05f11f',
				methodName: 'multiShift',
				canActivate: true
			}, {
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: 'c22cfa17a4c34d3680e22f6554dd1fb2',
				methodName: 'copyItem',
				canActivate: true
			},{
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: '00cc27f34b34483d95d2ee9b033f4f33',
				methodName: 'mergeItem',
				canActivate: true
			},{
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: 'b743adc180de446aa0d935bc3507291b',
				methodName: 'groupItem',
				canActivate: true
			},{
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: '890c2e234020490cacf1678921f75e09',
				methodName: 'createUpstreamPackages',
				canActivate: true
			},{
				serviceName: 'basicsUserFormFormDataWizardService',
				wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
				methodName: 'changeFormDataStatus',
				canActivate: true
			},
			{
				serviceName: 'basicsUserFormFormDataWizardService',
				wizardGuid: '7b0fb8993f56434f99368ec9875ee4fd',
				methodName: 'changeFormDataStatus',
				canActivate: true
			},
			{
				serviceName: 'productionplanningItemWizardService',
				// serviceName: 'ppsItemUserFormFormDataWizardService',
				wizardGuid: '2d1bababfa40410ca725cb16c4d77304',
				// methodName: 'changeFormDataStatus',
				methodName: 'changeUpStreamFormDataStatus',
				canActivate: true
			},
			{
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: '9065e7dd71ab49eba2b6adc4f4001724',
				methodName: 'changeUpstreamStatus',
				canActivate: true
			},
			{
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: '1a7923ae9b7b4ec3b6421e3255741e72',
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
			},{
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: '9c5ea184fa8f4d839dfc994bec8fbf86',
				methodName: 'doActualTimeRecording',
				canActivate: true
			},{
				serviceName: 'productionplanningItemWizardService',
				wizardGuid: '5423e4e68f93454ab389a062dc0c4b9b',
				methodName: 'doBillingDataProductAndMaterialSelection',
				canActivate: true
			},{
					serviceName: 'productionplanningItemWizardService',
					wizardGuid: '61bf8fdf779b4406a61ddb0b91120acf',
					methodName: 'enableComponent',
					canActivate: true
				},{
					serviceName: 'productionplanningItemWizardService',
					wizardGuid: 'cbf7e9c1569f4dfabfcc5845f0d03f13',
					methodName: 'disableComponent',
					canActivate: true
				}
			];

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService', 'productionplanningCommonProductStatusLookupService', 'ppsCommonLoggingHelper', '$q', '$injector',
						function (platformSchemaService, wizardService, productStatusLookupService, ppsCommonLoggingHelper, $q, $injector) { // jshint ignore:line

							wizardService.registerWizard(wizardData);

							var schemes = [
								{typeName: 'PPSItemDto', moduleSubModule: 'ProductionPlanning.Item'},
								{typeName: 'PPSItemEventDto', moduleSubModule: 'ProductionPlanning.Item'},
								{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'HeaderDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'TransportPackageDto', moduleSubModule: 'TransportPlanning.Package'},
								{typeName: 'PpsDocumentDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'PpsDocumentRevisionDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'BundleDto', moduleSubModule: 'TransportPlanning.Bundle'},
								{typeName: 'PPSItem2ClerkDto', moduleSubModule: 'ProductionPlanning.Item'},
								{typeName: 'EngTask2ClerkDto', moduleSubModule: 'ProductionPlanning.Engineering'},
								{typeName: 'Project2BusinessPartnerDto', moduleSubModule: 'Project.Main'},
								{typeName: 'Project2BusinessPartnerContactDto', moduleSubModule: 'Project.Main'},
								{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
								{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
								{typeName: 'ProductDescParamDto', moduleSubModule: 'ProductionPlanning.ProductTemplate'},
								{typeName: 'ReassignedDto', moduleSubModule: 'ProductionPlanning.Item'},
								{typeName: 'LocationDto', moduleSubModule: 'Project.Location'},
								{typeName: 'CostGroupCatDto', moduleSubModule: 'Basics.CostGroups'},
								{typeName: 'SiteDto', moduleSubModule: 'Basics.Site'},
								{typeName: 'EngTaskDto', moduleSubModule: 'ProductionPlanning.Engineering'},
								{typeName: 'EngDrawingDto', moduleSubModule: 'ProductionPlanning.Drawing'},
								{typeName: 'PpsUpstreamItemDto', moduleSubModule: 'ProductionPlanning.Item'},
								{typeName: 'PpsItem2MdcMaterialDto', moduleSubModule: 'ProductionPlanning.Item'},
								{typeName: 'MdcProductDescriptionDto', moduleSubModule: 'ProductionPlanning.PpsMaterial'},
								{typeName: 'MdcProductDescParamDto', moduleSubModule: 'ProductionPlanning.PpsMaterial'},
								{typeName: 'PpsLogReportVDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'ClerkDto', moduleSubModule: 'Basics.Clerk'},
								{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
								{typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'},
								{typeName: 'DocumentDto', moduleSubModule: 'ProductionPlanning.Item'},
								{typeName: 'ProductDescriptionDto', moduleSubModule: 'ProductionPlanning.ProductTemplate'},
								{typeName: 'PpsItemSourceDto', moduleSubModule: 'ProductionPlanning.Item'},
								{typeName: 'TrsGoodsDto', moduleSubModule: 'TransportPlanning.Requisition'},
								{typeName: 'RequisitionDto', moduleSubModule: 'TransportPlanning.Requisition'},
								{typeName: 'Header2BpDto', moduleSubModule: 'ProductionPlanning.Header'},
								{typeName: 'Header2ContactDto', moduleSubModule: 'ProductionPlanning.Header'},
								{typeName: 'CommonBizPartnerDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'CommonBizPartnerContactDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'},
								{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'PpsItemTransportableDto', moduleSubModule: 'ProductionPlanning.Item'},
								{typeName: 'TrsRouteDto', moduleSubModule: 'TransportPlanning.Transport'},
								{typeName: 'FormDataDto', moduleSubModule: 'Basics.UserForm'},
								{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
								{typeName: 'PpsDailyProductionVDto', moduleSubModule: 'ProductionPlanning.ProductionSet'},
								{typeName: 'PpsProductionOverviewVDto', moduleSubModule: 'ProductionPlanning.Item'},
								{typeName: 'PpsParameterDto', moduleSubModule: 'ProductionPlanning.FormulaConfiguration'},
								{typeName: 'EngDrawingComponentDto', moduleSubModule: 'ProductionPlanning.Drawing'},
								{typeName: 'MdcDrawingComponentDto', moduleSubModule: 'ProductionPlanning.PpsMaterial'},
								{typeName: 'PpsPlannedQuantityDto', moduleSubModule: 'ProductionPlanning.FormulaConfiguration'},
								{typeName: 'PpsActualTimeReportVDto', moduleSubModule: 'ProductionPlanning.Item'},
								{typeName: 'PpsActualTimeRecordingProductAssignmentDto', moduleSubModule: 'ProductionPlanning.Item'},
								{typeName: 'PpsActualTimeRecordingPhaseReq2TimeSymbolVDto', moduleSubModule: 'ProductionPlanning.Item'},
								{typeName: 'EngStackDto', moduleSubModule: 'ProductionPlanning.Drawing'},
								{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
							];
							return $q.all([ppsCommonLoggingHelper.initLoggingNecessity(schemes), platformSchemaService.getSchemas(schemes)]).then(function (responses) {
								return responses[1];
							});
						}],
					'loadTranslation': ['platformTranslateService','basicsMaterialTranslationService', function (platformTranslateService,basicsMaterialTranslationService) {
						basicsMaterialTranslationService.loadTranslations();
						return platformTranslateService.registerModule([moduleName, 'basics.customize', 'transportplanning.bundle', 'productionplanning.common','productionplanning.header', 'productionplanning.drawing']);
						// fix warnings like 'Identifier "basics.customize.licCostGroup1Fk" was not translated (for additional lookup column)' in Console of brower
						// remark: wiki of platformTranslateService is http://rib-s-wiki01.rib-software.com/cloud/wiki/54/angular-translation#Platform-Translation-Service
					}],
					'loadItemCustomColumns': ['ppsCommonCustomColumnsServiceFactory', 'productionplanningItemTranslationService', function (customColumnsServiceFactory, translationServ) {
						var customColumnsService = customColumnsServiceFactory.getService(moduleName);
						return customColumnsService.init('productionplanning/item/customcolumn').then(function () {
							// reload translation data when navigating to current module from other module like engineering module as gantt chart
							translationServ.setTranslationForCustomColumns();
						});
					}],
					'loadCommonCustomColumns': ['ppsCommonCustomColumnsServiceFactory', 'productionplanningCommonTranslationService', function (customColumnsServiceFactory, translationServ) {
						return customColumnsServiceFactory.initCommonCustomColumnsService().then(function () {
							// for fixing error of failure of translating customColumns when navigating to current module from other module(such as Project module),
							// here we need to do customColumns translation in callback function. (by zwz 2019/12/9)
							translationServ.setTranslationForCustomColumns();
						});
					}],
					loadEventType: ['ppsCommonCodGeneratorConstantValue', function (ppsCommonCodGeneratorConstantValue) {
						return ppsCommonCodGeneratorConstantValue.loadEventType(); // eventType is indirectly referenced by ppsCommonCodGeneratorConstantValue.getCategoryFkviaEventType()
					}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'projectMainConstantValues', function (basicsCompanyNumberGenerationInfoService, projectMainConstantValues) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('projectLocationNumberInfoService', projectMainConstantValues.values.locationRubricId).load();
					}],
					loadCodeGenerationInfo2: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRouteNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.TransportPlanning).load();
					}],
					loadCodeGenerationInfoOfBundle: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', '$http', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue, $http) {
						const ppsEntityId = ppsCommonCodGeneratorConstantValue.PpsEntityConstant.TransportBundle;
						$http.get(globals.webApiBaseUrl + 'productionplanning/common/getRubricCatId?ppsEntityId=' + ppsEntityId).then(function (response) {
							ppsCommonCodGeneratorConstantValue.CategoryConstant.TrsBundleCat = response.data;
						});
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsBundleNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.TransportPlanning).load();
					}],
					'loadPermissions': ['platformPermissionService', 'ppsCommonLoggingConstant', function (platformPermissionService, ppsCommonLoggingConstant) {
						let descriptors = [ppsCommonLoggingConstant.AccessGuidModifyLogRemark, // Modify log remark
							'57f6b42b88cf4748afb725d1db824289', // Pick Components
							'18edd6dbed9941ce99f0b60171be75ed' //new record in components
						];
						return platformPermissionService.loadPermissions(descriptors);
					}],
					'loadUom': [ 'basicsUnitLookupDataService',
						function (basicsUnitLookupDataService) {
							basicsUnitLookupDataService.getListSync({lookupType: 'basicsUnitLookupDataService'});
						}
					],
					// preload productionplace site filter data, for supporting productionplace-goto functionality on PU/SubPU list container(by zweig on 2024/3/11 for JIRA ticket DEV-9301)
					'loadProductionPlaceSiteFilterData': [ 'ppsProductionplaceSiteFilterDataService',
						function (ppsProductionplaceSiteFilterDataService) {
							ppsProductionplaceSiteFilterDataService.load();
						}
					],
					'loadLookup': ['basicsLookupdataLookupDescriptorService','basicsLookupdataLookupDefinitionService',
						function(basicsLookupdataLookupDescriptorService,basicsLookupdataLookupDefinitionService){
							basicsLookupdataLookupDescriptorService.loadData(['MDCProductDescriptionTiny',
								'SiteType' // preload SiteType lookup for site filter container of PU module (#140039)
							]);
							basicsLookupdataLookupDefinitionService.load([
								'basicsDependentDataDomainCombobox'
							]);
						}],
					// 'initializeUnitQuantity': ['basicsUnitQuantityProcessorFactoryService', function (basicsUnitQuantityProcessorFactoryService) {
					// 	return basicsUnitQuantityProcessorFactoryService.initialize();
					// }]
				}
			};
			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', 'cloudDesktopSidebarService',
		function ($injector, naviService, cloudDesktopSidebarService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {

						var service = $injector.get('productionplanningItemDataService');

						if (_.isUndefined(triggerField)) {
							if (!_.isNil(item.JobDefFk)) {
								if(!_.isNil(item.ItemFks)){
									service.itemFksFromNavForPuByJobContainer = item.ItemFks;
									service.itemFksFromNavForTreePuByJobContainer = item.ItemFks;
									service.itemFksFromNavForPuContainer = item.ItemFks;
								}
								service.navigateByJob(item.JobDefFk);
							} else if (!_.isNil(item.ReqStatusFk) && !_.isNil(item.LgmJobFk)) {
								service.navigateByJob(item.LgmJobFk);
							}
						} else if (['Code', 'HeaderFk', 'PpsHeaderFk', 'EngDrawingFk', 'Ids'].includes(triggerField)) {
							service.loadItemsByNavi(item, triggerField);
						} else if (['ItemFk', 'PPSItemFk', 'PpsItemFk', 'PpsItemStockFk', 'PpsUpstreamItemFk'].includes(triggerField)) {// from eng-task or eng-drawing to ppsitem
							service.setFilter(item[triggerField]);// set the filter
							service.selectItemByID(item[triggerField], function () {
								service.setFilter();// clear the filter
							});
						} else if (triggerField === 'LgmJobFk') {
							if(!_.isNil(item.ItemFks)){
								// itemFksFromNavForPuByJobContainer and itemFksFromNavForTreePuByJobContainer use for
								// preselecting PUs on Production Units By Job container and Production Units Structure By Job
								service.itemFksFromNavForPuByJobContainer = item.ItemFks;
								service.itemFksFromNavForTreePuByJobContainer = item.ItemFks;
								service.itemFksFromNavForPuContainer = item.ItemFks;
							}
							service.navigateByJob(item[triggerField]);

						} else if(triggerField === 'PuInfo.Codes'){
							var ids = item.PuInfo.Ids;
							if (ids && ids.length > 0) {
								service.setFilter();// clear the filter
								var fRequest = cloudDesktopSidebarService.getFilterRequestParams();
								fRequest.includeNonActiveItems = true;
								fRequest.PKeys = ids;
								fRequest.ProjectContextId = null;
								fRequest.PinningContext = null;
								fRequest.furtherFilters = null;
								fRequest.UseCurrentClient = false;
								cloudDesktopSidebarService.onExecuteSearchFilter.fire(null, fRequest);
							}
						}
					}
				}
			);
		}]);

	angular.module(moduleName).value('ppsItemConstantValues', {
		values: {
			UnassignedTypeId: -1,
			LockedTypeId: 1,
			NestedTypeId: 2
		}
	});
})(angular);
