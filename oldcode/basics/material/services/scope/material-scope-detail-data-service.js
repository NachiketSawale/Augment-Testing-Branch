/**
 * Created by wui on 10/16/2018.
 */

(function (angular) {
	'use strict';
	/* global globals, _ */
	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialScopeDetailDataService', [
		'$q',
		'$http',
		'$injector',
		'PlatformMessenger',
		'platformDataServiceFactory',
		'basicsMaterialScopeDataService',
		'basicsMaterialScopeUtilityService',
		'prcItemScopeDetailTotalProcessor',
		'basicsCommonReadOnlyProcessor',
		'basicsMaterialCalculationHelper',
		function ($q,
			$http,
			$injector,
			PlatformMessenger,
			platformDataServiceFactory,
			basicsMaterialScopeDataService,
			basicsMaterialScopeUtilityService,
			prcItemScopeDetailTotalProcessor,
			basicsCommonReadOnlyProcessor,
			basicsMaterialCalculationHelper) {
			var serviceContainer = null;
			var service = null;
			var serviceOption = {
				flatNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'basicsMaterialScopeDetailDataService',
					httpCreate: {
						route: globals.webApiBaseUrl + 'basics/material/scope/detail/',
						endCreate: 'createnew'
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/material/scope/detail/'
					},
					presenter: {
						list: {
							initCreationData: function initCreationData (creationData) {
								var materialScope = basicsMaterialScopeDataService.getSelected();
								creationData.Id ={
									Id: materialScope.Id
								};
								creationData.MaxNo = basicsMaterialScopeUtilityService.getMaxInt(service.getList(), 'ItemNo');

							},
							handleCreateSucceeded: function (newData) {
								return newData;
							},
							incorporateDataRead: function incorporateDataRead(readData, data) {
								var readItems = readData.dtoes || readData; // in case from cache
								var dataRead = serviceContainer.data.handleReadSucceeded(readItems, data);

								$injector.invoke(['basicsCostGroupAssignmentService', function(basicsCostGroupAssignmentService){
									basicsCostGroupAssignmentService.process(readData, service, {
										mainDataName: 'dtoes',
										attachDataName: 'ScopeDetailCostGroups',
										dataLookupType: 'ScopeDetailCostGroups',
										identityGetter: function identityGetter(entity){
											return {
												Id: entity.MainItemId
											};
										}
									});
								}]);


								return dataRead;
							}
						}
					},
					entityRole: {
						node: {
							itemName: 'MaterialScopeDetail',
							parentService: basicsMaterialScopeDataService
						}
					},
					translation: {
						uid: 'basicsMaterialScopeDetailDataService',
						title: 'basics.material.scopeDetail.listTitle',
						columns: [
							{
								header: 'cloud.common.entityDescription',
								field: 'Description1Info'
							},
							{
								header: 'basics.material.record.furtherDescription',
								field: 'Description2Info'
							},
							{
								header: 'cloud.common.EntitySpec',
								field: 'SpecificationInfo',
								maxLength: 2000
							}
						],
						dtoScheme: { typeName: 'MaterialScopeDetailDto', moduleSubModule: 'Basics.Material' }
					},
					dataProcessor: [prcItemScopeDetailTotalProcessor, {processItem: readonlyProcessItem}],
					actions: {
						delete: {},
						create: 'flat',
						canCreateCallBackFunc: function () {
							return !basicsMaterialScopeDataService.parentService().isReadonlyMaterial();
						},
						canDeleteCallBackFunc: function () {
							return !basicsMaterialScopeDataService.parentService().isReadonlyMaterial();
						}
					}
				}
			};
			serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			service = serviceContainer.service;

			// add the onCostGroupCatalogsLoaded messenger
			service.onCostGroupCatalogsLoaded = new PlatformMessenger();

			service.getData = function () {
				return serviceContainer.data;
			};

			var supplyTypeDeferred = $http.post(globals.webApiBaseUrl + 'basics/customize/ScopeOfSupplyType/list', {filter: ''});
			let roundType=basicsMaterialCalculationHelper.roundingType;
			service.sumTotal=function(materialItem,itemScope){
				function sum() {
					$q.when(supplyTypeDeferred).then(function (res) {
						var scopeOfSupplyTypes = res.data;
						var scopeOfSupplyTypeIds = [];
						if (scopeOfSupplyTypes && scopeOfSupplyTypes.length) {
							scopeOfSupplyTypeIds = scopeOfSupplyTypes.filter(function (item) {
								return item.Ispricecomponent;
							}).map(function (item) {
								return item.Id;
							});
						}
						var basicsMaterialRecordService = basicsMaterialScopeDataService.parentService();
						var scopeDetails = service.getList();
						var scopeDetailByTypes=scopeDetails.filter(function (item) {
							return scopeOfSupplyTypeIds.indexOf(item.ScopeOfSupplyTypeFk) !== -1;
						});
						var listPrice = 0;
						if (itemScope.IsSelected) {
							listPrice = _.sumBy(scopeDetailByTypes, function (item) {
								return item.Total;
							});
							materialItem.ListPrice = basicsMaterialCalculationHelper.round(roundType.ListPrice,listPrice);
							basicsMaterialRecordService.recalculateCost(materialItem, materialItem.ListPrice, 'ListPrice');
							basicsMaterialRecordService.gridRefresh();
						}
					});
				}
				function onListLoaded() {
					sum();
					service.unregisterListLoaded(onListLoaded);
				}
				var currentParentItem = serviceContainer.data.currentParentItem;
				if (currentParentItem !== itemScope) {
					service.registerListLoaded(onListLoaded);
				}
				else {
					sum();
				}
			};

			basicsMaterialScopeDataService.isSelectedChanged.register(function (e, args) {
				var materialItem = args.materialItem;
				var itemScope = args.itemScope;
				if(itemScope.IsSelected) {
					service.sumTotal(materialItem, itemScope);
				}
				else{
					var basicsMaterialRecordService = basicsMaterialScopeDataService.parentService();
					materialItem.ListPrice = 0;
					basicsMaterialRecordService.recalculateCost(materialItem, 0, 'ListPrice');
					basicsMaterialRecordService.gridRefresh();
				}
			});

			var readonlyProcessorService = basicsCommonReadOnlyProcessor.createReadOnlyProcessor({
				uiStandardService: 'basicsMaterialScopeDetailUIStandardService',
				readOnlyFields: []
			});
			function readonlyProcessItem(item) {
				if (!item) {
					return;
				}
				if (basicsMaterialScopeDataService.parentService().isReadonlyMaterial()) {
					readonlyProcessorService.setRowReadonlyFromLayout(item, true);
				}
			}

			return service;
		}
	]);

})(angular);