(function () {
	/* global globals, _, Platform */
	'use strict';
	let moduleName = 'estimate.main';
	let  myModule = angular.module(moduleName);

	myModule.factory('costGroupsStructureMainDataServiceFactory', [ '$timeout','$http', '$q','estimateMainFilterCommon',
		'ServiceDataProcessArraysExtension','lookupZeroToNullProcessor','$injector', '$log', 'PlatformMessenger',
		'platformDataServiceFactory','costGroupCatalogImageProcessor','estimateMainParamStructureConstant', 'estMainRuleParamIconProcess',
		function ($timeout,$http, $q,estimateMainFilterCommon,ServiceDataProcessArraysExtension,lookupZeroToNullProcessor,
			$injector, $log, PlatformMessenger,  platformDataServiceFactory,costGroupCatalogImageProcessor,estimateMainParamStructureConstant, estMainRuleParamIconProcess) {
			let estimateMainService;
			let service ={};
			function createCostGroupsStructureDataService (mainParentService,filterService,costGroupCatalogService) {
				let serviceContainer = {};

				let serviceFactoryOptions = {
					hierarchicalLeafItem: {
						module: moduleName,
						serviceName: 'costGroupsStructureMainDataServiceFactory',
						toolBar: {
							id: 'CostGroupChildren',
							costgroupName: 'CostGroupFk',
							iconClass: 'tlb-icons ico-filter-boq'
						},
						entityRole: {
							leaf: {
								itemName: 'EstCostGrp',
								parentService: costGroupCatalogService,
								doesRequireLoadAlways: true
							}
						},
						httpUpdate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/'},
						dataProcessor: [new ServiceDataProcessArraysExtension(['CostGroupChildren']), costGroupCatalogImageProcessor, estMainRuleParamIconProcess],
						useItemFilter: true,
						presenter: {
							tree: {
								parentProp: 'CostGroupFk',
								childProp: 'CostGroupChildren',
								itemName: 'EstCostGrp',
								moduleName: 'Estimate Main'
							}
						}
					}
				};

				serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

				serviceContainer.data.supportUpdateOnSelectionChanging = false;

				serviceContainer.service.getData = function getData() {
					return serviceContainer.data;
				};

				let ruleToDelete =[];

				serviceContainer.service.setRuleToDelete =  function setRuleToDelete(value) {
					ruleToDelete = value;
				};

				serviceContainer.service.getRuleToDelete =  function getRuleToDelete() {
					return ruleToDelete;
				};

				let lookupData = {};
				let costGrpStrFilters = [];
				let hightLightCostGrpStrus = [];  // collect the hight light cost group structure

				service = serviceContainer.service;


				service.hightLigthData = new Platform.Messenger();

				service.loadCostGroup = function (selectedGroupId) {

					if (!lookupData.loadCostGroupPromise) {
						lookupData.loadCostGroupPromise = serviceContainer.service.getCostGroup([selectedGroupId]);
					}
					lookupData.loadCostGroupPromise.then(function () {
						lookupData.loadCostGroupPromise = null;
					});
				};


				serviceContainer.data.provideUpdateData = function (updateData) {
					return mainParentService.getUpdateData(updateData);
				};
				service.getCostGroup = function (selectedGroupIds) {

					return  $http.post(globals.webApiBaseUrl + 'project/main/costgroup/GetCostGroupStructureTree', selectedGroupIds).then(function (response) {
						if (response) {
							serviceContainer.data.handleReadSucceeded(response.data, serviceContainer.data);
							serviceContainer.service.hightLigthData.fire(response.data);

							// ?? $injector estimateMainService ?? - lnt

							estimateMainService = $injector.get('estimateMainService');
							if (estimateMainService.getHeaderStatus() || !estimateMainService.hasCreateUpdatePermission()) {
								if (serviceContainer.data.itemList.length > 0) {
									_.forEach(serviceContainer.data.itemList, function (item) {
										$injector.get('platformRuntimeDataService').readonly(item, [{ field: 'Rule', readonly: false }, { field: 'Param', readonly: false }]);
									});
								}
							}
							return serviceContainer.data.itemList;

						} else {
							serviceContainer.data.handleReadSucceeded([], serviceContainer.data);

							if (estimateMainService.getHeaderStatus() || !estimateMainService.hasCreateUpdatePermission()) {
								if (serviceContainer.data.itemList.length > 0) {
									_.forEach(serviceContainer.data.itemList, function (item) {
										$injector.get('platformRuntimeDataService').readonly(item, [{ field: 'Rule', readonly: false }, { field: 'Param', readonly: false }]);
									});
								}
							}
							return serviceContainer.data.itemList;
						}
					});
				};


				service.removeFitlerIcon = new Platform.Messenger();
				service.changeFilter = new Platform.Messenger();

				service.setItemFilter(function (item) {

					let costGroupCatalogField = 'costgroup_' + item.CostGroupCatalogFk;

					let dataService = filterService.getServiceToBeFiltered();
					let ids = _.uniq(_.compact(_.map(dataService.getList(), costGroupCatalogField)));
					return ids.indexOf(item.Id) >= 0;
				});
				service.setFilters = function (costGrpStructureDatas) {

					if (costGrpStructureDatas.length > 1) {
						costGrpStrFilters = costGrpStrFilters.concat(costGrpStructureDatas);
					} else {
						let costGroupCatalogFks = _.filter(costGrpStrFilters, {'CostGroupCatalogFk': costGrpStructureDatas[0].CostGroupCatalogFk});
						if (costGroupCatalogFks && costGroupCatalogFks.length) {
							let tempList = angular.copy(costGrpStrFilters);
							costGrpStrFilters = [];
							// avoid same costgroup has many costgroupstructure when filter single costgroupstructure
							_.forEach(tempList, function (item) {
								if (item.CostGroupCatalogFk !== costGrpStructureDatas[0].CostGroupCatalogFk) {
									costGrpStrFilters.push(item);
								}
							});
							costGrpStrFilters = costGrpStrFilters.concat(costGrpStructureDatas);
						} else {
							costGrpStrFilters = costGrpStrFilters.concat(costGrpStructureDatas);
						}
					}

					costGrpStrFilters =  _.uniq(costGrpStrFilters,'Id');
				};

				service.getFilters = function () {
					return _.uniq(costGrpStrFilters, 'Id');
				};
				service.clearFilters = function () {
					costGrpStrFilters = [];
				};

				service.removeFilters = function (costGroupCatalogFk,costGroupIds) {

					let costGrpStructure2Removed = [];
					let tempList =[];

					// remove filter costgroup by costGruopCatalog key
					if(costGroupCatalogFk){
						costGrpStructure2Removed =  _.filter(costGrpStrFilters, {'CostGroupCatalogFk': costGroupCatalogFk});
					}
					if (costGrpStructure2Removed && costGrpStructure2Removed.length) {

						tempList = angular.copy(costGrpStrFilters);
						costGrpStrFilters = [];

						_.forEach(tempList, function (item) {
							let costGrp = _.filter(costGrpStructure2Removed, {'Id': item.Id});
							if (costGrp && !costGrp.length) {
								costGrpStrFilters.push(item);
							}
						});
					}

					// remove fitler costgroup by costgroups key
					if(costGroupIds  && costGroupIds.length){
						costGrpStructure2Removed =  _.filter(costGrpStrFilters, function(item){
							if(costGroupIds.indexOf(item.Id)>=0){
								return item;
							}
						});
					}
					if (costGrpStructure2Removed && costGrpStructure2Removed.length) {

						tempList = angular.copy(costGrpStrFilters);
						costGrpStrFilters = [];

						_.forEach(tempList, function (item) {
							let costGrp = _.filter(costGrpStructure2Removed, {'Id': item.Id});
							if (costGrp && !costGrp.length) {
								costGrpStrFilters.push(item);
							}
						});
					}
				};



				service.setHightLightCostGrpStrus = function setHightLightCostGrpStrus(costGrpStrus) {
					hightLightCostGrpStrus = costGrpStrus;
				};

				service.getHightLightCostGrpStrus = function getHightLightCostGrpStrus() {
					return hightLightCostGrpStrus;
				};

				service.assignCostGrpSturcutre2LineItem = function assignCostGrpSturcutre2LineItem(lineItem, isCreateFromAssembly, lineItem2CostGroups){
					let hightLightCostGrpStrus =  service.getHightLightCostGrpStrus();
					if(hightLightCostGrpStrus && hightLightCostGrpStrus.length>0) {
						let promiseArray = [];
						_.forEach(hightLightCostGrpStrus, function (item) {

							let costGroupCol = {};
							costGroupCol.field = 'costgroup_' + item.CostGroupCatalogFk;
							costGroupCol.costGroupCatId = item.CostGroupCatalogFk;

							// already create the cost group assignment copy form assembly and clear the CostGroupToSave updateData
							if (isCreateFromAssembly && lineItem['costgroup_' + item.CostGroupCatalogFk]){
								let existCostGroup = _.find(lineItem2CostGroups, {'MainItemId': lineItem.Id, 'CostGroupCatFk': item.CostGroupCatalogFk});
								if (existCostGroup && mainParentService.costGroupService) {
									mainParentService.costGroupService.clearModifications(lineItem, costGroupCol);
								}
							}
							else {
								lineItem['costgroup_' + item.CostGroupCatalogFk] = item.Id;
								if (mainParentService.costGroupService) {
									promiseArray.push(mainParentService.costGroupService.createCostGroup2Save(lineItem, costGroupCol));
								}
							}
						});

						if(promiseArray.length > 0){
							$q.all(promiseArray).then(function(){
								mainParentService.markItemAsModified(lineItem);
								mainParentService.fireItemModified(lineItem);
							});
						}
					}

				};

				return service;
			}

			function  extendByFilter(creationService,costGroupStructureDataService, controllerName,filterService,costGroupCatalogService){

				costGroupStructureDataService.markersChanged = function markersChanged(itemList,selectedGroupCatalog,isRemoveFilter) {

					// filter by 2 ways : 1: mulit selected 2:single selected

					let filterKey = 'BAS_COSTGROUP';
					let filterIds = filterService.getFilterObjects ? filterService.getFilterObjects(): null;
					let enabledFilter = true;
					if(filterIds && filterIds[controllerName]){
						enabledFilter =filterIds[controllerName].enabled;
					}
					if(enabledFilter) {

						let allFilterIds = [];

						let currentCostGroupList = costGroupStructureDataService.getData().itemList;// costGroupStructureDataService.getList();

						let currentCostGroupMarkedList = _.filter(currentCostGroupList, function (item) {
							return item.IsMarked;
						});

						if (currentCostGroupMarkedList && currentCostGroupMarkedList.length) {
							service.setFilters(currentCostGroupMarkedList);
						}

						let currentCostGroupNoMarkedList = _.filter(currentCostGroupList, function (item) {
							return !item.IsMarked;
						});
						let noMarkedIds = _.map(currentCostGroupNoMarkedList, 'Id');

						service.removeFilters(null, noMarkedIds);

						let filterDatas = costGroupStructureDataService.getFilters();

						if ((_.isArray(itemList) && _.size(itemList) > 0) || filterDatas.length) {
							allFilterIds = [];

							if (_.isArray(itemList) && _.size(itemList) > 0) {
								costGroupStructureDataService.setFilters(itemList);
								filterDatas = costGroupStructureDataService.getFilters();
							}

							if(isRemoveFilter && selectedGroupCatalog!== null){
								filterDatas = _.filter(filterDatas, function (item) {
									return item.CostGroupCatalogFk !== selectedGroupCatalog.Id;
								});
							}

							_.each(filterDatas, function (item) {
								let Ids = _.map(estimateMainFilterCommon.collectItems(item, 'CostGroupChildren'), 'Id');
								allFilterIds = allFilterIds.concat(Ids);
							});

							filterService.setFilterIds(filterKey, allFilterIds);
							filterService.addFilter(controllerName, costGroupStructureDataService, function () {
								return true;// allFilterIds.indexOf(lineItem.CostGroupFk) >= 0;
							}, {
								id: filterKey,
								iconClass: 'tlb-icons ico-filter-cost-group',
								captionId: 'filterCostGroupStructure'
							}, 'CostGroupFk');


							if (currentCostGroupList.length === currentCostGroupNoMarkedList.length) {
								costGroupCatalogService.classByType.fire('');
							} else {
								costGroupCatalogService.classByType.fire('tlb-icons ico-filter-off btn-square-26');
							}

						} else {
							filterService.removeFilter(controllerName);
							costGroupCatalogService.classByType.fire('');
						}
					}else{
						filterService.setFilterIds(filterKey, []);
						filterService.removeFilter(controllerName);
						costGroupCatalogService.classByType.fire('');
					}

				};


				costGroupStructureDataService.creatorItemChanged = function creatorItemChanged(e, item) {

					if (!_.isEmpty(item)) {
						creationService.addCreationProcessor(controllerName, function (creationItem) {
							if(creationItem.DescStructure === estimateMainParamStructureConstant.EnterpriseCostGroup
								|| creationItem.DescStructure === estimateMainParamStructureConstant.ProjectCostGroup
								|| !creationItem.validStructure || !creationItem.DescAssigned){
								let hightLightCostGrpStrus =  service.getHightLightCostGrpStrus();
								if(hightLightCostGrpStrus && hightLightCostGrpStrus.length){
									item = hightLightCostGrpStrus[hightLightCostGrpStrus.length - 1];
									creationItem.DescriptionInfo = angular.copy(item.DescriptionInfo);
								}
								if(creationItem.DescriptionInfo){ creationItem.DescriptionInfo.DescriptionTr = null;}
								creationItem.DescAssigned = creationItem.DescStructure === estimateMainParamStructureConstant.EnterpriseCostGroup
									|| creationItem.DescStructure === estimateMainParamStructureConstant.ProjectCostGroup;
							}

							// from structure
							if(!creationItem.validStructure ||
                                 creationItem.QtyTakeOverStructFk === estimateMainParamStructureConstant.EnterpriseCostGroup ||
                                 creationItem.QtyTakeOverStructFk === estimateMainParamStructureConstant.ProjectCostGroup) {

								let hightLightCostGrpStrus =  service.getHightLightCostGrpStrus();
								if(hightLightCostGrpStrus && hightLightCostGrpStrus.length ===1){
									item = hightLightCostGrpStrus[0];
								}else {
									item = null;
									let matchResult = _.filter(hightLightCostGrpStrus,{'CostGroupCode':creationItem.CostGroupStructureCode});
									if(matchResult && matchResult.length){
										item = matchResult[0];
									}
								}
								if(item) {
									// creationItem.DescriptionInfo = item.DescriptionInfo;

									creationItem.Quantity = item.Quantity;

									creationItem.WqQuantityTarget = item.Quantity;
									creationItem.WqQuantityTargetDetail = item.Quantity;

									creationItem.QuantityTarget  = item.Quantity;
									creationItem.QuantityTargetDetail= item.Quantity;

									creationItem.BasUomTargetFk = creationItem.BasUomFk = item.UomFk;
								}else{
									creationItem.QtyTakeOverStructFk = null;
								}
								creationItem.validStructure = true;
							}

						});
					} else {
						let hightLightCostGrp =  service.getHightLightCostGrpStrus();
						if(!hightLightCostGrp) {
							creationService.removeCreationProcessor(controllerName);
						}
					}
				};
			}

			function getService(){
				return service;
			}

			return {
				createCostGroupsStructureDataService:createCostGroupsStructureDataService,
				extendByFilter: extendByFilter,
				getService :getService
			};

		}]);
})();
