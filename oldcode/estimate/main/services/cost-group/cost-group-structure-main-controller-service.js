
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';
	let estimateCommonModule = angular.module(moduleName);

	estimateCommonModule.factory('costGroupStructureMainControllerService', ['$injector','$timeout','platformGridAPI','basicsLookupdataLookupDescriptorService',
		'platformGridControllerService', 'estimateMainCommonUIService', 'estimateDefaultGridConfig', 'cloudCommonGridService', 'estimateMainLeadQuantityAggregatorDataService',
		function ($injector,$timeout,platformGridAPI,basicsLookupdataLookupDescriptorService, platformGridControllerService,
			estimateMainCommonUIService, estimateDefaultGridConfig, cloudCommonGridService, leadQuantityAggregatorDataService) {

			let service = {};

			service.initCostGroupController = function (scope, costGroupName,controllerName,costGroupCatalogService, groupStructureServiceName, clipboardService, filterService,estimateMainValidationService) {
				let dataService = $injector.get(groupStructureServiceName);
				let type =  costGroupName;
				let name =  costGroupName;


				let uiAttributes = ['Code', 'DescriptionInfo', 'Quantity', 'UomFk', 'Rule', 'Param', 'LeadQuantityCalc','NoLeadQuantity'];

				// assembly Cost Group container, no need the Rule and Param columns now
				if(groupStructureServiceName === 'estimateAssembliesCostGroupStructureDataServiceFactory') {
					uiAttributes = uiAttributes.filter(function(attr){
						return ! _.includes(['Rule', 'Param'], attr);
					});
				}

				let selectedRow = dataService.getSelected();
				let highlightedRow = dataService.getHightLightCostGrpStrus();
				if(selectedRow){
					dataService.creatorItemChanged(null,selectedRow)
				}
				else if(highlightedRow.length>0){
					dataService.creatorItemChanged(null,highlightedRow[0])
				}

				let gridConfig = angular.extend({
						marker : {
							filterService: filterService,
							filterId: controllerName,
							dataService: dataService,
							serviceName: groupStructureServiceName
						},
						parentProp: 'CostGroupFk', childProp: 'CostGroupChildren', childSort: true, propagateCheckboxSelection: true,type: clipboardService ? type : undefined,
						dragDropService: clipboardService ? clipboardService : undefined,
						skipPermissionCheck:true,
						cellChangeCallBack: function (arg) {
							let field = arg.grid.getColumns ()[arg.cell].field;

							if (field === 'Rule') {
								let ruleToDelete = dataService.getRuleToDelete ();
								if (!arg.item.Rule.length && ruleToDelete && ruleToDelete.length) {

									let platformDeleteSelectionDialogService = $injector.get ('platformDeleteSelectionDialogService');
									platformDeleteSelectionDialogService.showDialog ({
										dontShowAgain: true,
										id: '7a9f7da5c9b44e339d49ba149a905987'
									}).then (result => {
										if (result.ok || result.delete) {
											$injector.get('estimateMainService').deleteParamByPrjRule (arg.item, ruleToDelete, 'EstCostGrp');
										}
									});
								}
							}
						}

					}, estimateDefaultGridConfig),
					uiService = estimateMainCommonUIService.createUiService(uiAttributes, {serviceName: groupStructureServiceName, 'itemName':name}, false, true);

				platformGridControllerService.initListController(scope, uiService, dataService, estimateMainValidationService, gridConfig);

				scope.selectedItem = null;


				function selectedItemChanged() {
					$timeout(function () {
						scope.selectedItem = dataService.getSelected();
					}, 0, false);
				}
				dataService.registerSelectionChanged(selectedItemChanged);

				dataService.registerSelectionChanged(dataService.creatorItemChanged);

				function groupChanged(selectedGroup) {
					$timeout(function () {
						if(!selectedGroup){
							selectedGroup = costGroupCatalogService.getSelected();
						}

						getNavgCategoryList();
						// eslint-disable-next-line no-prototype-builtins
						if (selectedGroup && selectedGroup.hasOwnProperty('Id')) {
							dataService.loadCostGroup(selectedGroup.Id);

							let costGroupStructureList =  dataService.getData().itemTree;
							if(scope.mainCategoryList && scope.mainCategoryList.length){
								let costGroupStructure = _.filter(scope.mainCategoryList, {'CostGroupCatalogFk': selectedGroup.Id});

								if(costGroupStructure && costGroupStructure.length){
									let hightCostGroupStructure =  _.filter(costGroupStructureList, {'Id': costGroupStructure[0].Id});

									if(hightCostGroupStructure && hightCostGroupStructure.length){
										let ids = _.map(hightCostGroupStructure, 'Id');
										let rows = getGrid().dataView.mapIdsToRows(ids);
										getGrid().instance.setSelectedRows(rows, true);
									}
								}
							}

						}else{
							dataService.getData().itemTree.length = 0;
							dataService.getData().listLoaded.fire();
						}

					}, 0, false);
				}

				scope.removeFilter = function(id){
					_.remove(scope.mainCategoryList, function (item) {
						return  item.Id === id;
					});
					scope.isShowInfo = scope.mainCategoryList.length>0;

					// basicsLookupdataLookupDescriptorService.removeData('mainCategoryList');
					// basicsLookupdataLookupDescriptorService.updateData('mainCategoryList',scope.mainCategoryList);
					dataService.setHightLightCostGrpStrus(scope.mainCategoryList);
					getNavgCategoryList();
					let selectedGroup = costGroupCatalogService.getSelected();
					if (selectedGroup) {

						if (scope.mainCategoryList && scope.mainCategoryList.length) {
							let costGroupStructure = _.filter(scope.mainCategoryList, {'CostGroupCatalogFk': selectedGroup.Id});
							if (costGroupStructure && !costGroupStructure.length) {
								getGrid().instance.setSelectedRows({}, true);
							}
						}else{
							getGrid().instance.setSelectedRows({}, true);
						}
						platformGridAPI.grids.resize(scope.gridId);
					}
				};


				function expandNode(node,costGroupStructureList){
					if (node && node.Id && node.nodeInfo){
						node.nodeInfo.collapsed = false;
					}

					if (node && node.CostGroupFk){
						let parent = _.find(costGroupStructureList, { 'Id': node.CostGroupFk });
						expandNode(parent,costGroupStructureList);
					}
				}

				function  getParentCostGroup (node,costGroupStructureList){
					let parent = _.find(costGroupStructureList, { 'Id': node.CostGroupFk });
					if(!parent){
						return  node;
					}else{
						return getParentCostGroup(parent,costGroupStructureList);
					}
				}
				function showIcon(value) {
					let selectedGroupCatalog = costGroupCatalogService.getSelected();
					if (selectedGroupCatalog) {
						let treeList = costGroupCatalogService.getTree();
						_.forEach(treeList, function (item) {
							if (item.Id === selectedGroupCatalog.Id) {
								item.Image = selectedGroupCatalog.Image = value;
							}
						});


						// set the cost group structrue filter ismarkd = false
						if(!value) {
							let getGridObject = getGrid();
							if (getGridObject.dataView && getGridObject.dataView.getItems() && getGridObject.dataView.getItems().length) {

								let costGroupStructureList = [];
								cloudCommonGridService.flatten(getGridObject.dataView.getItems(), costGroupStructureList, 'CostGroupChildren');

								_.forEach(costGroupStructureList, function (cgs) {
									if(cgs.CostGroupCatalogFk === selectedGroupCatalog.Id ) {
										cgs.IsMarked = false;
									}
								});
							}
						}

						if(treeList && treeList.length){
							costGroupCatalogService.setTree(treeList);
						}
					}
				}


				// hight light the costGroupCatalog and the costGroupStrucute
				function hightLightData(costGrpStruList){
					let markedCostGrpStructurList = dataService.getFilters();
					let list = costGrpStruList ? costGrpStruList: dataService.getData().itemTree;

					let costGroupStructureList = [];
					cloudCommonGridService.flatten(list, costGroupStructureList, 'CostGroupChildren');


					// set the marked
					if(costGroupStructureList && costGroupStructureList.length) {
						if(markedCostGrpStructurList && markedCostGrpStructurList.length){
							_.forEach(markedCostGrpStructurList,function(item){
								_.forEach(costGroupStructureList,function(item2){
									if(item.Id === item2.Id){
										item2.IsMarked = item.IsMarked;
										expandNode(item2,costGroupStructureList);
									}
								});
							});
						}

						// set the hightlight
						if (scope.mainCategoryList && scope.mainCategoryList.length) {

							let selectedGroup = costGroupCatalogService.getSelected();
							let costGroupStructure =[];
							let ids =[];
							let rows = {};
							let getGridObject = getGrid();
							if (selectedGroup) {
								if (scope.mainCategoryList && scope.mainCategoryList.length) {
									costGroupStructure = _.filter(scope.mainCategoryList, {'CostGroupCatalogFk': selectedGroup.Id});
									if (costGroupStructure && !costGroupStructure.length && getGridObject.instance) {
										getGridObject.instance.setSelectedRows({}, true);
									} else if(getGridObject.instance) {
										let parentCostGroup = getParentCostGroup(costGroupStructure[0],costGroupStructureList);
										if (parentCostGroup && parentCostGroup.Id && parentCostGroup.nodeInfo){
											parentCostGroup.nodeInfo.collapsed = true;
											getGridObject.dataView.expandAllSubNodes(parentCostGroup);
										}
										if( getGridObject.dataView &&  getGridObject.dataView.getItems() &&  getGridObject.dataView.getItems().length){

											let gridItems = [];
											cloudCommonGridService.flatten(getGridObject.dataView.getItems(), gridItems, 'CostGroupChildren');
											_.forEach(markedCostGrpStructurList,function(cgs){
												let matchData = _.find(gridItems, { 'Id': cgs.Id });
												if(matchData){
													matchData.IsMarked = cgs.IsMarked;
												}
											});
										}
										ids = _.map(costGroupStructure, 'Id');
										rows = getGridObject.dataView.mapIdsToRows(ids);
										getGridObject.instance.setSelectedRows(rows, true);
									}
								} else {
									if (getGridObject.instance) {
										getGridObject.instance.setSelectedRows({}, true);
									}
								}
								platformGridAPI.grids.resize(scope.gridId);
							} else {
								let costGroupCatalogs = costGroupCatalogService.getTree();
								costGroupStructureList = dataService.getData().itemTree;

								let costGroupCatalogIds = _.uniq(_.map(costGroupStructureList, 'CostGroupCatalogFk'));

								// hight light  selected cost group catalog after change the container
								if (costGroupCatalogIds && costGroupCatalogIds.length) {
									let selectedCostGroupCatalog = _.filter(costGroupCatalogs, {'Id': costGroupCatalogIds[0]});

									// hight light the selected cost group after change the container
									costGroupStructure = _.filter(scope.mainCategoryList, {'CostGroupCatalogFk': selectedCostGroupCatalog.Id});


									let hightCostGroupStructure = _.filter(costGroupStructureList, {'Id': costGroupStructure[0].Id});
									if (costGroupStructure && costGroupStructure.length && hightCostGroupStructure) {
										ids = _.map(hightCostGroupStructure, 'Id');
										rows = getGridObject.dataView.mapIdsToRows(ids);
										getGridObject.instance.setSelectedRows(rows, true);
									}
								}
							}
						}
					}
					dataService.gridRefresh();
				}

				function getNavgCategoryList(){
					let mainCategoryList =  dataService.getHightLightCostGrpStrus();// basicsLookupdataLookupDescriptorService.getData('mainCategoryList');
					mainCategoryList = _.filter(mainCategoryList, function (item) {
						return item;
					});
					scope.mainCategoryList = mainCategoryList;
					scope.isShowInfo = mainCategoryList.length>0;
				}

				getNavgCategoryList();
				// hightLightData();

				function clearCostGrpNavgCategoryList()
				{
					scope.mainCategoryList.length =0;
					dataService.setHightLightCostGrpStrus(scope.mainCategoryList);
					dataService.clearFilters();
					// basicsLookupdataLookupDescriptorService.removeData('costGroupCatalogs');
				}

				costGroupCatalogService.selectionChanged.register(groupChanged);

				costGroupCatalogService.clearCostGrpNavgCategoryList.register(clearCostGrpNavgCategoryList);
				costGroupCatalogService.classByType.register(showIcon);

				function onSelectedRowsChanged(e,args){
					let rows = args.rows;
					let selectedItem = getGrid().instance.getDataItem(_.first(rows));
					let selectedGroup = costGroupCatalogService.getSelected();
					getNavgCategoryList();
					if(selectedItem && selectedGroup) {

						selectedItem.CostGroupCode = selectedGroup.Code;
						if (scope.mainCategoryList && scope.mainCategoryList.length > 0) {

							let existItemCostGroupCatalog = _.filter(scope.mainCategoryList, {'CostGroupCatalogFk': selectedItem.CostGroupCatalogFk});
							if (existItemCostGroupCatalog) {
								let dex = _.findIndex(scope.mainCategoryList,{'CostGroupCatalogFk':selectedItem.CostGroupCatalogFk});
								if(dex>-1){
									scope.mainCategoryList.splice(dex,1,selectedItem);
								}else{
									scope.mainCategoryList.push(selectedItem);
								}

							}else{
								scope.mainCategoryList.push(selectedItem);
							}

						} else {
							scope.mainCategoryList.push(selectedItem);
						}

					}

					// basicsLookupdataLookupDescriptorService.removeData('mainCategoryList');
					// basicsLookupdataLookupDescriptorService.updateData('mainCategoryList',scope.mainCategoryList);
					dataService.setHightLightCostGrpStrus(scope.mainCategoryList);
					getNavgCategoryList();
					scope.isShowInfo = scope.mainCategoryList.length>0;
				}

				function getGrid(){
					return  platformGridAPI.grids.element('id', scope.gridId);
				}

				function clearFilter() {
					let costGroupCatalogs = costGroupCatalogService.getTree();
					_.forEach(costGroupCatalogs, function (item) {
						item.Image = '';
					});


					let getGridObject = getGrid();
					if (getGridObject.dataView && getGridObject.dataView.getItems() && getGridObject.dataView.getItems().length) {
						_.forEach(getGridObject.dataView.getItems(), function (cgs) {
							cgs.IsMarked = false;
						});
					}

					dataService.clearFilters();

					costGroupCatalogService.setTree(costGroupCatalogs);

					_.forEach(scope.mainCategoryList, function (item) {
						item.IsMarked = null;
					});

					dataService.gridRefresh();
				}

				function changeFilter(costGroupCatNode){
					let filterDatas =dataService.getFilters();
					dataService.markersChanged(filterDatas,costGroupCatNode,true);
				}

				let btns  =['delete','createChild','create','t14','d0'];

				scope.tools.items = _.filter(scope.tools.items,function(item){
					return !btns.includes(item.id);
				});
				// platformGridAPI.events.register(scope.gridId, 'onFilterChanged', onFilterChangedGrid);
				platformGridAPI.events.register(scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				if( dataService.hightLigthData){
					dataService.hightLigthData.register(hightLightData);
				}

				if( dataService.removeFitlerIcon){
					dataService.removeFitlerIcon.register(clearFilter);
				}

				if(dataService.changeFilter){
					dataService.changeFilter.register(changeFilter);
				}

				let isClear = costGroupCatalogService.getclearCostGrpNavgCategory();
				if(isClear){
					costGroupCatalogService.clearCostGrpNavgCategoryList.fire();
					costGroupCatalogService.setclearCostGrpNavgCategory(false);
				}

				function updateAggregator(items){
					dataService.addEntitiesToModified(items);
					dataService.gridRefresh();
				}

				leadQuantityAggregatorDataService.onCostGroupLeadQtyAggregatorUpdated.register(updateAggregator);

				scope.$on('$destroy', function () {
					dataService.unregisterSelectionChanged(selectedItemChanged);
					dataService.unregisterSelectionChanged(dataService.creatorItemChanged);
					costGroupCatalogService.clearCostGrpNavgCategoryList.unregister(clearCostGrpNavgCategoryList);

					costGroupCatalogService.selectionChanged.unregister(groupChanged);
					costGroupCatalogService.classByType.unregister(showIcon);
					platformGridAPI.events.unregister(scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					leadQuantityAggregatorDataService.onCostGroupLeadQtyAggregatorUpdated.unregister(updateAggregator);

					if( dataService.hightLigthData){
						dataService.hightLigthData.unregister(hightLightData);
					}

					if( dataService.removeFitlerIcon){
						dataService.removeFitlerIcon.unregister(clearFilter);
					}
					if(dataService.changeFilter){
						dataService.changeFilter.unregister(changeFilter);
					}
				});
			};

			return service;
		}]);
})(angular);
