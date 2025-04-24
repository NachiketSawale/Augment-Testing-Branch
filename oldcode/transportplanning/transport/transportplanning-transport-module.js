(function (angular) {
	/* global angular, globals, _ */
	'use strict';

	/*
	 ** transportplanning.transport module is created.
	 */
	var moduleName = 'transportplanning.transport';

	var moduleSubModule = 'TransportPlanning.Transport';
	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var wizardData = [{
				serviceName: 'transportplanningTransportRouteWizardService',
				wizardGuid: 'c04e35be0bf14aa09d9e2b8e752788ef',
				methodName: 'enableRoute',
				canActivate: true
			}, {
				serviceName: 'transportplanningTransportRouteWizardService',
				wizardGuid: 'ac21dab1289d48eebbd23243b1ee0b10',
				methodName: 'disableRoute',
				canActivate: true
			}, {
				serviceName: 'transportplanningTransportRouteWizardService',
				wizardGuid: '5b0de6340a784d678cf131c1f7473d5e',
				methodName: 'changeTransportRouteStatus',
				canActivate: true
			}, {
				serviceName: 'transportplanningTransportRouteWizardService',
				wizardGuid: '8d859e360db3448bb7d7a68f68696196',
				methodName: 'changeResRequisitionStatus',
				canActivate: true
			}, {
				serviceName: 'transportplanningTransportRouteWizardService',
				wizardGuid: 'c1d8bb1ff42241c3bb8c21bbcfec4447',
				methodName: 'changeResRequisitionStatus_SourceContainer',
				canActivate: true
			}, {
				serviceName: 'transportplanningTransportRouteWizardService',
				wizardGuid: '03f1c8f62d724cb182ab21987d0b8de7',
				methodName: 'changeResReservationStatus',
				canActivate: true
			}, {
				serviceName: 'transportplanningTransportRouteWizardService',
				wizardGuid: '0faf386c8035404db2bcbeebc9171bf7',
				methodName: 'createDispatchingNote',
				canActivate: true
			}, {
				serviceName: 'transportplanningTransportRouteWizardService',
				wizardGuid: '1ce23bdf556541fb9d4d7bc146d78eb9',
				methodName: 'createTransportRoute',
				canActivate: true
			}, {
				serviceName: 'transportplanningTransportRouteWizardService',
				wizardGuid: 'a769ae62e84e411fa10efdfca579c309',
				methodName: 'addGoods2TransportRoute',
				canActivate: true
			}, {
				serviceName: 'transportplanningTransportRouteWizardService',
				wizardGuid: '84c22834f2e84002a40cfb2f49d4185f',
				methodName: 'createReturnResources',
				canActivate: true
			}, {
				serviceName: 'transportplanningTransportRouteWizardService',
				wizardGuid: '4b86f6f4a1614988808c2a86127d194f',
				methodName: 'createDispatching4Crane',
				canActivate: true
			}, {
				serviceName: 'transportplanningTransportRouteWizardService',
				wizardGuid: '3971f82b4a6b465bb8b2d8cebdeb58a4',
				methodName: 'shiftTransportTime',
				canActivate: true
			}, {
				serviceName: 'transportplanningTransportRouteWizardService',
				wizardGuid: '90c22871s2d84682atsdfb2f49fe1770',
				methodName: 'handleUnplannedReturnResources',
				canActivate: true
			}, {
				serviceName: 'resourceReservationSidebarWizardService',
				wizardGuid: '12f22d52a15045db9d78eb0a793aedb3',
				methodName: 'createDispatchNodesFromTransport',
				canActivate: true
			}, {
				serviceName: 'transportplanningTransportRouteWizardService',
				wizardGuid: 'sdfcc67650yt465e7753aa205267877a',
				methodName: 'createReturnPlants',
				canActivate: true
			}, {
				serviceName: 'transportplanningTransportRouteWizardService',
				wizardGuid: 'f7da540b466443df98c17e1c26f26d84',
				methodName: 'changeStatusForProjectDocument',
				canActivate: true
			}, {
				serviceName: 'documentsCentralQueryWizardService',
				wizardGuid: '09e2088390c740e1ab8da6c98cf61fcc',
				methodName: 'changeRubricCategory',
				canActivate: true,
				userParam: {
					'moduleName': moduleName
				}
			}];

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService', 'ppsCommonLoggingHelper', 'transportplanningBundleTrsProjectConfigService',
						function (platformSchemaService, basicsConfigWizardSidebarService, ppsCommonLoggingHelper, trsProjectConfigService) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							var schemas = [
								{typeName: 'TrsRouteDto', moduleSubModule: moduleSubModule},
								{typeName: 'TrsWaypointDto', moduleSubModule: moduleSubModule},
								{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'TransportPackageDto', moduleSubModule: 'TransportPlanning.Package'},
								{typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'},
								{typeName: 'ReservationDto', moduleSubModule: 'Resource.Reservation'},
								{typeName: 'SiteDto', moduleSubModule: 'Basics.Site'},
								{typeName: 'PpsDocumentDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'PpsDocumentRevisionDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'BundleDto', moduleSubModule: 'TransportPlanning.Bundle'},
								{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
								{typeName: 'ResourceDto', moduleSubModule: 'Resource.Master'},
								{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
								{typeName: 'DispatchHeaderDto', moduleSubModule: 'Logistic.Dispatching'},
								{typeName: 'DispatchRecordDto', moduleSubModule: 'Logistic.Dispatching'},
								{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
								{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
								{typeName: 'CharacteristicDto', moduleSubModule: 'Basics.Characteristic'},
								{typeName: 'RequisitionRequiredSkillDto', moduleSubModule: 'Resource.Requisition'},
								{typeName: 'PpsLogReportVDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'EquipmentPlantDto', moduleSubModule: 'Resource.Equipment'},
								{typeName: 'TrsGoodsDto', moduleSubModule: 'TransportPlanning.Requisition'},
								{typeName: 'RequisitionDto', moduleSubModule: 'TransportPlanning.Requisition'},
								{typeName: 'Route2ClerkDto', moduleSubModule: moduleSubModule},
								{typeName: 'NotificationDto', moduleSubModule: 'Basics.Common'},
								{typeName: 'PpsUpstreamItemDto', moduleSubModule: 'ProductionPlanning.Item'},
								{typeName: 'EngProdComponentDto', moduleSubModule: 'ProductionPlanning.Product'},
								{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
								{typeName: 'ProductDescriptionDto', moduleSubModule: 'ProductionPlanning.ProductTemplate'},
								{typeName: 'EngDrawingDto', moduleSubModule: 'ProductionPlanning.Drawing'},
								{typeName: 'PPSItemDto', moduleSubModule: 'ProductionPlanning.Item'}
							];
							return ppsCommonLoggingHelper.initLoggingNecessity(schemas).then(function () {
								trsProjectConfigService.load();
								return platformSchemaService.getSchemas(schemas);
							});
						}],
					'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'transportplanning.requisition', 'productionplanning.common', 'businesspartner.contact']);
						// remark: wiki of platformTranslateService is http://rib-s-wiki01.rib-software.com/cloud/wiki/54/angular-translation#Platform-Translation-Service
					}],
					'loadPermissions': ['platformPermissionService', function (platformPermissionService) {
						//load permissions of access-right-descriptor "Route: Show Create/Delete Button"
						return platformPermissionService.loadPermissions(['849c2206bc204a2a9684343007ce4f31']);
					}],
					'loadCustomColumns': ['$q', 'ppsCommonCustomColumnsServiceFactory', 'transportplanningTransportTranslationService',
						function ($q, customColumnsServiceFactory, translationService) {
							let promises = [];
							let customColumnsService = customColumnsServiceFactory.getService(moduleName);
							promises.push(customColumnsServiceFactory.initCommonCustomColumnsService());
							promises.push(customColumnsService.init('transportplanning/transport/route/customcolumn'));
							return $q.all(promises).then(function () {
								translationService.setTranslationForCustomColumns();
							});
						}],
					'loadTrsPkgCustomColumns': ['transportplanningPackageMainService', function (pkgMainService) {
						return pkgMainService.LoadCustomColumns();
					}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRouteNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.TransportPlanning).load();
					}],
					loadCodeGenerationInfo2: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', '$http', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue, $http) {
						var ppsEntityId = ppsCommonCodGeneratorConstantValue.PpsEntityConstant.TransportPackage;
						$http.get(globals.webApiBaseUrl + 'productionplanning/common/getRubricCatId?ppsEntityId=' + ppsEntityId).then(function (response) {
							ppsCommonCodGeneratorConstantValue.CategoryConstant.TrsPackageCat = response.data;
						});
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsPackageNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.TransportPlanning).load();
					}],
					loadEventType: ['ppsCommonCodGeneratorConstantValue', function (ppsCommonCodGeneratorConstantValue) {
						return ppsCommonCodGeneratorConstantValue.loadEventType(); // eventType is indirectly referenced by ppsCommonCodGeneratorConstantValue.getCategoryFkviaEventType() in processItem() of dataProcessor of transportplanningTransportMainService
					}],
					'loadLookup': ['basicsLookupdataLookupDescriptorService', function (basicsLookupdataLookupDescriptorService) {
						basicsLookupdataLookupDescriptorService.loadData([
							'SiteType' // preload SiteType lookup for site filter container of Transport module (#140039)
						]);
					}],
					//'loadResTypeFilter4CheckResReqContainer': ['transportplanningTransportResRequisitionFilterService', function (filterSrv) {
					//return filterSrv.getSetResTypeFilterValue();
					//}],
					// needed to install listener for parent-service create event (even when characteristic container is not activated)
					initCharacteristicDataService: ['basicsCharacteristicDataServiceFactory', 'transportplanningTransportMainService',
						function (basicsCharacteristicDataServiceFactory, transportplanningTransportMainService) {
							basicsCharacteristicDataServiceFactory.getService(transportplanningTransportMainService, 72);
							basicsCharacteristicDataServiceFactory.getService(transportplanningTransportMainService, 73);
						}],
					loadResourcesStatus: ['productionplanningCommonRequisitionProcessor', 'productionplanningCommonResReservationProcessor',
						function (productionplanningCommonRequisitionProcessor, productionplanningCommonResReservationProcessor) {
							productionplanningCommonRequisitionProcessor.loadData();
							productionplanningCommonResReservationProcessor.loadData();
						}],
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
						var field = {
							'TrsRouteFk': 'TrsRouteFk',
							'Code': 'Id',
							'RoutesInfo.Codes': 'RoutesInfo.Ids',
							'TrsProductBundleFk': 'RoutesInfo.Ids'
						}[triggerField];
						if (field) {
							if (triggerField === 'TrsProductBundleFk') {
								item = $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('TrsBundleLookup', item.TrsProductBundleFk);
							}

							var data = _.get(item, field);
							var dataServ = $injector.get('transportplanningTransportMainService');
							if (_.isArray(data)) {
								dataServ.searchByCalIds(data);
							} else {
								dataServ.searchByCalId(data);
							}
						}
					}
				}
			);
		}]);

})(angular);