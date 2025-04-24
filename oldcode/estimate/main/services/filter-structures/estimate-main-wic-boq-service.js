
(function () {
	/* global globals, _, Platform */
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	estimateMainModule.factory('lookupZeroToNullProcessor', [function () { // TODO: improve name...
		let service = {};
		service.processItem = function processItem(item) {
			if (angular.isDefined(item.BasUomFk)) {
				item.BasUomFk = (item.BasUomFk === 0) ? null : item.BasUomFk;
			}
			if (angular.isDefined(item.BoqItemFlagFk)) {
				item.BoqItemFlagFk = (item.BoqItemFlagFk === 0) ? null : item.BoqItemFlagFk;
			}
		};
		return service;
	}]);

	estimateMainModule.factory('estimateMainWicBoqService', ['platformDataServiceFactory', 'PlatformMessenger', 'platformGridAPI', '$injector', 'cloudCommonGridService',
		'ServiceDataProcessArraysExtension', 'boqMainImageProcessor', 'lookupZeroToNullProcessor', 'estimateMainCreationService', 'estimateMainFilterService',
		'estimateMainService', 'estimateMainFilterCommon', 'estimateProjectRateBookConfigDataService', '$http','estimateWicGroupDataService',
		function (platformDataServiceFactory, PlatformMessenger, platformGridAPI, $injector, cloudCommonGridService,
			ServiceDataProcessArraysExtension, boqMainImageProcessor, lookupZeroToNullProcessor, estimateMainCreationService, estimateMainFilterService,
			estimateMainService, estimateMainFilterCommon, estimateProjectRateBookConfigDataService, $http,estimateWicGroupDataService) {

			let projectId = estimateMainService.getSelectedProjectId();
			// let isReadData = false; // already send xhr to service
			let lookupData = {};
			let wicBoqItemForFilterList = [];
			let gridId = null;
			let multiSelectFlag = false;
			let dynamicUserDefinedColumnsService = null;
			let filterKey = 'BOQ_WIC_ITEM';

			let boqServiceOption = {
				hierarchicalLeafItem: {
					module: estimateMainModule,
					serviceName: 'estimateMainWicBoqService',
					toolBar: {
						id: 'BoqItems',
						costgroupName: 'BoqItemFk',
						iconClass: 'tlb-icons ico-filter-boq'
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['BoqItems']), boqMainImageProcessor, lookupZeroToNullProcessor],
					useItemFilter: true,
					presenter: {
						tree: {
							parentProp: 'BoqItemFk',
							childProp: 'BoqItems',
							itemName: 'WicBoq'
						}
					},
					entityRole: {
						leaf: {
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							codeField: 'Reference',
							descField: 'BriefInfo.Description',
							itemName: 'WicBoq',
							moduleName: 'Estimate Main',
							parentService: estimateWicGroupDataService,
							doesRequireLoadAlways: true,
							handleUpdateDone: function (updateData, response) {
								updateData.MainItemId = updateData.MainItemId < 0 ? null : updateData.MainItemId;
								estimateMainService.updateList(updateData, response);
							}
						}
					},
					actions: {}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(boqServiceOption);
			let service = serviceContainer.service,
				allFilterIds = [];
			service.setFilter('projectId=' + projectId + '&filterValue=');

			serviceContainer.data.doUpdate = null;
			service.addEntityToModified = function (){};

			// filter leading structure by line items
			estimateMainFilterService.addLeadingStructureFilterSupport(service, 'WicBoqItemFk');

			service.creatorItemChanged = function creatorItemChanged(e, item) {
				if (!_.isEmpty(item)) {
					estimateMainCreationService.addCreationProcessor('estimateMainWicBoqListController', function (creationItem) {
						// BoqLineTypeFk, only assign:
						// Position = 0

						let canAdd = true;
						if (item && item.Id && item.BoqLineTypeFk === 0) {
							// if position boq contains sub quantity, can not assign lineItem to BoqItem which contains sub quantity items.
							if (_.isArray(item.BoqItems) && item.BoqItems.length > 0) {
								let crbChildrens = _.filter(item.BoqItems,{'BoqLineTypeFk':11});
								if(crbChildrens && crbChildrens.length){
									canAdd = false;
								}
							}
						}
						let boqLineTypes = [0, 11, 200, 201, 202, 203];
						if (boqLineTypes.indexOf(item.BoqLineTypeFk) === -1) {
							canAdd = false;
						}

						if (canAdd) {
							creationItem.WicBoqItemFk = item.Id >0 ? item.Id :null;
							creationItem.WicBoqHeaderFk = item.BoqHeaderFk;
							creationItem.BoqWicCatFk = item.BoqWicCatFk;
							creationItem.DescriptionInfo = item.BriefInfo;
							// from structure
							if (!creationItem.validStructure || creationItem.QtyTakeOverStructFk === 1) {
								creationItem.Quantity = item.Quantity;

								creationItem.WqQuantityTarget = item.Quantity;
								creationItem.WqQuantityTargetDetail = item.Quantity;

								creationItem.BasUomTargetFk = creationItem.BasUomFk = item.BasUomFk;
								creationItem.validStructure = true;
								creationItem.QtyTakeOverStructFk = 1;
							}
						}
					});

					// focus on wic boq, to load assembly
					let estimateMainWicRelateAssemblyService = $injector.get('estimateMainWicRelateAssemblyService');
					if(estimateMainWicRelateAssemblyService.getCurrentFilterType() === 'filterByWicBoQ') {
						if (item && item.Id ) {
							estimateMainWicRelateAssemblyService.load();
							// $injector.get('estimateMainWicRelateAssemblyService').activateStrLayout();
						}
						else {
							estimateMainWicRelateAssemblyService.updateList([]);
						}
					}
				} else {
					estimateMainCreationService.removeCreationProcessor('estimateMainWicBoqListController');
				}
			};


			service.filterBoqWicItem = new Platform.Messenger();
			service.onBarToolHighlightStatusChanged = new PlatformMessenger();
			service.classByType = new Platform.Messenger();
			service.changeFilter = new Platform.Messenger();
			service.clearWicGroupFilterIcon =  new Platform.Messenger();

			// clear the wicboqitem's filter icon  that filter by lineItem
			service.clearWicBoqItemFilterIcon = new Platform.Messenger();


			service.registerfilterBoqWicItem = function (callBackFn) {
				service.filterBoqWicItem.register(callBackFn);
			};
			service.unregisterfilterBoqWicItem = function (callBackFn) {
				service.filterBoqWicItem.unregister(callBackFn);
			};

			service.getMultiSelectFlag = function getMultiSelectFlag(){
				return multiSelectFlag;
			};

			service.setMultiSelectFlag = function setMultiSelectFlag(value){
				multiSelectFlag = value;
			};


			service.getIsItemFilterEnabled = function getIsItemFilterEnabled(){
				return serviceContainer.data.itemFilterEnabled;
			};

			service.markersChanged = function markersChanged(itemList,wicGroupId) {
				let filterId ='estimateMainWicBoqListController';

				let cols = platformGridAPI.columns.configuration(service.getGridId());
				let filterCol = _.find(cols.current, {id: 'marker'});

				if (filterCol && filterCol.editorOptions) {
					multiSelectFlag = filterCol.editorOptions.multiSelect;
				}

				let filterIds = estimateMainFilterService.getFilterObjects ? estimateMainFilterService.getFilterObjects(): null;
				let enabledFilter = true;
				if(filterIds && filterIds[filterId]){
					enabledFilter = filterIds[filterId].enabled;
				}
				if(enabledFilter) {

					let wicBoqItemList = service.getList();
					let _temp =[];

					let currentwicBoqItems = serviceContainer.data.itemTree;
					cloudCommonGridService.flatten(currentwicBoqItems, _temp, 'BoqItems');

					wicBoqItemList = wicBoqItemList.concat(_temp);
					wicBoqItemList =  _.uniq(wicBoqItemList,'Id');

					let wicBoqItemMarkedList = _.filter(wicBoqItemList, function (item) {
						return item.IsMarked;
					});

					if(wicGroupId){
						wicBoqItemMarkedList =  _.filter(wicBoqItemList, function (item) {
							return item.BoqWicCatFk !== wicGroupId;
						});
					}

					if (wicBoqItemMarkedList && wicBoqItemMarkedList.length) {
						service.setWicBoqItemForFilter(wicBoqItemMarkedList);
					}

					let currentwicBoqItemNoMarkedList = _.filter(wicBoqItemList, function (item) {
						return !item.IsMarked;
					});


					let noMarkedIds = _.map(currentwicBoqItemNoMarkedList, 'Id');

					service.removeWicBoqItemForFilter(null, noMarkedIds);

					let filterDatas = service.getWicBoqItemForFilter();


					if (_.isArray(itemList) && _.size(itemList) > 0 || filterDatas.length) {
						allFilterIds = [];

						if(!multiSelectFlag){ // when mulit-selection model is false
							service.clearWicBoqItemForFilter();
						}

						if (_.isArray(itemList) && _.size(itemList) > 0) {
							service.setWicBoqItemForFilter(itemList);
						}
						// get all child boqs (for each item)
						_.each(filterDatas, function (item) {
							let Ids = _.map(estimateMainFilterCommon.collectItems(item, 'BoqItems'), 'Id');
							allFilterIds = allFilterIds.concat(Ids);
						});

						estimateMainFilterService.setFilterIds(filterKey, allFilterIds);
						estimateMainFilterService.addFilter(filterId, service, function (lineItem) {
							return allFilterIds.indexOf(lineItem.WicBoqItemFk) >= 0;
						}, {
							id: filterKey,
							iconClass: 'tlb-icons  ico-filter-wic-boq',
							captionId: 'filterBoqWic'
						}, 'WicBoqItemFk');

						/* service.setWicBoqItemForFilter(itemList[0]);
						 service.classByType.fire('tlb-icons ico-filter-off btn-square-26'); */

						if (wicBoqItemList.length === currentwicBoqItemNoMarkedList.length) {
							service.classByType.fire('');
						} else {
							service.classByType.fire('tlb-icons ico-filter-off btn-square-26');
						}

					} else {
						estimateMainFilterService.setFilterIds(filterKey, []);
						estimateMainFilterService.removeFilter(filterId);

						service.removeWicBoqItemForFilter();
						service.classByType.fire('');
					}

				}else{
					estimateMainFilterService.setFilterIds(filterKey, []);
					estimateMainFilterService.removeFilter(filterId);

					service.removeWicBoqItemForFilter();
					service.classByType.fire('');
				}
				service.filterBoqWicItem.fire();
			};

			serviceContainer.data.provideUpdateData = function (updateData) {
				if (updateData && !updateData.MainItemId) {
					updateData.MainItemId = service.getIfSelectedIdElse(-1);
				}
				return estimateMainService.getUpdateData(updateData);
			};
			service.addList = function addList(data) {
				let list = serviceContainer.data.itemList;
				serviceContainer.data.itemList = !list || !list.length ? [] : list;

				if (data && data.length) {
					angular.forEach(data, function (d) {
						let item = _.find(list, {Id: d.Id});
						if (item) {
							angular.extend(list[list.indexOf(item)], d);
						} else {
							serviceContainer.data.itemList.push(d);
						}
					});
				}
			};

			service.expandNodeParent = function expandNodeParent(node) {
				let gId = service.getGridId();
				node.nodeInfo.collapsed = false;
				if (node.nodeInfo.level !== 0) {
					let parent = _.find(service.getUnfilteredList(), {'Id': node.BoqItemFk});
					if (parent) {
						if(parent.nodeInfo){
							platformGridAPI.rows.expandNode(gId, parent);
							return service.expandNodeParent(parent);
						}else{
							return node;
						}
					} else {
						return node;
					}
				} else {
					return node;
				}
			};


			service.setHightLightFilterWicBoqItem = function setHightLightFilterWicBoqItem(){
				let filter = service.getWicBoqItemForFilter();
				let wicBoqItem4FilterIds = _.map(filter,'Id');

				let wicBoqItemsList  = service.getList();
				if(wicBoqItem4FilterIds){
					_.forEach(wicBoqItemsList,function(item){
						item.IsMarked = wicBoqItem4FilterIds.indexOf(item.Id) > -1;
					});

					if(filter && filter.length){
						serviceContainer.data.listLoaded.fire();
						service.expandNodeParent(filter[0]);
						let gId = service.getGridId();
						let ids = _.map(filter, 'Id');
						let grid = platformGridAPI.grids.element('id', gId);
						let rows = grid.dataView.mapIdsToRows(ids);
						grid.instance.setSelectedRows(rows, true);
						service.setSelectedEntities(filter);
					}
				}
			};

			service.loadWicBoqItem = function loadWicBoqItem(selecteWicGroupId) {
				if (!lookupData.loadCostGroupPromise) {
					lookupData.loadCostGroupPromise = getWicBoqItem([selecteWicGroupId]);
				}
				lookupData.loadCostGroupPromise.then(function () {
					service.setHightLightFilterWicBoqItem();
					lookupData.loadCostGroupPromise = null;
				});
			};

			service.removeWicBoqItemForFilter = function (wicGroupId,wicBoqItemIds) {
				let wicBoqItem2Removed =[];
				let tempList =[];

				if(wicGroupId){
					wicBoqItem2Removed =  _.filter(wicBoqItemForFilterList, {'BoqWicCatFk': wicGroupId});
				}
				if(wicBoqItem2Removed  && wicBoqItem2Removed.length){
					tempList = angular.copy(wicBoqItemForFilterList);
					wicBoqItemForFilterList = [];

					_.forEach(tempList, function (item) {
						let costGrp = _.filter(wicBoqItem2Removed, {'Id': item.Id});
						if (costGrp && !costGrp.length) {
							wicBoqItemForFilterList.push(item);
						}
					});
				}


				if(wicBoqItemIds  && wicBoqItemIds.length){
					wicBoqItem2Removed =  _.filter(wicBoqItemForFilterList, function(item){
						if(wicBoqItemIds.indexOf(item.Id)>=0){
							return item;
						}
					});
				}

				if (wicBoqItem2Removed && wicBoqItem2Removed.length) {

					tempList = angular.copy(wicBoqItemForFilterList);
					wicBoqItemForFilterList = [];

					_.forEach(tempList, function (item) {
						let costGrp = _.filter(wicBoqItem2Removed, {'Id': item.Id});
						if (costGrp && !costGrp.length) {
							wicBoqItemForFilterList.push(item);
						}
					});
				}
			};


			service.setGridId = function(value){
				gridId = value;
			};

			service.getGridId = function() {
				return gridId;
			};

			service.setWicBoqItemForFilter = function (wicBoqItems) {
				if(wicBoqItems && wicBoqItems.length>1){
					wicBoqItemForFilterList = wicBoqItemForFilterList.concat(wicBoqItems);
				}else{

					let costGroupFks = _.filter(wicBoqItemForFilterList, {'BoqWicCatFk': wicBoqItems[0].BoqWicCatFk});
					if (costGroupFks && costGroupFks.length) {
						let tempList = angular.copy(wicBoqItemForFilterList);
						wicBoqItemForFilterList = [];
						// avoid same wicGroup has many wicBoqItems when filter single wicGroup
						_.forEach(tempList, function (item) {
							if (item.BoqWicCatFk !== wicBoqItems[0].BoqWicCatFk) {
								wicBoqItemForFilterList.push(item);
							}
						});
						wicBoqItemForFilterList = wicBoqItemForFilterList.concat(wicBoqItems);
					} else {
						wicBoqItemForFilterList = wicBoqItemForFilterList.concat(wicBoqItems);
					}
				}

				wicBoqItemForFilterList =  _.uniq(wicBoqItemForFilterList,'Id');
			};

			service.getWicBoqItemForFilter = function () {
				return _.uniq(wicBoqItemForFilterList, 'Id');
			};

			service.clearWicBoqItemForFilter = function () {
				wicBoqItemForFilterList = [];
			};


			service.getDynamicUserDefinedColumnsService = function (){
				return dynamicUserDefinedColumnsService;
			};

			service.setDynamicUserDefinedColumnsService = function (value){
				dynamicUserDefinedColumnsService = value;
			};

			function getWicBoqItem(selecteWicGroupIds) {
				let projectId = estimateMainService.getSelectedProjectId();
				let param = {};
				if (projectId) {
					param.ProjectId = projectId;
				}
				param.WicGroupIds = selecteWicGroupIds;

				let _dynamicUserDefinedColumnsService = service.getDynamicUserDefinedColumnsService();
				return $http.post(globals.webApiBaseUrl + 'boq/main/getwicboqtree', param).then(function (response) {
					if (response) {
						serviceContainer.data.itemTree=response.data;

						let result = [];
						cloudCommonGridService.flatten(response.data, result, 'BoqItems');

						_.forEach(result, function (item) {
							boqMainImageProcessor.processItem(item);
						});
						estimateMainFilterService.handleMarkStatus(filterKey, serviceContainer, response.data, 'BoqItems');
						serviceContainer.data.itemList =result;

						serviceContainer.data.listLoaded.fire();

					} else {
						serviceContainer.data.itemTree =[];
						serviceContainer.data.listLoaded.fire();
					}

					if(_dynamicUserDefinedColumnsService && _.isFunction(_dynamicUserDefinedColumnsService.attachDataToColumn)) {
						_dynamicUserDefinedColumnsService.attachDataToColumn(serviceContainer.data.itemList);
					}
				});
			}

			service.clearFilterData  = function (){
				serviceContainer.data.itemTree =[];
				serviceContainer.data.listLoaded.fire();
				estimateWicGroupDataService.clearSelectedWicGroup();
				service.clearWicBoqItemForFilter();
			};

			serviceContainer.service.getData = function getData() {
				return serviceContainer.data;
			};

			return service;
		}]);
})();
