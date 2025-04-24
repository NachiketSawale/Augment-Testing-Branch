/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainWicBoqListController',
		['_', '$scope', '$injector', '$translate', '$timeout', 'platformGridAPI', 'platformGridControllerService', 'estimateMainCommonUIService', 'estimateMainService', 'estimateMainWicBoqService', 'estimateMainValidationService', 'loadingIndicatorExtendServiceFactory', 'estimateDefaultGridConfig', 'estimateMainClipboardService', 'estimateMainFilterService', 'estimateCommonControllerFeaturesServiceProvider', 'boqMainClipboardService', 'cloudCommonGridService','estimateWicGroupDataService',
			function (_, $scope, $injector, $translate, $timeout, platformGridAPI, platformGridControllerService, estimateMainCommonUIService, estimateMainService, estimateMainWicBoqService, estimateMainValidationService, loadingIndicatorExtendServiceFactory, estimateDefaultGridConfig, estimateMainClipboardService, estimateMainFilterService, estimateCommonControllerFeaturesServiceProvider, boqMainClipboardService, cloudCommonGridService,estimateWicGroupDataService) {

				loadingIndicatorExtendServiceFactory.createServiceForDataServiceFactory($scope, 500, estimateMainWicBoqService);

				let gridConfig = angular.extend({
						marker: {
							filterService: estimateMainFilterService,
							filterId: 'estimateMainWicBoqListController',
							dataService: estimateMainWicBoqService,
							serviceName: 'estimateMainWicBoqService'
						},
						propagateCheckboxSelection: true,
						parentProp: 'BoqItemFk',
						childProp: 'BoqItems',
						type: 'wicBoqItems',
						dragDropService: estimateMainClipboardService
					}, estimateDefaultGridConfig),
					uiService = estimateMainCommonUIService.createUiService(
						['Reference', 'Reference2', 'BriefInfo', 'BoqDivisionTypeFk',  'BasUomFk', 'PrjCharacter', 'WorkContent', 'BoqItemFlagFk',
							'BoqLineTypeFk','Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5'],
						{
							serviceName: 'estimateMainWicBoqService',
							itemName: 'WicBoq',
							RootServices: ['estimateMainActivityService', 'estimateMainRootService', 'estimateMainWicBoqService']
						});


				platformGridControllerService.initListController($scope, uiService, estimateMainWicBoqService, estimateMainValidationService, gridConfig);

				let selectedRow = estimateMainWicBoqService.getSelected();
				if(selectedRow){
					estimateMainWicBoqService.creatorItemChanged(null,selectedRow);
				}

				function initDynamicUserDefinedColumns() {
					let esttimateBoqMainDynamicUserDefinedColumnService = $injector.get('estimateBoqMainDynamicUserDefinedColumnService');
					let estimateCommonDynamicConfigurationServiceFactory = $injector.get('estimateCommonDynamicConfigurationServiceFactory');

					let options = {
						dynamicColDictionaryForDetail: []
					};
					let commonDynamicConfigurationService = estimateCommonDynamicConfigurationServiceFactory.createService(uiService, estimateMainValidationService, options);

					if(!estimateMainWicBoqService.getDynamicUserDefinedColumnsService()) {
						let userDefinedColumnService = esttimateBoqMainDynamicUserDefinedColumnService.getService(estimateMainValidationService, estimateMainWicBoqService, commonDynamicConfigurationService);
						estimateMainWicBoqService.setDynamicUserDefinedColumnsService(userDefinedColumnService);
					}

					let dynamicUserDefinedColumnsService = estimateMainWicBoqService.getDynamicUserDefinedColumnsService();
					if(dynamicUserDefinedColumnsService && _.isFunction(dynamicUserDefinedColumnsService.applyToScope)) {
						dynamicUserDefinedColumnsService.applyToScope($scope);
					}
					if (dynamicUserDefinedColumnsService && _.isFunction(dynamicUserDefinedColumnsService.loadDynamicColumns)) {
						dynamicUserDefinedColumnsService.loadDynamicColumns();
					}
				}

				initDynamicUserDefinedColumns();


				// estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

				estimateMainWicBoqService.registerSelectionChanged(estimateMainWicBoqService.creatorItemChanged);
				estimateMainWicBoqService.setGridId($scope.gridId);

				function wicBoQFilterOff() {
					estimateMainWicBoqService.markersChanged(null);
					$scope.tools.update();
				}

				estimateMainService.registerwicBoqFilterOffEvent(wicBoQFilterOff);

				let addInList = [];
				let convertToNewList = function convertToNewList(data) {
					data.HasChildren = data && data.BoQItems ? true : false;
					addInList.push(data);

					if (data && data.BoQItems) {
						data.BoqItems = angular.copy(data.BoQItems);
						delete data.BoQItems;
						_.each(data.BoqItems, function (item) {
							if (item && item.BoQItems) {
								convertToNewList(item);
							}
						});
					}
					return data;
				};

				let reactOnLinkBoqItemSucceeded = function reactOnLinkBoqItemSucceeded(data) {
					if (data) {
						let newDataList = convertToNewList(data);
						estimateMainWicBoqService.addList(addInList);
						let datalist = estimateMainWicBoqService.getUnfilteredList();
						let flatdatalist = cloudCommonGridService.flatten(datalist, [], 'BoqItems');
						let parentItem = _.find(flatdatalist, {Id: newDataList.BoqItemFk});
						let isExist = false;
						if (parentItem && _.isArray(parentItem.BoqItems)) {
							isExist = _.find(parentItem.BoqItems, {Id: newDataList.Id});
						}
						if (parentItem && !isExist) {
							boqMainClipboardService.spliceBoqItemTree([{BoqItem: newDataList}], parentItem, estimateMainWicBoqService, function () {
							});
						}
					}
				};

				let toggleHighlight = function toggleHighlight() {

					let heightLightBoqTool = _.filter($scope.tools.items, {id: 'heightLightBoq'})[0];
					if (heightLightBoqTool && heightLightBoqTool.value) {

						let selectPrjBoqEntity = platformGridAPI.grids.element('id', 'ecaf41be6cc045588297d5efb9745fe4');
						let selectPrjBoqRows = (selectPrjBoqEntity && selectPrjBoqEntity.instance) ?  selectPrjBoqEntity.instance.getSelectedRows(): [];
						if (selectPrjBoqRows && selectPrjBoqRows.length) {
							// do not use getSelectedEntities ,coz the getSelectedEntities will return cache data,not the last selected datas
							let selectPrjBoqList = [];
							_.forEach(selectPrjBoqRows, function (item) {
								let selectPrjBoq = selectPrjBoqEntity.instance.getDataItem(item);
								if (selectPrjBoq && selectPrjBoq.BoqLineTypeFk === 0) {
									selectPrjBoqList.push(selectPrjBoq);
								}
							});

							if (selectPrjBoqList.length) {
								let grid = platformGridAPI.grids.element('id', $scope.gridId);
								let row = grid.instance.getSelectedRows();
								if ((row && row.length === 0)) {
									row.push(0);
									platformGridAPI.rows.expandNextNode($scope.gridId);
								} else if (row && row.length && row[0] === 0) {
									platformGridAPI.rows.expandNextNode($scope.gridId);
								}
								let wicBoqsList = estimateMainWicBoqService.getList();
								wicBoqsList = _.orderBy(wicBoqsList, 'Id');
								let selectedWicItem = [];
								_.forEach(selectPrjBoqList, function (prjBoqItem) {
									_.filter(wicBoqsList, function (wicItem) {
										if (prjBoqItem.BoqItemWicItemFk === wicItem.Id) {

											selectedWicItem.push(wicItem);

											// first expandAllSubNodes of the paranetItem
											platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, selectedWicItem[0]);


											let ids = _.map(selectedWicItem, 'Id');
											let rows = grid.dataView.mapIdsToRows(ids);
											grid.instance.setSelectedRows(rows, true);
											estimateMainWicBoqService.setSelectedEntities(selectedWicItem);
										}
									});
								});

								if (selectedWicItem.length === 1) {
									estimateMainWicBoqService.creatorItemChanged(null, selectedWicItem[0]);
								} else {
									estimateMainWicBoqService.creatorItemChanged(null, null);
								}

								if (selectedWicItem.length === 0) {
									grid.instance.setSelectedRows([-1], true);
									estimateMainWicBoqService.setSelectedEntities([]);
								}

								estimateMainWicBoqService.gridRefresh();
							}
						}
					}
				};

				let estimateMainCommonService = $injector.get('estimateMainCommonService');
				estimateMainCommonService.onLinkBoqItemSucceeded.register(reactOnLinkBoqItemSucceeded);
				estimateMainWicBoqService.onBarToolHighlightStatusChanged.register(toggleHighlight);



				let removeItems = ['t12','t11'];
				$scope.tools.items = _.filter($scope.tools.items, function (item) {
					return item && removeItems.indexOf(item.id) === -1;
				});

				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 'heightLightBoq',
							caption: 'estimate.main.toggleHighlight',
							type: 'check',
							iconClass: 'tlb-icons ico-view-select',
							fn: function clikctoggleHighlight() {
								if (this.value) {
									toggleHighlight();
								}
							}
						},
						{
							id: 't11',
							sort: 110,
							caption: 'cloud.common.toolbarFilter',
							type: 'item',
							iconClass: 'tlb-icons ico-filter-off',
							disabled: function () {
								return !estimateMainFilterService.isFilter('estimateMainWicBoqListController');
							},
							fn: function filterOff() {
								removeMarkers(estimateMainWicBoqService.getList());
							}
						},
						{
							id: 't12',
							sort: 120,
							caption: 'cloud.common.toolbarSelectionMode',
							type: 'check',
							value: !!gridConfig.marker.multiSelect,
							iconClass: 'tlb-icons ico-selection-multi',
							fn: function toogleSelectionMode() {
								if (platformGridAPI.grids.exist($scope.gridId)) {
									// get marker/filter column def ...
									let cols = platformGridAPI.columns.configuration($scope.gridId);
									let filterCol = _.find(cols.current, {id: 'marker'});
									if (filterCol && filterCol.editorOptions) {
										// ... switch multiselect and save
										filterCol.editorOptions.multiSelect = !filterCol.editorOptions.multiSelect;


										estimateMainWicBoqService.setMultiSelectFlag(filterCol.editorOptions.multiSelect);

										platformGridAPI.columns.configuration($scope.gridId, cols.current);

										// remove all markers (and the filter) if we switch to single-selection
										// but only if there were more than one markers set
										// let list = _.filter(estimateMainWicBoqService.getUnfilteredList(), {IsMarked: true});

										let list = _.filter(estimateMainWicBoqService.getUnfilteredList(), {IsMarked: true});
										if (!filterCol.editorOptions.multiSelect) {
											removeMarkers(list);
										}

										let grid = platformGridAPI.grids.element('id', $scope.gridId);
										if(grid && grid.instance) {
											grid.instance.onSelectionModeChanged.notify({items:list, isMultiSelect: filterCol.editorOptions.multiSelect, column: filterCol}, new Slick.EventData(), grid.instance);
										}
									}
								}
							}
						}
					]
				});

				function removeMarkers(markers2Remove) {
					let singleItem;
					if(_.size(markers2Remove) === 1)
					{
						singleItem = markers2Remove[0];
					}
					// set the tree filter by lineitem filter
					if(estimateMainWicBoqService.getIsItemFilterEnabled()) {
						estimateMainWicBoqService.clearWicBoqItemFilterIcon.fire();
					}

					// the original tree ,here must be set isMarked = false again
					let list = estimateMainWicBoqService.getList();
					_.each(list, function (item) {
						if(singleItem && singleItem.Id === item.Id) {
							item.isMarked = true;
						} else {
							item.IsMarked = singleItem && item.IsMarked === null ? null : false;
						}
					});

					estimateMainWicBoqService.clearWicBoqItemForFilter();
					estimateMainWicBoqService.gridRefresh();

					estimateMainFilterService.removeFilter('estimateMainWicBoqListController');
					$scope.tools.update();
				}

				// delete the bulk edit button
				removeItems = ['t14'];
				$scope.tools.items = _.filter($scope.tools.items, function (item) {
					return item && removeItems.indexOf(item.id) === -1;
				});

				$scope.tools.update();

				function wicGroupChanged(selectedGroup) {

					let heightLightBoqTool = _.filter($scope.tools.items, {id: 'heightLightBoq'})[0];
					if(heightLightBoqTool){
						heightLightBoqTool.value = false;
					}

					$timeout(function () {
						// eslint-disable-next-line no-prototype-builtins
						if (selectedGroup && selectedGroup.hasOwnProperty('Id')) {
							estimateMainWicBoqService.loadWicBoqItem(selectedGroup.Id);
						}else{
							estimateMainWicBoqService.getData().itemTree.length = 0;
							estimateMainWicBoqService.getData().listLoaded.fire();
						}

					}, 0, false);
				}

				function showWicGroupFilterIcon(value) {

					let wicGroupIds = [];
					if(estimateMainWicBoqService.getMultiSelectFlag()){

						let wicBoqItemForFilter = estimateMainWicBoqService.getWicBoqItemForFilter();
						if(wicBoqItemForFilter){
							wicGroupIds = _.map(wicBoqItemForFilter,'BoqWicCatFk');
						}

					} else{
						let selectedGroup = estimateWicGroupDataService.getSelectedWicGroup();
						if(selectedGroup){
							wicGroupIds.push(selectedGroup.Id);
						}
					}
					if (wicGroupIds) {

						let result = [];
						let treeList = estimateWicGroupDataService.getTree();
						cloudCommonGridService.flatten(treeList, result, 'WicGroups');

						_.forEach(result, function (item) {
							item.Image = null;
							if(wicGroupIds.indexOf(item.Id)>-1){
								item.Image = value;
							}
						});

						if(treeList && treeList.length){
							estimateWicGroupDataService.setTree(treeList);
							estimateWicGroupDataService.listLoaded.fire(treeList);
						}
					}
				}

				function changeFilter(wicGroupId){
					// estimateMainWicBoqService.setIsRemoveFilter(true);
					// estimateMainWicBoqService.markersChanged([]);
					let filterDatas = estimateMainWicBoqService.getWicBoqItemForFilter();
					estimateMainWicBoqService.markersChanged(filterDatas,wicGroupId);
				}


				function clearWicBoqItemFilterIcon(){
					let gridElment = platformGridAPI.grids.element('id', $scope.gridId);
					let listByLineItemFilter = gridElment.dataView.getRows();

					_.each(listByLineItemFilter, function (item) {
						item.IsMarked = false;
					});
				}

				estimateWicGroupDataService.selectionChanged.register(wicGroupChanged);
				estimateMainWicBoqService.classByType.register(showWicGroupFilterIcon);
				estimateMainWicBoqService.changeFilter.register(changeFilter);
				estimateMainWicBoqService.clearWicBoqItemFilterIcon.register(clearWicBoqItemFilterIcon);



				$timeout(function () {
					$scope.$apply();
				});
				$scope.$on('$destroy', function () {

					estimateMainWicBoqService.unregisterSelectionChanged(estimateMainWicBoqService.creatorItemChanged);
					estimateMainCommonService.onLinkBoqItemSucceeded.unregister(reactOnLinkBoqItemSucceeded);
					estimateMainService.unregisterwicBoqFilterOffEvent(wicBoQFilterOff);
					estimateMainWicBoqService.onBarToolHighlightStatusChanged.unregister(toggleHighlight);

					estimateMainWicBoqService.classByType.unregister(showWicGroupFilterIcon);
					estimateMainWicBoqService.changeFilter.unregister(changeFilter);
					estimateMainWicBoqService.clearWicBoqItemFilterIcon.unregister(clearWicBoqItemFilterIcon);
					estimateWicGroupDataService.selectionChanged.unregister(wicGroupChanged);

				});

			}]);

})();
